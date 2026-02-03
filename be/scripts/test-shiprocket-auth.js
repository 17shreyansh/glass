const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const shiprocketService = require('../services/shiprocket.service');

async function testShiprocket() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    console.log('Testing Shiprocket authentication from database...\n');
    
    const token = await shiprocketService.authenticate();
    
    console.log('✅ Authentication successful!');
    console.log('Token:', token.substring(0, 20) + '...');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    if (error.response?.data) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testShiprocket();
