// API Routes Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
export const API_URL = `${API_BASE_URL}/api`;

export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },

  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
    BY_TYPE: (type) => `/products/type/${type}`,
    RELATED: (id) => `/products/${id}/related`,
    STOCK: (id) => `/products/${id}/stock`,
    SEARCH: '/products/search',
  },

  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
  },

  // Brands
  BRANDS: {
    BASE: '/brands',
    BY_ID: (id) => `/brands/${id}`,
  },

  // Orders
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`,
    STATUS: (id) => `/orders/${id}/status`,
    USER_ORDERS: '/orders/user',
  },

  // Cart
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },

  // Wishlist
  WISHLIST: {
    BASE: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (id) => `/wishlist/${id}`,
  },

  // Reviews
  REVIEWS: {
    BASE: '/reviews',
    BY_PRODUCT: (productId) => `/reviews/product/${productId}`,
    BY_ID: (id) => `/reviews/${id}`,
  },

  // Coupons
  COUPONS: {
    BASE: '/coupons',
    VALIDATE: (code) => `/coupons/validate/${code}`,
    BY_ID: (id) => `/coupons/${id}`,
  },

  // Homepage
  HOMEPAGE: {
    BASE: '/homepage',
    BANNERS: '/homepage/banners',
    FEATURED: '/homepage/featured',
  },

  // Support
  SUPPORT: {
    BASE: '/support',
    BY_ID: (id) => `/support/${id}`,
    TICKETS: '/support/tickets',
  },

  // Delivery
  DELIVERY: {
    BASE: '/delivery',
    CHARGES: '/delivery/charges',
    SETTINGS: '/delivery/settings',
  },

  // Upload
  UPLOAD: {
    SINGLE: '/upload',
    MULTIPLE: '/upload/multiple',
    DELETE: (filename) => `/upload/${filename}`,
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/auth/users',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    ORDERS: '/orders/admin/orders',
    ORDER_STATUS: (id) => `/orders/admin/orders/${id}/status`,
    COD_STATUS: '/orders/cod-status',
    TOGGLE_COD: '/orders/admin/toggle-cod',
    COUPONS: '/coupons/admin',
    COUPON_BY_ID: (id) => `/coupons/admin/${id}`,
    COUPON_TOGGLE: (id) => `/coupons/admin/${id}/toggle-status`,
    COUPON_BULK: '/coupons/admin/bulk-operations',
    COUPON_ANALYTICS: '/coupons/admin/analytics',
    TICKETS: '/tickets/admin',
    TICKET_BY_ID: (id) => `/tickets/${id}`,
    TICKET_MESSAGES: (id) => `/tickets/${id}/messages`,
    TICKET_ASSIGN: (id) => `/tickets/${id}/assign`,
    HOMEPAGE_BANNER: '/home/banner',
    HOMEPAGE_SHIPPING: '/home/shipping-banner',
    HOMEPAGE_GRID: '/home/image-grid',
    HOMEPAGE_PROMO: '/home/promo-banner',
    HOMEPAGE_FOOTER: '/home/footer-offer',
    MENUS: '/menus/admin',
    MENU_BY_ID: (id) => `/menus/${id}`,
  },

  // Menu
  MENU: {
    BASE: '/menu',
    BY_ID: (id) => `/menu/${id}`,
  },
};

// Product Types
export const PRODUCT_TYPES = {
  ASHTA_DHATU: 'ashta-dhatu',
  FASHION_JEWELRY: 'fashion-jewelry',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'createdAt',
  PRICE_LOW_HIGH: 'priceAsc',
  PRICE_HIGH_LOW: 'priceDesc',
  NAME_A_Z: 'nameAsc',
  RATING: 'rating',
  FEATURED: 'featured',
};

// Filter Options
export const FILTER_OPTIONS = {
  PRICE_RANGES: [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹3,000', min: 1000, max: 3000 },
    { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: 'Above ₹10,000', min: 10000, max: null },
  ],
  SIZES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  COLORS: ['Gold', 'Silver', 'Rose Gold', 'Platinum', 'Mixed'],
  MATERIALS: ['Ashta Dhatu', 'Gold Plated', 'Silver', 'Brass', 'Copper'],
  GENDERS: ['Men', 'Women', 'Unisex', 'Kids'],
};

export default API_ROUTES;