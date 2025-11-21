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
  getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    return this.request(`/products?${params.toString()}`);
  }

  // Get products by type (ashta-dhatu or fashion-jewelry)
  getProductsByType(type, options = {}) {
    const params = new URLSearchParams();
    Object.keys(options).forEach(key => {
      if (options[key] !== undefined && options[key] !== null) {
        params.append(key, options[key]);
      }
    });
    return this.request(`/products/type/${type}?${params.toString()}`);
  }

  // Get single product by slug
  getProduct(slug) {
    return this.request(`/products/${slug}`);
  }

  // Get related products by slug
  getRelatedProducts(slug, limit = 4) {
    return this.request(`/products/${slug}/related?limit=${limit}`);
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
  getFeaturedProducts(limit = 8) {
    return this.request(`/products?featured=true&limit=${limit}`);
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
  
  getCategories() {
    return this.request('/categories');
  }

  // ============ BRAND METHODS ============
  
  getBrands() {
    return this.request('/brands');
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
  
  getOrders() {
    return this.request('/orders/my-orders');
  }

  getAdminOrders() {
    return this.request('/orders/admin/orders');
  }

  getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
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
  
  getWishlist() {
    return this.request('/wishlist');
  }

  addToWishlist(productId) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  removeFromWishlist(productId) {
    return this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // ============ REVIEW METHODS ============
  
  getProductReviews(productId) {
    return this.request(`/reviews/product/${productId}`);
  }

  createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
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