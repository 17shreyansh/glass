const express = require('express');
const {
  getLowStockProducts,
  getOutOfStockProducts,
  checkStockAvailability,
  bulkUpdateStock,
  getStockSummary,
  adjustStock
} = require('../controllers/stockController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes
router.get('/summary', protect, isAdmin, getStockSummary);
router.get('/low', protect, isAdmin, getLowStockProducts);
router.get('/out-of-stock', protect, isAdmin, getOutOfStockProducts);
router.post('/bulk-update', protect, isAdmin, bulkUpdateStock);
router.post('/adjust', protect, isAdmin, adjustStock);

// Public routes
router.post('/check', checkStockAvailability);

module.exports = router;
