const axios = require('axios');

const email = process.env.SHIPROCKET_EMAIL || 'your@email.com';
const password = process.env.SHIPROCKET_PASSWORD || 'yourpassword';

(async () => {
  try {
    console.log('Testing Shiprocket authentication...');
    const res = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('✓ Authentication successful');
    console.log('Token:', res.data.token.substring(0, 20) + '...');
  } catch (error) {
    console.error('✗ Authentication failed:', error.response?.data || error.message);
  }
})();
