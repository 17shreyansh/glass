// services/OrderService.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const DeliveryCharge = require('../models/DeliveryCharge');
const PaymentService = require('./PaymentService');

class OrderService {
    constructor() {
        // You might want to initialize anything here if needed
    }

    /**
     * Validates items, calculates totals, applies coupons, and prepares product stock updates.
     * @param {Array<object>} items - Array of items in the cart [{ _id, size, color, quantity }]
     * NOTE: `_id` in the cart item refers to the productId.
     * @param {object} shippingAddress - The shipping address for delivery charge calculation (if applicable).
     * @param {string} [couponCode] - Optional coupon code to apply.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<object>} - Object containing validated items, calculated totals, coupon details, and product updates.
     * @throws {Error} - If validation fails (e.g., product not found, insufficient stock, invalid coupon).
     */
    async validateAndCalculateOrder(items, shippingAddress, couponCode, userId) {
        let subtotal = 0;
        const validatedItems = [];
        const productUpdates = [];

        if (!items || items.length === 0) {
            throw new Error('Order must contain at least one item.');
        }

        for (const item of items) {
            // Validate item data
            if (!item._id || !item.quantity || item.quantity <= 0) {
                throw new Error('Invalid item data provided. Missing product ID or quantity.');
            }
            
            // Find the product
            const product = await Product.findById(item._id);
            if (!product) {
                throw new Error(`Product with ID ${item._id} not found.`);
            }

            if (!product.isActive) {
                throw new Error(`Product ${product.name} is no longer available.`);
            }

            let itemPrice = product.price;
            let availableStock = 0;
            let selectedVariant = null;

            // Check if product uses variants
            if (Array.isArray(product.variants) && product.variants.length > 0) {
                // If size and color provided, find matching variant
                if (item.size && item.color) {
                    selectedVariant = product.variants.find(v => {
                        const attrs = v.attributes instanceof Map ? v.attributes : new Map(Object.entries(v.attributes || {}));
                        const vSize = attrs.get('Size') || attrs.get('size');
                        const vColor = attrs.get('Color') || attrs.get('color');
                        return vSize?.toString().toLowerCase() === item.size?.toString().toLowerCase() && 
                               vColor?.toLowerCase() === item.color?.toLowerCase();
                    });

                    if (!selectedVariant) {
                        throw new Error(`Product "${product.name}" does not have variant: Size "${item.size}", Color "${item.color}". Please select a valid variant.`);
                    }
                    
                    availableStock = selectedVariant.stock || 0;
                } else {
                    // No size/color specified, use first variant
                    selectedVariant = product.variants[0];
                    availableStock = selectedVariant.stock || 0;
                }
            } else {
                // No variants - check totalStock
                availableStock = product.totalStock || 0;
            }

            // Check stock
            if (availableStock < item.quantity) {
                throw new Error(`Insufficient stock for "${product.name}". Available: ${availableStock}, Requested: ${item.quantity}`);
            }

            subtotal += itemPrice * item.quantity;
            validatedItems.push({
                productId: product._id,
                name: product.name,
                image: product.mainImage,
                size: item.size || (selectedVariant ? Object.fromEntries(selectedVariant.attributes || new Map()).Size : 'N/A'),
                color: item.color || (selectedVariant ? Object.fromEntries(selectedVariant.attributes || new Map()).Color : 'N/A'),
                quantity: item.quantity,
                price: itemPrice,
            });
            
            // Track stock updates for products with variants
            if (selectedVariant) {
                productUpdates.push({
                    productId: product._id,
                    size: validatedItems[validatedItems.length - 1].size,
                    color: validatedItems[validatedItems.length - 1].color,
                    quantity: item.quantity
                });
            }
        }

        // Calculate Delivery Charge
        const deliveryChargeDoc = await DeliveryCharge.findOne({
            city: shippingAddress.city?.toLowerCase(),
            state: shippingAddress.state?.toLowerCase()
        });
        
        // Default delivery charge if no specific city/state charge is found
        let deliveryCharge = deliveryChargeDoc ? deliveryChargeDoc.charge : 50; // Default to 50 if no charge found
        
        // Validate numeric values
        if (typeof subtotal !== 'number' || isNaN(subtotal)) {
            throw new Error('Invalid subtotal amount');
        }
        if (typeof deliveryCharge !== 'number' || isNaN(deliveryCharge)) {
            throw new Error('Invalid delivery charge amount');
        }
        
        let discountAmount = 0;
        let discountOnDelivery = 0;
        let couponUsed = null;

        // Apply Coupon (if provided)
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

            if (coupon) {
                if (coupon.minPurchaseAmount && subtotal < coupon.minPurchaseAmount) {
                    throw new Error(`Coupon "${coupon.code}" requires a minimum purchase of ₹${coupon.minPurchaseAmount}.`);
                }
                const userCouponUses = coupon.usedBy.filter(u => u.userId.toString() === userId.toString()).length;
                if (coupon.usageLimitPerUser && userCouponUses >= coupon.usageLimitPerUser) {
                    throw new Error(`You have already used coupon "${coupon.code}" the maximum number of times.`);
                }
                if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                    throw new Error(`Coupon "${coupon.code}" has reached its maximum usage limit.`);
                }
                if (coupon.expirationDate && new Date() > coupon.expirationDate) {
                    throw new Error(`Coupon "${coupon.code}" has expired.`);
                }

                // Calculate discount based on coupon type
                if (coupon.type === 'PERCENTAGE') {
                    discountAmount = (subtotal * coupon.value) / 100;
                    // Apply maximum discount if specified
                    if (coupon.maximumDiscountAmount) {
                        discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
                    }
                    couponUsed = {
                        couponId: coupon._id,
                        code: coupon.code,
                        type: 'PERCENTAGE',
                        value: coupon.value,
                        discountAmount: discountAmount,
                        discountOnDelivery: 0
                    };
                } else if (coupon.type === 'FIXED_AMOUNT') {
                    discountAmount = Math.min(coupon.value, subtotal); // Don't allow discount greater than subtotal
                    couponUsed = {
                        couponId: coupon._id,
                        code: coupon.code,
                        type: 'FIXED_AMOUNT',
                        value: coupon.value,
                        discountAmount: discountAmount,
                        discountOnDelivery: 0
                    };
                } else if (coupon.type === 'FREE_SHIPPING') {
                    discountOnDelivery = deliveryCharge;
                    couponUsed = {
                        couponId: coupon._id,
                        code: coupon.code,
                        type: 'FREE_SHIPPING',
                        value: deliveryCharge,
                        discountAmount: 0,
                        discountOnDelivery: discountOnDelivery
                    };
                }

                discountAmount = Math.min(discountAmount, subtotal);
            } else {
                throw new Error(`Invalid coupon code: ${couponCode}`);
            }
        }

        // Ensure all numeric values are valid before calculating total
        if (typeof discountAmount !== 'number' || isNaN(discountAmount)) {
            console.warn('Invalid discount amount, setting to 0');
            discountAmount = 0;
        }
        if (typeof discountOnDelivery !== 'number' || isNaN(discountOnDelivery)) {
            console.warn('Invalid delivery discount, setting to 0');
            discountOnDelivery = 0;
        }

        // Calculate GST (18% on subtotal after discount)
        const taxableAmount = subtotal - discountAmount;
        const gstAmount = Math.round((taxableAmount * 0.18) * 100) / 100;
        
        const totalAmount = Math.max(0, subtotal - discountAmount + gstAmount + deliveryCharge - discountOnDelivery);
        
        // Final validation of total amount
        if (typeof totalAmount !== 'number' || isNaN(totalAmount) || totalAmount < 0) {
            throw new Error('Invalid total amount calculated');
        }

        return {
            validatedItems: validatedItems,
            subtotal: subtotal,
            deliveryCharge: deliveryCharge,
            discountAmount: discountAmount,
            discountOnDelivery: discountOnDelivery,
            gstAmount: gstAmount,
            totalAmount: totalAmount,
            couponUsed: couponUsed,
            productUpdates: productUpdates
        };
    }

    /**
     * Creates a new order after payment confirmation for Razorpay orders
     * For COD orders, creates the order immediately
     */
    async createOrder(orderData, userId) {
        const {
            items,
            shippingAddress,
            paymentMethod,
            couponCode,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = orderData;

        // Validate and calculate order details
        const calculation = await this.validateAndCalculateOrder(
            items,
            shippingAddress,
            couponCode,
            userId
        );

        // Create the order object with initial state
        const orderObj = {
            userId,
            items: calculation.validatedItems,
            shippingAddress,
            subtotal: calculation.subtotal,
            deliveryCharge: calculation.deliveryCharge,
            discountAmount: calculation.discountAmount,
            discountOnDelivery: calculation.discountOnDelivery,
            gstAmount: calculation.gstAmount,
            totalAmount: calculation.totalAmount,
            couponUsed: calculation.couponUsed,
            payment: {
                method: paymentMethod,
                status: 'PENDING'
            },
            status: 'PENDING'
        };

        // For Razorpay payments with verification
        if (paymentMethod === 'RAZORPAY' && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
            const isValid = await PaymentService.verifyPaymentSignature(
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            );

            if (!isValid) {
                throw new Error('Payment signature verification failed');
            }

            orderObj.payment.razorpayOrderId = razorpayOrderId;
            orderObj.payment.razorpayPaymentId = razorpayPaymentId;
            orderObj.payment.razorpaySignature = razorpaySignature;
            orderObj.payment.status = 'PAID';
            orderObj.status = 'CONFIRMED';
            orderObj.paidAt = new Date();
            orderObj.confirmedAt = new Date();
        }

        // Create and save the order
        const order = new Order(orderObj);
        await order.save();

        // Only update stock and coupon usage for confirmed orders or COD orders
        if (orderObj.status === 'CONFIRMED' || paymentMethod === 'COD') {
            // Update product stock only if there are updates to process
            if (calculation.productUpdates && calculation.productUpdates.length > 0) {
                for (const itemUpdate of calculation.productUpdates) {
                    const product = await Product.findById(itemUpdate.productId);
                    if (!product) {
                        console.error(`Product ${itemUpdate.productId} not found during stock update.`);
                        continue;
                    }

                    const currentStock = product.getStockForVariant(itemUpdate.size, itemUpdate.color);
                    const success = product.updateVariantStock(
                        itemUpdate.size,
                        itemUpdate.color,
                        currentStock - itemUpdate.quantity
                    );

                    if (success) {
                        await product.save();
                        console.log(`Updated stock for ${product.name} (Size: ${itemUpdate.size}, Color: ${itemUpdate.color})`);
                    } else {
                        console.error(`Failed to update stock for ${product.name} (Size: ${itemUpdate.size}, Color: ${itemUpdate.color})`);
                    }
                }
            }

            // Update coupon usage if applicable
            if (calculation.couponUsed) {
                const coupon = await Coupon.findById(calculation.couponUsed.couponId);
                if (coupon) {
                    coupon.usedCount += 1;
                    coupon.usedBy.push({ userId, orderId: order._id });
                    await coupon.save();
                }
            }
        }

        // Return populated order
        return Order.findById(order._id)
            .populate('userId', 'name email')
            .populate({
                path: 'items.productId',
                select: 'name slug mainImage price'
            });
    }

    /**
     * Confirms a payment from Razorpay webhook/callback and updates the order status.
     * @param {string} razorpayOrderId - The order ID from Razorpay.
     * @param {object} paymentData - The full payment payload from Razorpay (contains razorpay_payment_id, razorpay_signature).
     * @returns {Promise<Order>} - The updated and confirmed order document.
     * @throws {Error} - If order not found, signature invalid, or payment update fails.
     */
    async confirmPayment(razorpayOrderId, paymentData) {
        const order = await Order.findOne({ 'payment.razorpayOrderId': razorpayOrderId });

        if (!order) {
            console.error(`[confirmPayment Service] Order not found for Razorpay Order ID: ${razorpayOrderId}`);
            throw new Error('Order not found for payment verification.');
        }

        // Verify payment signature
        const isValidSignature = PaymentService.verifyPaymentSignature(
            razorpayOrderId,
            paymentData.razorpay_payment_id,
            paymentData.razorpay_signature
        );

        if (!isValidSignature) {
            console.error(`[confirmPayment Service] Invalid Razorpay signature for order ID: ${razorpayOrderId}`);
            order.payment.status = 'FAILED';
            order.payment.failureReason = 'Invalid payment signature';
            await order.save();
            throw new Error('Invalid payment signature.');
        }

        // Update order status
        order.payment.status = 'PAID';
        order.status = 'CONFIRMED';
        order.payment.razorpayPaymentId = paymentData.razorpay_payment_id;
        order.payment.razorpaySignature = paymentData.razorpay_signature;
        order.paidAt = new Date();
        order.confirmedAt = new Date();

        // Update stock for each item
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                console.error(`Product ${item.productId} not found during stock update.`);
                continue;
            }

            const currentStock = product.getStockForVariant(item.size, item.color);
            const success = product.updateVariantStock(
                item.size,
                item.color,
                currentStock - item.quantity
            );

            if (success) {
                await product.save();
                console.log(`Updated stock for ${product.name} (Size: ${item.size}, Color: ${item.color})`);
            } else {
                console.error(`Failed to update stock for ${product.name} (Size: ${item.size}, Color: ${item.color})`);
            }
        }

        // Update coupon usage if applicable
        if (order.couponUsed) {
            const coupon = await Coupon.findById(order.couponUsed.couponId);
            if (coupon) {
                coupon.usedCount += 1;
                coupon.usedBy.push({ userId: order.userId, orderId: order._id });
                await coupon.save();
            }
        }

        await order.save();
        console.log(`[confirmPayment Service] Order ${order._id} payment confirmed and updated to PAID/CONFIRMED.`);

        return order;
    }

    /**
     * Retrieves orders based on filters and pagination.
     * @param {object} filters - MongoDB query filters.
     * @param {object} pagination - Pagination options { page, limit }.
     * @returns {Promise<object>} - Object containing orders, total count, and pagination info.
     */
    async getOrders(filters, pagination) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const query = Order.find(filters)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const orders = await query.exec();
        const totalDocs = await Order.countDocuments(filters);

        return {
            orders,
            totalDocs,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            hasNextPage: page * limit < totalDocs,
            hasPrevPage: page > 1,
        };
    }

    /**
     * Cancels an order and handles stock reversion and refunds (if applicable).
     * @param {string} orderId - The ID of the order to cancel.
     * @param {string} userId - The ID of the user attempting to cancel (for authorization).
     * @returns {Promise<Order>} - The updated cancelled order document.
     * @throws {Error} - If order not found, unauthorized, or cannot be cancelled in its current state.
     */
    async cancelOrder(orderId, userId) {
        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            throw new Error('Order not found or you do not have permission to cancel this order.');
        }

        if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
            throw new Error('Order cannot be cancelled. It is already being processed or delivered.');
        }

        order.status = 'CANCELLED';
        order.cancelledAt = new Date();

        if (order.payment.status === 'PAID' && order.payment.razorpayPaymentId) {
            console.log(`[cancelOrder Service] Initiating refund for order ${order._id}, payment ID: ${order.payment.razorpayPaymentId}`);
            const refundResult = await PaymentService.refundPayment(
                order.payment.razorpayPaymentId,
                order.totalAmount,
                'Order cancelled by user'
            );

            if (refundResult.success) {
                order.payment.status = 'REFUNDED';
                console.log(`[cancelOrder Service] Refund successful for order ${order._id}. Refund ID: ${refundResult.refundId}`);
            } else {
                console.error(`[cancelOrder Service] Refund failed for order ${order._id}:`, refundResult.error);
                throw new Error(`Order cancellation processed, but refund failed: ${refundResult.error}. Please contact support.`);
            }
        }

        // Revert stock for cancelled orders
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product && product.variants && product.variants.length > 0) {
                const currentStock = product.getStockForVariant(item.size, item.color);
                const success = product.updateVariantStock(
                    item.size,
                    item.color,
                    currentStock + item.quantity
                );

                if (success) {
                    await product.save();
                    console.log(`Reverted stock for ${product.name} (Size: ${item.size}, Color: ${item.color}) by ${item.quantity}`);
                } else {
                    console.warn(`Failed to revert stock for product ${product.name} (Size: ${item.size}, Color: ${item.color}) during order cancellation.`);
                }
            } else {
                console.warn(`Product ${item.productId} not found or has no variants during stock reversion for order ${orderId}.`);
            }
        }

        await order.save();
        return order;
    }

    /**
     * Admin function to get a single order by ID or orderNumber.
     * @param {string} orderIdentifier - The order's _id or orderNumber.
     * @returns {Promise<Order>} - The found and populated order document.
     * @throws {Error} - If order not found.
     */
    async getSingleOrderAdmin(orderIdentifier) {
        const order = await Order.findOne({
            $or: [{ _id: orderIdentifier }, { orderNumber: orderIdentifier }]
        })
        .populate('userId', 'name email')
        .populate({
            path: 'items.productId',
            select: 'name slug mainImage price'
        })
        .populate('couponUsed.couponId', 'name description');

        if (!order) {
            throw new Error('Order not found.');
        }
        return order;
    }

    /**
     * Admin function to update an order's status and handle related actions like refunds.
     * @param {string} orderId - The ID of the order to update.
     * @param {object} updateData - Data for the update { status, trackingNumber, notes }.
     * @returns {Promise<Order>} - The updated order document.
     * @throws {Error} - If order not found or update fails.
     */
    async updateOrderStatus(orderId, updateData) {
        const { status, trackingNumber, notes } = updateData;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found.');
        }

        order.status = status.toUpperCase();
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (notes) order.notes = notes;

        const now = new Date();
        switch (order.status) {
            case 'CONFIRMED':
                if (!order.confirmedAt) order.confirmedAt = now;
                break;
            case 'SHIPPED':
                if (!order.shippedAt) order.shippedAt = now;
                break;
            case 'DELIVERED':
                if (!order.deliveredAt) order.deliveredAt = now;
                break;
            case 'CANCELLED':
                if (!order.cancelledAt) order.cancelledAt = now;
                if (order.payment.status === 'PAID' && order.payment.razorpayPaymentId) {
                    const refundResult = await PaymentService.refundPayment(
                        order.payment.razorpayPaymentId,
                        order.totalAmount,
                        'Order cancelled by admin'
                    );
                    if (refundResult.success) {
                        order.payment.status = 'REFUNDED';
                    } else {
                        console.error(`Admin initiated refund failed for order ${orderId}:`, refundResult.error);
                        throw new Error(`Order status updated to CANCELLED, but refund failed: ${refundResult.error}`);
                    }
                }
                // Revert stock
                for (const item of order.items) {
                    const product = await Product.findById(item.productId);
                    if (product && product.variants && product.variants.length > 0) {
                        const currentStock = product.getStockForVariant(item.size, item.color);
                        const success = product.updateVariantStock(
                            item.size,
                            item.color,
                            currentStock + item.quantity
                        );
                        if (success) {
                            await product.save();
                            console.log(`Reverted stock for ${product.name} (Size: ${item.size}, Color: ${item.color})`);
                        }
                    }
                }
                break;
            case 'REFUNDED':
                if (order.payment.status !== 'REFUNDED') order.payment.status = 'REFUNDED';
                break;
            default:
                break;
        }

        await order.save();
        return order;
    }

    /**
     * Cleans up abandoned or pending orders that are older than the specified time
     * @param {number} maxAgeMinutes - Maximum age of pending orders in minutes
     * @returns {Promise<number>} - Number of orders cleaned up
     */
    async cleanupPendingOrders(maxAgeMinutes = 30) {
        const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);

        // Find abandoned Razorpay orders
        const abandonedOrders = await Order.find({
            createdAt: { $lt: cutoffTime },
            'payment.method': 'RAZORPAY',
            'payment.status': 'PENDING',
            status: 'PENDING'
        });

        let cleanedCount = 0;
        for (const order of abandonedOrders) {
            try {
                // Cancel the order
                order.status = 'CANCELLED';
                order.payment.status = 'FAILED';
                order.payment.failureReason = 'Payment timeout';
                order.cancelledAt = new Date();
                await order.save();

                // Log the cleanup
                console.log(`[cleanupPendingOrders] Cleaned up abandoned order: ${order._id}`);
                cleanedCount++;
            } catch (error) {
                console.error(`[cleanupPendingOrders] Error cleaning up order ${order._id}:`, error);
            }
        }

        return cleanedCount;
    }
}

module.exports = OrderService;