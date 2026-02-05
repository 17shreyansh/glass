const OrderService = require('../services/OrderService');
const PaymentService = require('../services/PaymentService');
const shiprocketService = require('../services/shiprocket.service');
const Order = require('../models/Order');
const User = require('../models/User');
const Settings = require('../models/Settings');
const PDFDocument = require('pdfkit');

const COD_MAX_AMOUNT = 2000;

// Initialize OrderService
const orderService = new OrderService();

// USER CONTROLLERS

// Consolidated Create Order (Handles both COD and Razorpay initiation)
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, shippingAddress, paymentMethod, couponCode } = req.body;

        // 1. Validate and calculate order
        const calculation = await orderService.validateAndCalculateOrder(
            items,
            shippingAddress,
            couponCode,
            userId
        );

        // For Razorpay payments, create Razorpay order first
        if (paymentMethod === 'RAZORPAY') {
            // Get user's email for Razorpay notes
            const user = await User.findById(userId);
            const userEmail = user ? user.email : 'guest@example.com';

            // Validate amount before converting to paise
            if (typeof calculation.totalAmount !== 'number' || isNaN(calculation.totalAmount) || calculation.totalAmount <= 0) {
                throw new Error('Invalid order amount for Razorpay payment');
            }

            // Convert amount to paise and ensure it's a whole number
            const amountInPaise = Math.round(calculation.totalAmount * 100);

            // Create receipt ID
            const tempReceiptId = `ORDER_${Date.now()}`;
            const shortUserId = String(userId).substring(0, 10);
            const receiptForRazorpay = `${tempReceiptId}_${shortUserId}`;

            // Create Razorpay order
            const razorpayOrderResponse = await PaymentService.createRazorpayOrder(
                amountInPaise,
                receiptForRazorpay,
                userEmail
            );

            if (!razorpayOrderResponse.success) {
                return res.status(400).json({
                    message: 'Failed to initiate online payment.',
                    error: razorpayOrderResponse.error
                });
            }

            // For Razorpay payments, don't create the order yet
            // Just return the payment details and calculation
            return res.status(201).json({
                success: true,
                message: 'Payment initiation successful',
                orderData: {
                    items,
                    shippingAddress,
                    paymentMethod,
                    couponCode,
                    userId
                },
                razorpayDetails: {
                    orderId: razorpayOrderResponse.orderId,
                    amount: razorpayOrderResponse.amount,
                    currency: razorpayOrderResponse.currency,
                    key: process.env.RAZORPAY_KEY_ID
                },
                orderCalculation: calculation
            });
        }

        // For COD orders, validate maximum amount
        if (paymentMethod === 'COD' && calculation.totalAmount > COD_MAX_AMOUNT) {
            throw new Error(`Cash on Delivery is only available for orders up to ₹${COD_MAX_AMOUNT}`);
        }

        // For COD orders, create the order immediately
        const order = await orderService.createOrder({
            items,
            shippingAddress,
            paymentMethod,
            couponCode
        }, userId);

        // Return the created order
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order,
            orderNumber: order.orderNumber,
            orderCalculation: {
                subtotal: calculation.subtotal,
                discountAmount: calculation.discountAmount,
                gstAmount: calculation.gstAmount,
                totalAmount: calculation.totalAmount,
                savings: calculation.discountAmount
            }
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(400).json({ message: error.message });
    }
};


// Verify payment and confirm order
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData
        } = req.body;

        console.log('[verifyPayment] Payment verification started:', {
            razorpayOrderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            orderData: orderData
        });

        // First verify the payment signature
        const isValid = await PaymentService.verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            throw new Error('Payment signature validation failed');
        }

        // Use authenticated user's ID
        const userId = req.user.id;

        // Create or update the order with verified Razorpay details
        const order = await orderService.createOrder({
            ...orderData,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
        }, userId);

        // If order is created successfully, send the response
        res.json({
            success: true,
            message: 'Payment verified and order confirmed successfully',
            order
        });

    } catch (error) {
        console.error('[verifyPayment] Error:', error);
        res.status(400).json({ 
            success: false,
            message: error.message || 'Payment verification failed' 
        });
    }
};

