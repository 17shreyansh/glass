const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Settings = require('../models/Settings');

async function setupShiprocketSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get credentials from env
    const email = process.env.SHIPROCKET_EMAIL?.trim();
    const password = process.env.SHIPROCKET_PASSWORD?.trim();

    if (!email || !password) {
      console.error('❌ SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD must be set in .env file');
      process.exit(1);
    }

    // Save to Settings
    await Settings.setValue('SHIPROCKET_EMAIL', email, 'Shiprocket account email');
    await Settings.setValue('SHIPROCKET_PASSWORD', password, 'Shiprocket account password');

    console.log('✅ Shiprocket credentials saved to Settings');
    
    // Verify
    const savedEmail = await Settings.getValue('SHIPROCKET_EMAIL');
    const savedPassword = await Settings.getValue('SHIPROCKET_PASSWORD');
    
    console.log('Saved email:', savedEmail);
    console.log('Password saved:', savedPassword ? '✓' : '✗');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupShiprocketSettings();
