const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Get single setting
router.get('/setting/:key', protect, isAdmin, async (req, res) => {
  try {
    const value = await Settings.getValue(req.params.key);
    res.json({ success: true, value });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch setting' });
  }
});

// Save setting
router.post('/setting', protect, isAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    await Settings.setValue(key, value);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save setting' });
  }
});

module.exports = router;
