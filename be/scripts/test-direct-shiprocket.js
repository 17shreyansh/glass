const axios = require('axios');

async function testDirect() {
  const email = 'mvcraftedimpex@gmail.com';
  const password = 'Mktk8212#@';

  console.log('Testing with:');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');

  try {
    const res = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    console.log('✅ Success!');
    console.log('Token:', res.data.token?.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
  }
}

testDirect();
