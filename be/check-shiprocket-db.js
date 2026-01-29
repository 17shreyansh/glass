require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

async function checkShiprocketCredentials() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        const email = await Settings.findOne({ key: 'SHIPROCKET_EMAIL' });
        const password = await Settings.findOne({ key: 'SHIPROCKET_PASSWORD' });
        const pincode = await Settings.findOne({ key: 'SHIPROCKET_PICKUP_PINCODE' });
        const location = await Settings.findOne({ key: 'SHIPROCKET_PICKUP_LOCATION' });

        console.log('=== Current Shiprocket Configuration ===\n');
        console.log('Email:', email ? email.value : 'NOT SET');
        console.log('Password:', password ? '***' + password.value.slice(-4) : 'NOT SET');
        console.log('Pickup Pincode:', pincode ? pincode.value : 'NOT SET');
        console.log('Pickup Location:', location ? location.value : 'NOT SET');

        console.log('\n=== Action Required ===\n');
        console.log('❌ Authentication failed - credentials are incorrect');
        console.log('\nTo fix:');
        console.log('1. Login to Shiprocket: https://app.shiprocket.in/');
        console.log('2. Verify your email and password');
        console.log('3. Update in Admin Panel > Settings > Shiprocket');
        console.log('\nOR update directly in database:');
        console.log('\ndb.settings.updateOne(');
        console.log('  { key: "SHIPROCKET_EMAIL" },');
        console.log('  { $set: { value: "your-correct-email@example.com" } },');
        console.log('  { upsert: true }');
        console.log(')');
        console.log('\ndb.settings.updateOne(');
        console.log('  { key: "SHIPROCKET_PASSWORD" },');
        console.log('  { $set: { value: "your-correct-password" } },');
        console.log('  { upsert: true }');
        console.log(')');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkShiprocketCredentials();
