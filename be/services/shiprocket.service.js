const axios = require("axios");

class ShiprocketService {
  constructor() {
    this.baseURL = "https://apiv2.shiprocket.in/v1/external";
    this.token = null;
    this.tokenExpiry = 0;
  }

  // ================= AUTH =================
  async authenticate(force = false) {
    // reuse valid token
    if (!force && this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    // Use env only
    const email = process.env.SHIPROCKET_EMAIL?.trim();
    const password = process.env.SHIPROCKET_PASSWORD?.trim();

    if (!email || !password) {
      throw new Error("Shiprocket credentials missing in env");
    }

    try {
      console.log("🔐 Shiprocket auth...");
      console.log("Email:", email);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ email, password })
      };

      const res = await axios(config);

      if (!res.data?.token) {
        throw new Error("No token received");
      }

      this.token = res.data.token;
      this.tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;

      console.log("✅ Shiprocket auth success");
      return this.token;

    } catch (err) {
      this.token = null;
      this.tokenExpiry = 0;

      console.error("❌ Shiprocket auth error:");
      console.error(err.response?.data || err.message);

      throw new Error(
        err.response?.data?.message || "Shiprocket auth failed"
      );
    }
  }

  async headers() {
    const token = await this.authenticate();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // ================= REQUEST WRAPPER =================
  async request(config) {
    try {
      const headers = await this.headers();
      const response = await axios({
        ...config,
        headers: { ...headers, ...(config.headers || {}) },
      });
      
      // Log successful response for debugging
      console.log('Shiprocket API Success:', {
        url: config.url,
        data: response.data
      });
      
      return response;
    } catch (err) {
      // Log detailed error for debugging
      if (err.response) {
        console.error('Shiprocket API Error:', {
          status: err.response.status,
          data: err.response.data,
          url: config.url,
          requestData: config.data
        });
      }

      // retry once on auth failure
      if (err.response?.status === 401) {
        console.log("🔁 Token expired, retrying...");
        await this.authenticate(true);

        const headers = await this.headers();
        return await axios({
          ...config,
          headers: { ...headers, ...(config.headers || {}) },
        });
      }
      throw err;
    }
  }

  // ================= SERVICEABILITY =================
  async checkServiceability(pickup, delivery, weight = 0.5, cod = false) {
    const res = await this.request({
      method: "GET",
      url: `${this.baseURL}/courier/serviceability`,
      params: {
        pickup_postcode: pickup,
        delivery_postcode: delivery,
        weight,
        cod: cod ? 1 : 0,
      },
    });

    return res.data;
  }

  // ================= CREATE ORDER =================
  async createOrder(order) {
    if (!/^\d{10}$/.test(order.phone))
      throw new Error("Invalid phone");

    if (!/^\d{6}$/.test(order.pincode))
      throw new Error("Invalid pincode");

    const normalizeState = (state) => {
      return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
    };

    // Split name into first and last
    const nameParts = order.name.trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'Name';

    const payload = {
      order_id: order.order_id,
      order_date: new Date().toISOString().slice(0, 10),
      pickup_location: order.pickup_location || "Primary",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.pincode,
      billing_state: normalizeState(order.state),
      billing_country: "India",
      billing_email: order.email,
      billing_phone: order.phone,
      shipping_is_billing: true,
      order_items: order.items.map(i => ({
        name: i.name,
        sku: i.sku || "SKU001",
        units: i.qty,
        selling_price: i.price,
      })),
      payment_method: order.cod ? "COD" : "Prepaid",
      sub_total: order.total,
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.weight || 0.5,
    };

    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/orders/create/adhoc`,
      data: payload,
    });

    return res.data;
  }

  // Get pickup locations
  async getPickupLocations() {
    const res = await this.request({
      method: "GET",
      url: `${this.baseURL}/settings/company/pickup`,
    });
    return res.data;
  }

  // ================= OTHER CALLS =================
  async generateAWB(shipment_id, courier_id) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/courier/assign/awb`,
      data: { shipment_id, courier_id },
    });
    return {
      awbCode: res.data.response?.data?.awb_code,
      courierName: res.data.response?.data?.courier_name
    };
  }

  async schedulePickup(shipment_id) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/courier/generate/pickup`,
      data: { shipment_id: [shipment_id] },
    });
    return {
      pickupScheduled: true,
      pickupTokenNumber: res.data.pickup_token_number
    };
  }

  async generateLabel(shipment_id) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/courier/generate/label`,
      data: { shipment_id: [shipment_id] },
    });
    return {
      labelUrl: res.data.label_url
    };
  }

  async generateManifest(shipment_id) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/courier/generate/manifest`,
      data: { shipment_id: [shipment_id] },
    });
    return {
      manifestUrl: res.data.manifest_url
    };
  }

  async trackShipment(shipment_id) {
    const res = await this.request({
      method: "GET",
      url: `${this.baseURL}/courier/track/shipment/${shipment_id}`,
    });
    return res.data;
  }

  async cancel(awb) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/orders/cancel/shipment/awbs`,
      data: { awbs: [awb] },
    });
    return res.data;
  }
}

module.exports = new ShiprocketService();
