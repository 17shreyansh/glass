const express = require('express');
const router = express.Router();
const legalPageController = require('../controllers/legalPageController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', legalPageController.getAllLegalPages);
router.get('/:slug', legalPageController.getLegalPageBySlug);

// Admin routes
router.get('/admin/all', protect, admin, legalPageController.adminGetAllPages);
router.get('/admin/:id', protect, admin, legalPageController.adminGetPage);
router.put('/admin/:id', protect, admin, legalPageController.updateLegalPage);

module.exports = router;
