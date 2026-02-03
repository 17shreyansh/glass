const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Settings = require('../models/Settings');

async function testDirect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        
        const emailFromDB = await Settings.findOne({ key: 'SHIPROCKET_EMAIL' });
        const passwordFromDB = await Settings.findOne({ key: 'SHIPROCKET_PASSWORD' });
        
        const email = emailFromDB?.value || process.env.SHIPROCKET_EMAIL;
        const password = passwordFromDB?.value || process.env.SHIPROCKET_PASSWORD;
        
        console.log('Testing with:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Password length:', password?.length);
        
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: email.trim(),
            password: password.trim()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('\n✓ SUCCESS!');
        console.log('Token:', response.data.token?.substring(0, 20) + '...');
        
        await mongoose.connection.close();
    } catch (error) {
        console.log('\n❌ FAILED');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data);
        
        if (error.response?.status === 403) {
            console.log('\nPossible reasons:');
            console.log('1. Account is locked - Contact Shiprocket support');
            console.log('2. API access not enabled - Check Shiprocket dashboard');
            console.log('3. Account suspended - Check Shiprocket account status');
        }
        
        await mongoose.connection.close();
        process.exit(1);
    }
}

testDirect();
