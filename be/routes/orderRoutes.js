const express = require('express');
const router = express.Router();
const {
  // User controllers
  createOrder,
  verifyPayment,
  applyCoupon,
  getUserOrders,
  getOrder,
  cancelOrder,
  getOrderInvoice,
  checkPincodeServiceability,
  getTrackingInfo,
  
  // Admin controllers
  getAllOrders,
  updateOrderStatus,
  toggleCOD,
  getCODStatus,
  shipOrderViaShiprocket,
  downloadLabel,
  downloadManifest
} = require('../controllers/orderController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// PUBLIC ROUTES
router.get('/cod-status', getCODStatus);
router.get('/check-pincode', checkPincodeServiceability);

// USER ROUTES (Protected)
router.use(protect); // All routes below require authentication

// Order management
router.post('/', createOrder); // Create order
router.post('/verify-payment', verifyPayment); // Verify Razorpay payment

// Cart & Coupon
router.post('/apply-coupon', applyCoupon);

// User order queries
router.get('/my-orders', getUserOrders);
router.get('/my-orders/:orderId', getOrder);
router.get('/my-orders/:orderId/tracking', getTrackingInfo);
router.patch('/my-orders/:orderId/cancel', cancelOrder);
router.get('/invoice/:orderId', getOrderInvoice);

// ADMIN ROUTES (Protected + Admin)
router.use(isAdmin); // All routes below require admin privileges

// Order management
router.get('/admin/orders', getAllOrders);
router.patch('/admin/orders/:orderId/status', updateOrderStatus);

// Shiprocket integration
router.post('/admin/orders/:orderId/ship', shipOrderViaShiprocket);
router.get('/admin/orders/:orderId/label', downloadLabel);
router.get('/admin/orders/:orderId/manifest', downloadManifest);

// Settings
router.post('/admin/toggle-cod', toggleCOD);

module.exports = router;