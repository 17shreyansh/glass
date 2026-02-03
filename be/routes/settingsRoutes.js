const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Test Shiprocket connection (Admin)
router.post('/test-shiprocket', protect, isAdmin, async (req, res) => {
  try {
    const shiprocketService = require('../services/shiprocket.service');
    
    // Try to authenticate
    await shiprocketService.authenticate();
    
    res.json({ 
      success: true, 
      message: 'Shiprocket authentication successful! Credentials are working correctly.' 
    });
  } catch (error) {
    console.error('Test Shiprocket error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all settings (for admin panel)
router.get('/settings', protect, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.find({ isActive: true }).select('-__v');
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

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
    let { key, value } = req.body;
    
    // Trim string values to prevent whitespace issues
    if (typeof value === 'string') {
      value = value.trim();
    }
    
    await Settings.setValue(key, value);
    res.json({ success: true, message: 'Setting saved successfully' });
  } catch (error) {
    console.error('Save setting error:', error);
    res.status(500).json({ message: 'Failed to save setting' });
  }
});

module.exports = router;
