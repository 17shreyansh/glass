const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies in requests
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle token expiration
        if (response.status === 401 && errorData.tokenExpired) {
          // Clear local storage and redirect to login
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login';
          }
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ============ PRODUCT METHODS ============
  
  // Get all products with filters
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const response = await this.request(`/products?${params.toString()}`);
    return response.data || response;
  }

  // Get single product by slug
  async getProduct(slug) {
    const response = await this.request(`/products/${slug}`);
    return response.data || response;
  }

  // Get related products by slug
  async getRelatedProducts(slug, limit = 4) {
    const response = await this.request(`/products/${slug}/related?limit=${limit}`);
    return response.data || response;
  }

  // Search products
  searchProducts(query, filters = {}) {
    const params = new URLSearchParams({ search: query });
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    return this.request(`/products?${params.toString()}`);
  }

  // Get featured products
  async getFeaturedProducts(limit = 8, skip = 0) {
    const response = await this.request(`/products?featured=true&limit=${limit}&skip=${skip}`);
    return response.data || response;
  }

  // Get new arrival products
  async getNewArrivals(limit = 8, skip = 0) {
    const response = await this.request(`/products?sortBy=createdAt&limit=${limit}&skip=${skip}`);
    return response.data || response;
  }

  // ============ ADMIN PRODUCT METHODS ============
  
  createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  updateProductStock(id, size, color, stock) {
    return this.request(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ size, color, stock }),
    });
  }

  // ============ CATEGORY METHODS ============
  
  async getCategories() {
    const response = await this.request('/categories');
    return response.data || response;
  }

  // ============ BRAND METHODS ============
  
  async getBrands() {
    const response = await this.request('/brands');
    return response.data || response;
  }

  // ============ SEARCH METHODS ============
  
  getSearchSuggestions(query) {
    return this.request(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }



  // ============ ORDER METHODS ============
  
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await this.request(`/orders/my-orders?${queryParams.toString()}`);
    return response;
  }

  getAdminOrders() {
    return this.request('/orders/admin/orders');
  }

  async getOrder(id) {
    const response = await this.request(`/orders/my-orders/${id}`);
    return response;
  }

  async createOrder(orderData) {
    const response = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response;
  }

  async verifyPayment(paymentData) {
    const response = await this.request('/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response;
  }

  async applyCoupon(couponData) {
    const response = await this.request('/orders/apply-coupon', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
    return response;
  }

  async cancelOrder(orderId) {
    const response = await this.request(`/orders/my-orders/${orderId}/cancel`, {
      method: 'PATCH',
    });
    return response;
  }

  async checkPincodeServiceability(pincode) {
    const response = await this.request(`/orders/check-pincode?pincode=${pincode}`);
    return response;
  }

  async getOrderTracking(orderId) {
    const response = await this.request(`/orders/my-orders/${orderId}/tracking`);
    return response;
  }

  updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // ============ USER/AUTH METHODS ============
  
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store user data (token is in httpOnly cookie)
    if (response.success && response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Try to clear cookies even if logout fails
      try {
        await this.request('/auth/clear-cookies', {
          method: 'POST',
        });
      } catch (clearError) {
        console.error('Clear cookies failed:', clearError);
      }
    } finally {
      localStorage.removeItem('user');
    }
  }

  getCurrentUser() {
    return this.request('/auth/profile');
  }

  updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // ============ WISHLIST METHODS ============
  
  async getWishlist() {
    const response = await this.request('/wishlist');
    return response;
  }

  async addToWishlist(productId) {
    const response = await this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    return response;
  }

  async removeFromWishlist(productId) {
    const response = await this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
    return response;
  }

  // ============ REVIEW METHODS ============
  
  getProductReviews(productId, params = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/reviews/product/${productId}?${queryParams.toString()}`);
  }

  canUserReview(productId) {
    return this.request(`/reviews/product/${productId}/can-review`);
  }

  createReview(productId, reviewData) {
    return this.request(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  updateReview(reviewId, reviewData) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  deleteReview(reviewId) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  markReviewHelpful(reviewId) {
    return this.request(`/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
  }

  // ============ COUPON METHODS ============
  
  getCoupons() {
    return this.request('/coupons/public');
  }

  getAdminCoupons() {
    return this.request('/coupons/admin');
  }

  validateCoupon(code) {
    return this.request(`/coupons/validate/${code}`);
  }

  // ============ HOMEPAGE METHODS ============
  
  getHomepageData() {
    return this.request('/homepage');
  }

  updateHomepageData(data) {
    return this.request('/homepage', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============ SUPPORT METHODS ============
  
  createSupportTicket(ticketData) {
    return this.request('/support', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  getSupportTickets() {
    return this.request('/support');
  }

  // ============ DELIVERY METHODS ============
  
  getDeliveryCharges() {
    return this.request('/delivery');
  }

  updateDeliveryCharges(data) {
    return this.request('/delivery', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============ RETURN METHODS ============
  
  getReturns() {
    return this.request('/returns');
  }

  createReturn(returnData) {
    return this.request('/returns', {
      method: 'POST',
      body: JSON.stringify(returnData),
    });
  }

  updateReturnStatus(id, status, adminNotes) {
    return this.request(`/returns/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
  }

  // ============ UPLOAD METHODS ============
  
  async uploadImage(file, folder = 'products') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    const url = `${API_BASE_URL}/upload`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data ? result : { url: result.data?.url };
  }

  async uploadMultipleImages(files, folder = 'products') {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    
    const url = `${API_BASE_URL}/upload/multiple`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

export default new ApiService();