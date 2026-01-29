const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testCOD() {
    console.log('=== Testing COD Functionality ===\n');

    try {
        // 1. Check COD Status
        console.log('1. Checking COD Status...');
        const codStatus = await axios.get(`${API_BASE}/orders/cod-status`);
        console.log('COD Status:', codStatus.data);
        console.log('✓ COD Status Check Passed\n');

        // 2. Check Pincode Serviceability
        console.log('2. Checking Pincode Serviceability...');
        const serviceability = await axios.get(`${API_BASE}/orders/check-pincode?pincode=110001`);
        console.log('Serviceability:', {
            success: serviceability.data.success,
            available: serviceability.data.available,
            couriersCount: serviceability.data.couriers?.length || 0
        });
        console.log('✓ Pincode Check Passed\n');

        console.log('=== All COD Tests Passed ===');
        console.log('\nNext Steps:');
        console.log('1. Login to your application');
        console.log('2. Add items to cart');
        console.log('3. Go to checkout');
        console.log('4. Select COD payment method');
        console.log('5. Place order');
        
    } catch (error) {
        console.error('❌ Test Failed:', error.response?.data || error.message);
    }
}

testCOD();
