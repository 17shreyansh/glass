require('dotenv').config();
const shiprocket = require('./services/shiprocket.service');

async function testAuth() {
  try {
    console.log('Testing Shiprocket authentication...\n');
    
    const token = await shiprocket.authenticate(true);
    
    console.log('\n✅ Authentication successful!');
    console.log('Token:', token.substring(0, 20) + '...');
    
  } catch (error) {
    console.error('\n❌ Authentication failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAuth();
