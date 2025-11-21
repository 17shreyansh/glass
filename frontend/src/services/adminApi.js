import axios from 'axios';
import { API_URL } from '../constants/apiRoutes';

// Configure axios defaults
axios.defaults.withCredentials = true;

class AdminApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // ============ DELIVERY CHARGES ============
  async getDeliveryCharges(params = {}) {
    const response = await axios.get(`${this.baseURL}/delivery`, { params });
    return response.data;
  }

  async createDeliveryCharge(data) {
    const response = await axios.post(`${this.baseURL}/delivery`, data);
    return response.data;
  }

  async updateDeliveryCharge(id, data) {
    const response = await axios.put(`${this.baseURL}/delivery/${id}`, data);
    return response.data;
  }

  async deleteDeliveryCharge(id) {
    const response = await axios.delete(`${this.baseURL}/delivery/${id}`);
    return response.data;
  }

  async bulkUploadDeliveryCharges(data) {
    const response = await axios.post(`${this.baseURL}/delivery/bulk`, data);
    return response.data;
  }

  // ============ ORDERS ============
  async getOrders(params = {}) {
    const response = await axios.get(`${this.baseURL}/orders/admin/orders`, { params });
    return response.data;
  }

  async updateOrderStatus(id, data) {
    const response = await axios.patch(`${this.baseURL}/orders/admin/orders/${id}/status`, data);
    return response.data;
  }

  async getCODStatus() {
    const response = await axios.get(`${this.baseURL}/orders/cod-status`);
    return response.data;
  }

  async toggleCOD(enabled) {
    const response = await axios.post(`${this.baseURL}/orders/admin/toggle-cod`, { enabled });
    return response.data;
  }

  // ============ USERS ============
  async getUsers() {
    const response = await axios.get(`${this.baseURL}/auth/users`);
    return response.data;
  }

  // ============ COUPONS ============
  async getCoupons(params = {}) {
    const response = await axios.get(`${this.baseURL}/coupons/admin`, { params });
    return response.data;
  }

  async createCoupon(data) {
    const response = await axios.post(`${this.baseURL}/coupons/admin`, data);
    return response.data;
  }

  async getCoupon(id) {
    const response = await axios.get(`${this.baseURL}/coupons/admin/${id}`);
    return response.data;
  }

  async updateCoupon(id, data) {
    const response = await axios.put(`${this.baseURL}/coupons/admin/${id}`, data);
    return response.data;
  }

  async deleteCoupon(id) {
    const response = await axios.delete(`${this.baseURL}/coupons/admin/${id}`);
    return response.data;
  }

  async toggleCouponStatus(id) {
    const response = await axios.patch(`${this.baseURL}/coupons/admin/${id}/toggle-status`);
    return response.data;
  }

  async bulkCouponOperations(data) {
    const response = await axios.post(`${this.baseURL}/coupons/admin/bulk-operations`, data);
    return response.data;
  }

  async getCouponAnalytics(period = '30d') {
    const response = await axios.get(`${this.baseURL}/coupons/admin/analytics?period=${period}`);
    return response.data;
  }

  // ============ SUPPORT TICKETS ============
  async getTickets(params = {}) {
    const response = await axios.get(`${this.baseURL}/tickets/admin`, { params });
    return response.data;
  }

  async getTicket(id) {
    const response = await axios.get(`${this.baseURL}/tickets/${id}`);
    return response.data;
  }

  async updateTicket(id, data) {
    const response = await axios.put(`${this.baseURL}/tickets/${id}`, data);
    return response.data;
  }

  async deleteTicket(id) {
    const response = await axios.delete(`${this.baseURL}/tickets/${id}`);
    return response.data;
  }

  async addTicketMessage(id, message) {
    const response = await axios.post(`${this.baseURL}/tickets/${id}/messages`, { message });
    return response.data;
  }

  async assignTicket(id, data) {
    const response = await axios.put(`${this.baseURL}/tickets/${id}/assign`, data);
    return response.data;
  }



  // ============ MENUS ============
  async getMenus() {
    const response = await axios.get(`${this.baseURL}/menus/admin`);
    return response.data;
  }

  async createMenu(data) {
    const response = await axios.post(`${this.baseURL}/menus`, data);
    return response.data;
  }

  async updateMenu(id, data) {
    const response = await axios.put(`${this.baseURL}/menus/${id}`, data);
    return response.data;
  }

  async deleteMenu(id) {
    const response = await axios.delete(`${this.baseURL}/menus/${id}`);
    return response.data;
  }
}

export default new AdminApiService();