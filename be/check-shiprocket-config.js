require('dotenv').config();

console.log('=== Shiprocket Configuration Check ===\n');

const config = {
    'SHIPROCKET_EMAIL': process.env.SHIPROCKET_EMAIL,
    'SHIPROCKET_PASSWORD': process.env.SHIPROCKET_PASSWORD ? '***configured***' : undefined,
    'SHIPROCKET_PICKUP_PINCODE': process.env.SHIPROCKET_PICKUP_PINCODE,
    'SHIPROCKET_PICKUP_LOCATION': process.env.SHIPROCKET_PICKUP_LOCATION,
};

let allConfigured = true;

for (const [key, value] of Object.entries(config)) {
    const status = value ? '✓' : '❌';
    console.log(`${status} ${key}: ${value || 'NOT SET'}`);
    if (!value) allConfigured = false;
}

console.log('\n' + '='.repeat(50));

if (!allConfigured) {
    console.log('\n⚠️  SHIPROCKET NOT CONFIGURED PROPERLY\n');
    console.log('Please update your .env file with:');
    console.log('');
    console.log('SHIPROCKET_EMAIL=your-shiprocket-email@example.com');
    console.log('SHIPROCKET_PASSWORD=your-shiprocket-password');
    console.log('SHIPROCKET_PICKUP_PINCODE=110001');
    console.log('SHIPROCKET_PICKUP_LOCATION=Primary');
    console.log('');
    console.log('Without proper configuration, delivery charges will default to ₹100');
} else {
    console.log('\n✓ All Shiprocket configuration is set');
    console.log('\nNext step: Run test-delivery-charges.js to verify API connection');
    console.log('Command: node test-delivery-charges.js');
}

console.log('\n' + '='.repeat(50));