// Apply coupon to cart (remains same)
const applyCoupon = async (req, res) => {
    try {
        const { couponCode, items, shippingAddress } = req.body;
        const userId = req.user.id;

        const calculation = await orderService.validateAndCalculateOrder(
            items,
            shippingAddress,
            couponCode,
            userId
        );

        res.json({
            success: true,
            message: 'Coupon applied successfully',
            calculation: {
                subtotal: calculation.subtotal,
                discountAmount: calculation.discountAmount,
                gstAmount: calculation.gstAmount,
                totalAmount: calculation.totalAmount,
                savings: calculation.discountAmount,
                coupon: calculation.couponUsed
            }
        });

    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get user orders (remains same)
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const filters = { userId };
        if (status) filters.status = status.toUpperCase();

        const result = await orderService.getOrders(filters, { page, limit });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// Get single order (remains same, but consider if this should also allow lookup by razorpayOrderId for convenience)
const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            $or: [{ _id: orderId }, { orderNumber: orderId }],
            userId
        })
            .populate('userId', 'name email')
            .populate('items.productId', 'slug')
            .populate('couponUsed.couponId', 'name description');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ success: true, order });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
};

// Cancel order (remains same)
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await orderService.cancelOrder(orderId, userId);

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(400).json({ message: error.message });
    }
};

// ADMIN CONTROLLERS (remain same)

