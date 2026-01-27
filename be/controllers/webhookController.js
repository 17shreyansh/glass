const Order = require('../models/Order');

// Shiprocket webhook handler
const handleShiprocketWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        
        console.log('[Shiprocket Webhook] Received:', JSON.stringify(webhookData, null, 2));

        // Extract relevant data
        const { awb, current_status, shipment_status, order_id } = webhookData;

        if (!order_id) {
            return res.status(400).json({ message: 'Order ID missing in webhook' });
        }

        // Find order by orderNumber (which we used as order_id in Shiprocket)
        const order = await Order.findOne({ orderNumber: order_id });

        if (!order) {
            console.error(`[Shiprocket Webhook] Order not found: ${order_id}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Map Shiprocket status to our order status
        const statusMapping = {
            'PICKUP SCHEDULED': 'PROCESSING',
            'PICKED UP': 'PROCESSING',
            'IN TRANSIT': 'SHIPPED',
            'OUT FOR DELIVERY': 'SHIPPED',
            'DELIVERED': 'DELIVERED',
            'CANCELLED': 'CANCELLED',
            'RTO': 'CANCELLED',
            'RTO DELIVERED': 'CANCELLED'
        };

        const newStatus = statusMapping[shipment_status] || order.status;

        // Update order status
        if (newStatus !== order.status) {
            order.status = newStatus;
            
            // Update timestamps
            const now = new Date();
            if (newStatus === 'SHIPPED' && !order.shippedAt) {
                order.shippedAt = now;
            } else if (newStatus === 'DELIVERED' && !order.deliveredAt) {
                order.deliveredAt = now;
            }
        }

        // Add to shipping history
        order.shippingHistory.push({
            status: current_status || shipment_status,
            statusCode: shipment_status,
            timestamp: new Date(),
            location: webhookData.current_location || '',
            remarks: webhookData.remarks || ''
        });

        // Update tracking URL if available
        if (webhookData.tracking_url && !order.shiprocket?.trackingUrl) {
            order.shiprocket = order.shiprocket || {};
            order.shiprocket.trackingUrl = webhookData.tracking_url;
        }

        await order.save();

        console.log(`[Shiprocket Webhook] Order ${order_id} updated to ${newStatus}`);

        res.json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('[Shiprocket Webhook] Error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
};

module.exports = { handleShiprocketWebhook };
