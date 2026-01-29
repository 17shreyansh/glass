require('dotenv').config();
const shiprocketService = require('./services/shiprocket.service');

async function testDeliveryCharges() {
    console.log('=== Testing Shiprocket Delivery Charges ===\n');

    const testCases = [
        { pickup: '110001', delivery: '400001', weight: 0.5, desc: 'Delhi to Mumbai' },
        { pickup: '110001', delivery: '560001', weight: 1.0, desc: 'Delhi to Bangalore' },
        { pickup: '110001', delivery: '700001', weight: 0.5, desc: 'Delhi to Kolkata' },
    ];

    for (const test of testCases) {
        console.log(`\nTest: ${test.desc}`);
        console.log(`Pickup: ${test.pickup}, Delivery: ${test.delivery}, Weight: ${test.weight}kg`);
        console.log('---');

        try {
            const result = await shiprocketService.checkServiceability(
                test.pickup,
                test.delivery,
                0, // Prepaid
                test.weight
            );

            if (result.success && result.couriers && result.couriers.length > 0) {
                console.log(`✓ Found ${result.couriers.length} couriers\n`);
                
                result.couriers.forEach((courier, index) => {
                    console.log(`Courier ${index + 1}: ${courier.courier_name || 'Unknown'}`);
                    console.log(`  - Rate: ₹${courier.rate || 'N/A'}`);
                    console.log(`  - Freight Charge: ₹${courier.freight_charge || 'N/A'}`);
                    console.log(`  - Total Charge: ₹${courier.total_charge || 'N/A'}`);
                    console.log(`  - COD Charges: ₹${courier.cod_charges || 'N/A'}`);
                    console.log(`  - Estimated Days: ${courier.estimated_delivery_days || 'N/A'}`);
                    console.log('');
                });

                // Calculate minimum charge
                const charges = result.couriers.map(c => 
                    c.rate || c.freight_charge || c.total_charge || 0
                ).filter(c => c > 0);

                if (charges.length > 0) {
                    const minCharge = Math.min(...charges);
                    console.log(`✓ Minimum Delivery Charge: ₹${minCharge}`);
                } else {
                    console.log('⚠ No valid charges found');
                }
            } else {
                console.log('❌ No couriers available or API error');
                if (result.error) {
                    console.log(`Error: ${result.error}`);
                }
            }
        } catch (error) {
            console.error('❌ Test failed:', error.message);
        }

        console.log('\n' + '='.repeat(60));
    }

    console.log('\n=== Test Complete ===');
    console.log('\nIf you see "No valid charges found", check:');
    console.log('1. SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env');
    console.log('2. Shiprocket account is active');
    console.log('3. Pickup location is configured in Shiprocket');
    console.log('4. Network connectivity to Shiprocket API');
}

testDeliveryCharges().catch(console.error);
