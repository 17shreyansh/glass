require('dotenv').config();
const axios = require('axios');

async function testShiprocket() {
  try {
    let email = process.env.SHIPROCKET_EMAIL;
    let password = process.env.SHIPROCKET_PASSWORD;

    console.log('Raw values:');
    console.log('Email:', JSON.stringify(email));
    console.log('Password:', JSON.stringify(password));
    console.log('Email length:', email?.length);
    console.log('Password length:', password?.length);

    // Clean any whitespace/quotes
    email = email?.trim().replace(/['"]/g, '');
    password = password?.trim().replace(/['"]/g, '');

    console.log('\nCleaned values:');
    console.log('Email:', email);
    console.log('Password length:', password.length);

    console.log('\n🔐 Testing Shiprocket auth...');

    const response = await axios({
      method: 'post',
      url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
      headers: { 'Content-Type': 'application/json' },
      data: { email, password }
    });
    
    console.log('\n✅ Authentication successful!');
    console.log('Token:', response.data.token.substring(0, 30) + '...');
    
  } catch (error) {
    console.error('\n❌ Auth failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testShiprocket();