// Get all orders (admin)
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;

        const filters = {};
        if (status) filters.status = status.toUpperCase();
        if (search) {
            filters.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
            ];
        }

        const result = await orderService.getOrders(filters, { page, limit });

        // Get order statistics
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.json({
            success: true,
            ...result,
            stats
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, trackingNumber, notes } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status.toUpperCase();
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (notes) order.notes = notes;

        // Update timestamps based on status
        const now = new Date();
        switch (status.toUpperCase()) {
            case 'CONFIRMED':
                order.confirmedAt = now;
                break;
            case 'SHIPPED':
                order.shippedAt = now;
                break;
            case 'DELIVERED':
                order.deliveredAt = now;
                break;
            case 'CANCELLED':
                order.cancelledAt = now;
                // Handle refund if needed
                if (order.payment.status === 'PAID' && order.payment.razorpayPaymentId) {
                    const refundResult = await PaymentService.refundPayment(
                        order.payment.razorpayPaymentId,
                        order.totalAmount,
                        'Order cancelled by admin'
                    );
                    if (refundResult.success) {
                        order.payment.status = 'REFUNDED';
                    }
                }
                break;
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

// Toggle COD availability (admin) (remains same)
const toggleCOD = async (req, res) => {
    try {
        const { enabled } = req.body;

        await Settings.findOneAndUpdate(
            { key: 'COD_ENABLED' },
            { key: 'COD_ENABLED', value: enabled },
            { upsert: true }
        );

        res.json({
            success: true,
            message: `COD ${enabled ? 'enabled' : 'disabled'} successfully`,
            codEnabled: enabled
        });

    } catch (error) {
        console.error('Toggle COD error:', error);
        res.status(500).json({ message: 'Failed to update COD settings' });
    }
};

// Get COD status (remains same)
const getCODStatus = async (req, res) => {
    try {
        const setting = await Settings.findOne({ key: 'COD_ENABLED' });
        const codEnabled = setting ? setting.value : true; // Default to enabled

        res.json({
            success: true,
            codEnabled
        });

    } catch (error) {
        console.error('Get COD status error:', error);
        res.status(500).json({ message: 'Failed to fetch COD status' });
    }
};

// Helper function to generate invoice PDF
const generateInvoicePDF = (order) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
            const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            // Header
            doc.fontSize(24).fillColor('#8E6A4E').text('INVOICE', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#333').text(`Order #${order.orderNumber}`, { align: 'center' });
            doc.fontSize(10).fillColor('#666').text(`Date: ${formatDate(order.createdAt)}`, { align: 'center' });
            doc.moveDown(2);

            // Bill To & Ship To
            const leftColumn = 50;
            const rightColumn = 320;
            let yPos = doc.y;

            doc.fontSize(11).fillColor('#333').text('Bill To:', leftColumn, yPos);
            doc.fontSize(10).fillColor('#666')
                .text(order.userId.name || 'N/A', leftColumn, yPos + 15)
                .text(order.userId.email || 'N/A', leftColumn, yPos + 30)
                .text(order.shippingAddress.phone || 'N/A', leftColumn, yPos + 45);

            doc.fontSize(11).fillColor('#333').text('Ship To:', rightColumn, yPos);
            doc.fontSize(10).fillColor('#666')
                .text(order.shippingAddress.fullName || order.userId.name || 'N/A', rightColumn, yPos + 15)
                .text(order.shippingAddress.address || 'N/A', rightColumn, yPos + 30, { width: 230 })
                .text(`${order.shippingAddress.city || 'N/A'}, ${order.shippingAddress.state || 'N/A'} - ${order.shippingAddress.pincode || 'N/A'}`, rightColumn, yPos + 60);

            doc.moveDown(5);

            // Items Table
            const tableTop = doc.y + 20;
            doc.fontSize(10).fillColor('#333');
            
            // Table Header
            doc.rect(50, tableTop, 495, 25).fillAndStroke('#f5f5f5', '#ddd');
            doc.fillColor('#333')
                .text('Item', 60, tableTop + 8)
                .text('Qty', 320, tableTop + 8, { width: 40, align: 'center' })
                .text('Price', 370, tableTop + 8, { width: 70, align: 'right' })
                .text('Total', 450, tableTop + 8, { width: 85, align: 'right' });

            // Table Items
            let itemY = tableTop + 30;
            order.items.forEach((item, i) => {
                doc.fontSize(9).fillColor('#333')
                    .text(item.productId?.name || item.name || 'Product', 60, itemY, { width: 250 })
                    .text(item.quantity.toString(), 320, itemY, { width: 40, align: 'center' })
                    .text(formatCurrency(item.price), 370, itemY, { width: 70, align: 'right' })
                    .text(formatCurrency(item.price * item.quantity), 450, itemY, { width: 85, align: 'right' });
                
                itemY += 25;
                if (i < order.items.length - 1) {
                    doc.moveTo(50, itemY - 5).lineTo(545, itemY - 5).stroke('#eee');
                }
            });

            // Summary
            doc.moveDown(2);
            const summaryX = 370;
            let summaryY = itemY + 20;

            doc.fontSize(10).fillColor('#666')
                .text('Subtotal:', summaryX, summaryY)
                .text(formatCurrency(order.subtotal), 450, summaryY, { width: 85, align: 'right' });
            
            if (order.discountAmount > 0) {
                summaryY += 20;
                doc.fillColor('#6B8E23')
                    .text('Discount:', summaryX, summaryY)
                    .text(`-${formatCurrency(order.discountAmount)}`, 450, summaryY, { width: 85, align: 'right' });
            }

            summaryY += 20;
            doc.fillColor('#666')
                .text('GST (18%):', summaryX, summaryY)
                .text(formatCurrency(order.gstAmount || 0), 450, summaryY, { width: 85, align: 'right' });

            summaryY += 25;
            doc.moveTo(370, summaryY - 5).lineTo(545, summaryY - 5).stroke('#333');
            doc.fontSize(12).fillColor('#8E6A4E')
                .text('Total:', summaryX, summaryY + 5, { continued: false })
                .text(formatCurrency(order.totalAmount), 450, summaryY + 5, { width: 85, align: 'right' });

            summaryY += 35;
            doc.fontSize(9).fillColor('#666')
                .text(`Payment: ${order.paymentMethod} (${order.payment?.status || 'N/A'})`, summaryX, summaryY);

            // Footer
            doc.fontSize(10).fillColor('#8E6A4E')
                .text('Thank you for your business!', 50, 750, { align: 'center', width: 495 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

// Get order invoice
const getOrderInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        // Find order and validate ownership
        const order = await Order.findOne({
            $or: [{ _id: orderId }, { orderNumber: orderId }],
            userId
        })
        .populate('userId', 'name email')
        .populate('items.productId', 'name');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Generate invoice PDF
        const pdfBuffer = await generateInvoicePDF(order);

        // Send PDF response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ message: 'Failed to generate invoice' });
    }
};

// Check pincode serviceability
const checkPincodeServiceability = async (req, res) => {
    try {
        const { pincode } = req.query;
        const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '110001';
        
        const result = await shiprocketService.checkServiceability(pickupPincode, pincode);
        
        res.json({
            success: result.success,
            available: result.available,
            couriers: result.couriers
        });
    } catch (error) {
        console.error('Pincode check error:', error);
        res.status(500).json({ message: 'Failed to check serviceability' });
    }
};

// Ship order via Shiprocket (Admin)
const shipOrderViaShiprocket = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { courierId } = req.body;

        const order = await Order.findById(orderId).populate('userId', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Step 1: Create order in Shiprocket
        const shiprocketOrder = await shiprocketService.createOrder({
            order_id: order.orderNumber,
            name: order.shippingAddress.fullName,
            phone: order.shippingAddress.phone,
            email: order.shippingAddress.email,
            address: order.shippingAddress.address,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            pincode: order.shippingAddress.pincode,
            cod: order.payment.method === 'COD',
            total: order.totalAmount,
            weight: 0.5,
            items: order.items.map(item => ({
                name: item.name,
                sku: item.productId?.toString() || 'SKU001',
                qty: item.quantity,
                price: item.price
            }))
        });
        
        // Step 2: Generate AWB
        const awbData = await shiprocketService.generateAWB(shiprocketOrder.shipmentId, courierId);
        
        // Step 3: Schedule pickup
        const pickupData = await shiprocketService.schedulePickup(shiprocketOrder.shipmentId);
        
        // Step 4: Generate label and manifest
        const labelData = await shiprocketService.generateLabel(shiprocketOrder.shipmentId);
        const manifestData = await shiprocketService.generateManifest(shiprocketOrder.shipmentId);

        // Update order with Shiprocket data
        order.shiprocket = {
            orderId: shiprocketOrder.orderId,
            shipmentId: shiprocketOrder.shipmentId,
            awbCode: awbData.awbCode,
            courierName: awbData.courierName,
            courierId: courierId,
            labelUrl: labelData.labelUrl,
            manifestUrl: manifestData.manifestUrl,
            pickupScheduled: true,
            pickupTokenNumber: pickupData.pickupTokenNumber
        };
        
        order.status = 'PROCESSING';
        order.trackingNumber = awbData.awbCode;
        await order.save();

        res.json({
            success: true,
            message: 'Order shipped successfully via Shiprocket',
            order
        });
    } catch (error) {
        console.error('Ship order error:', error);
        res.status(500).json({ message: error.message || 'Failed to ship order' });
    }
};

// Get tracking info
const getTrackingInfo = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            $or: [{ _id: orderId }, { orderNumber: orderId }],
            userId
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!order.shiprocket?.shipmentId) {
            return res.json({
                success: true,
                tracking: null,
                message: 'Shipment not yet created'
            });
        }

        const trackingData = await shiprocketService.trackShipment(order.shiprocket.shipmentId);

        res.json({
            success: true,
            tracking: trackingData.tracking,
            shiprocket: order.shiprocket,
            shippingHistory: order.shippingHistory
        });
    } catch (error) {
        console.error('Get tracking error:', error);
        res.status(500).json({ message: 'Failed to fetch tracking info' });
    }
};

// Download shipping label (Admin)
const downloadLabel = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order || !order.shiprocket?.labelUrl) {
            return res.status(404).json({ message: 'Label not available' });
        }

        res.json({ success: true, labelUrl: order.shiprocket.labelUrl });
    } catch (error) {
        console.error('Download label error:', error);
        res.status(500).json({ message: 'Failed to get label' });
    }
};

// Download manifest (Admin)
const downloadManifest = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order || !order.shiprocket?.manifestUrl) {
            return res.status(404).json({ message: 'Manifest not available' });
        }

        res.json({ success: true, manifestUrl: order.shiprocket.manifestUrl });
    } catch (error) {
        console.error('Download manifest error:', error);
        res.status(500).json({ message: 'Failed to get manifest' });
    }
};

module.exports = {
    // User routes
    createOrder,
    verifyPayment,
    applyCoupon,
    getUserOrders,
    getOrder,
    cancelOrder,
    getOrderInvoice,
    checkPincodeServiceability,
    getTrackingInfo,

    // Admin routes
    getAllOrders,
    updateOrderStatus,
    toggleCOD,
    getCODStatus,
    shipOrderViaShiprocket,
    downloadLabel,
    downloadManifest
};