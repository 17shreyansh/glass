const express = require('express');
const router = express.Router();
const { handleShiprocketWebhook } = require('../controllers/webhookController');

// Shiprocket webhook endpoint (no auth required - Shiprocket calls this)
router.post('/shiprocket', handleShiprocketWebhook);

module.exports = router;
