const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Get settings by category
router.get('/:category', protect, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.getByCategory(req.params.category);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Bulk update settings
router.post('/bulk', protect, isAdmin, async (req, res) => {
  try {
    const { settings } = req.body;
    
    const promises = settings.map(s => 
      Settings.setValue(s.key, s.value, s.description || '')
    );
    
    await Promise.all(promises);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;
