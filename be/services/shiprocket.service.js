const axios = require("axios");
const Settings = require("../models/Settings");

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

    let email = await Settings.getValue("SHIPROCKET_EMAIL");
    let password = await Settings.getValue("SHIPROCKET_PASSWORD");

    email = email?.toString().trim().replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    password = password?.toString().trim().replace(/&quot;/g, '"').replace(/&#39;/g, "'");

    // fallback env
    if (!email || !password) {
      email = process.env.SHIPROCKET_EMAIL?.trim();
      password = process.env.SHIPROCKET_PASSWORD?.trim();
    }

    if (!email || !password) {
      throw new Error("Shiprocket credentials missing");
    }

    try {
      console.log("🔐 Shiprocket auth...");
      console.log("Email:", JSON.stringify(email));
      console.log("Password length:", password.length);

      const res = await axios.post(
        `${this.baseURL}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

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
      return await axios({
        ...config,
        headers: { ...headers, ...(config.headers || {}) },
      });
    } catch (err) {
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

    const payload = {
      order_id: order.order_id,
      order_date: new Date().toISOString().slice(0, 10),

      pickup_location: "Primary",

      billing_customer_name: order.name,
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.pincode,
      billing_state: order.state,
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

  // ================= OTHER CALLS =================
  async assignAWB(shipment_id, courier_id) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/courier/assign/awb`,
      data: { shipment_id, courier_id },
    });
    return res.data;
  }

  async generatePickup(shipment_id) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/courier/generate/pickup`,
      data: { shipment_id: [shipment_id] },
    });
    return res.data;
  }

  async generateLabel(shipment_id) {
    const res = await this.request({
      method: "POST",
      url: `${this.baseURL}/courier/generate/label`,
      data: { shipment_id: [shipment_id] },
    });
    return res.data;
  }

  async track(shipment_id) {
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
