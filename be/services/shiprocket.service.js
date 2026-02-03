const axios = require("axios");
const Settings = require("../models/Settings");

class ShiprocketService {
  constructor() {
    this.baseURL = "https://apiv2.shiprocket.in/v1/external";
    this.token = null;
    this.tokenExpiry = null;
  }

  // ================= AUTH =================
  async authenticate() {
    if (this.token && this.tokenExpiry > Date.now()) {
      return this.token;
    }

    let email = (await Settings.getValue("SHIPROCKET_EMAIL"))?.trim();
    let password = (await Settings.getValue("SHIPROCKET_PASSWORD"))?.trim();

    // Fallback to env if not in DB
    if (!email || !password) {
      email = process.env.SHIPROCKET_EMAIL?.trim();
      password = process.env.SHIPROCKET_PASSWORD?.trim();
    }

    if (!email || !password) {
      throw new Error("Shiprocket credentials missing");
    }

    try {
      const res = await axios.post(
        `${this.baseURL}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      if (!res.data?.token) {
        throw new Error("Shiprocket token not received");
      }

      this.token = res.data.token;
      this.tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;

      return this.token;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(`Shiprocket auth failed: ${error.response.data.message || 'Unknown error'}`);
      }
      throw error;
    }
  }

  async headers() {
    const token = await this.authenticate();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // ================= SERVICEABILITY =================
  async checkServiceability(pickup, delivery, weight = 0.5, cod = false) {
    const headers = await this.headers();

    const res = await axios.get(
      `${this.baseURL}/courier/serviceability`,
      {
        headers,
        params: {
          pickup_postcode: pickup,
          delivery_postcode: delivery,
          weight,
          cod: cod ? 1 : 0,
        },
      }
    );

    return res.data;
  }

  // ================= CREATE ORDER =================
  async createOrder(order) {
    const headers = await this.headers();

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

    const res = await axios.post(
      `${this.baseURL}/orders/create/adhoc`,
      payload,
      { headers }
    );

    return res.data;
  }

  // ================= ASSIGN AWB =================
  async assignAWB(shipment_id, courier_id) {
    const headers = await this.headers();

    const res = await axios.post(
      `${this.baseURL}/courier/assign/awb`,
      { shipment_id, courier_id },
      { headers }
    );

    return res.data;
  }

  // ================= PICKUP =================
  async generatePickup(shipment_id) {
    const headers = await this.headers();

    const res = await axios.post(
      `${this.baseURL}/courier/generate/pickup`,
      { shipment_id: [shipment_id] },
      { headers }
    );

    return res.data;
  }

  // ================= LABEL =================
  async generateLabel(shipment_id) {
    const headers = await this.headers();

    const res = await axios.post(
      `${this.baseURL}/courier/generate/label`,
      { shipment_id: [shipment_id] },
      { headers }
    );

    return res.data;
  }

  // ================= TRACK =================
  async track(shipment_id) {
    const headers = await this.headers();

    const res = await axios.get(
      `${this.baseURL}/courier/track/shipment/${shipment_id}`,
      { headers }
    );

    return res.data;
  }

  // ================= CANCEL =================
  async cancel(awb) {
    const headers = await this.headers();

    const res = await axios.post(
      `${this.baseURL}/orders/cancel/shipment/awbs`,
      { awbs: [awb] },
      { headers }
    );

    return res.data;
  }
}

module.exports = new ShiprocketService();
