const axios = require('axios');
const Settings = require('../models/Settings');

class ShiprocketService {
    constructor() {
        this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
        this.token = null;
        this.tokenExpiry = null;
    }

    async authenticate() {
        if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.token;
        }

        const email = await Settings.getValue('SHIPROCKET_EMAIL', process.env.SHIPROCKET_EMAIL);
        const password = await Settings.getValue('SHIPROCKET_PASSWORD', process.env.SHIPROCKET_PASSWORD);

        // Check if using admin panel config or env variables
        const emailFromDB = await Settings.findOne({ key: 'SHIPROCKET_EMAIL' });
        const passwordFromDB = await Settings.findOne({ key: 'SHIPROCKET_PASSWORD' });
        
        if (emailFromDB && passwordFromDB) {
            console.log('✓ [Shiprocket] Using configuration from Admin Panel');
        } else if (process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD) {
            console.log('⚠ [Shiprocket] Using configuration from .env file (Admin Panel not configured)');
        } else {
            console.log('❌ [Shiprocket] NOT CONFIGURED - Please configure in Admin Panel or .env file');
            throw new Error('Shiprocket credentials not configured');
        }

        try {
            const { data } = await axios.post(`${this.baseURL}/auth/login`, { email, password });
            this.token = data.token;
            this.tokenExpiry = Date.now() + (9 * 24 * 60 * 60 * 1000);
            console.log('✓ [Shiprocket] Authentication successful');
            return this.token;
        } catch (error) {
            console.error('❌ [Shiprocket] Authentication failed:', error.response?.data?.message || error.message);
            throw new Error('Shiprocket authentication failed. Check credentials.');
        }
    }

    async getHeaders() {
        const token = await this.authenticate();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async checkServiceability(pickupPincode, deliveryPincode, cod = 0, weight = 0.5) {
        try {
            const headers = await this.getHeaders();
            const { data } = await axios.get(`${this.baseURL}/courier/serviceability`, {
                headers,
                params: {
                    pickup_postcode: pickupPincode,
                    delivery_postcode: deliveryPincode,
                    cod: cod ? 1 : 0,
                    weight
                }
            });

            console.log('[Shiprocket] Serviceability response:', JSON.stringify(data, null, 2));

            return {
                success: true,
                available: data.data?.available_courier_companies?.length > 0,
                couriers: data.data?.available_courier_companies || []
            };
        } catch (error) {
            console.error('[Shiprocket] Serviceability error:', error.message);
            return { success: false, available: false, error: error.message };
        }
    }

    async createOrder(orderData) {
        const headers = await this.getHeaders();
        const pickupLocation = await Settings.getValue('SHIPROCKET_PICKUP_LOCATION', process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary');
        
        // Determine if COD based on payment method
        const isCOD = orderData.payment.method === 'COD';
        
        const payload = {
            order_id: orderData.orderNumber,
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: pickupLocation,
            billing_customer_name: orderData.shippingAddress.fullName,
            billing_last_name: '',
            billing_address: orderData.shippingAddress.address,
            billing_city: orderData.shippingAddress.city,
            billing_pincode: orderData.shippingAddress.pincode,
            billing_state: orderData.shippingAddress.state,
            billing_country: orderData.shippingAddress.country || 'India',
            billing_email: orderData.shippingAddress.email,
            billing_phone: orderData.shippingAddress.phone,
            shipping_is_billing: true,
            order_items: orderData.items.map(item => ({
                name: item.name,
                sku: item.productId?.toString() || 'SKU',
                units: item.quantity,
                selling_price: item.price,
                discount: 0,
                tax: 0
            })),
            payment_method: isCOD ? 'COD' : 'Prepaid',
            sub_total: orderData.subtotal,
            length: 10,
            breadth: 10,
            height: 10,
            weight: orderData.items.reduce((sum, item) => sum + (item.quantity * 0.5), 0)
        };

        const { data } = await axios.post(`${this.baseURL}/orders/create/adhoc`, payload, { headers });

        return {
            success: true,
            orderId: data.order_id,
            shipmentId: data.shipment_id
        };
    }

    async generateAWB(shipmentId, courierId) {
        const headers = await this.getHeaders();
        const { data } = await axios.post(
            `${this.baseURL}/courier/assign/awb`,
            { shipment_id: shipmentId, courier_id: courierId },
            { headers }
        );

        return {
            success: true,
            awbCode: data.response?.data?.awb_code,
            courierName: data.response?.data?.courier_name
        };
    }

    async schedulePickup(shipmentId) {
        const headers = await this.getHeaders();
        const { data } = await axios.post(
            `${this.baseURL}/courier/generate/pickup`,
            { shipment_id: [shipmentId] },
            { headers }
        );

        return {
            success: true,
            pickupStatus: data.pickup_status,
            pickupTokenNumber: data.response?.pickup_token_number
        };
    }

    async generateLabel(shipmentIds) {
        const headers = await this.getHeaders();
        const { data } = await axios.post(
            `${this.baseURL}/courier/generate/label`,
            { shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds] },
            { headers }
        );

        return { success: true, labelUrl: data.label_url };
    }

    async generateManifest(shipmentIds) {
        const headers = await this.getHeaders();
        const { data } = await axios.post(
            `${this.baseURL}/manifests/generate`,
            { shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds] },
            { headers }
        );

        return { success: true, manifestUrl: data.manifest_url };
    }

    async trackShipment(shipmentId) {
        try {
            const headers = await this.getHeaders();
            const { data } = await axios.get(`${this.baseURL}/courier/track/shipment/${shipmentId}`, { headers });
            return { success: true, tracking: data.tracking_data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async cancelShipment(awbCodes) {
        const headers = await this.getHeaders();
        const { data } = await axios.post(
            `${this.baseURL}/orders/cancel/shipment/awbs`,
            { awbs: Array.isArray(awbCodes) ? awbCodes : [awbCodes] },
            { headers }
        );

        return { success: true, message: data.message };
    }
}

module.exports = new ShiprocketService();
