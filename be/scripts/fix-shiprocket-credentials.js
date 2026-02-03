/**
 * Script to verify and fix Shiprocket credentials in database
 * Run with: node scripts/fix-shiprocket-credentials.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Settings = require('../models/Settings');

async function fixShiprocketCredentials() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // Get current credentials from database
        const emailSetting = await Settings.findOne({ key: 'SHIPROCKET_EMAIL' });
        const passwordSetting = await Settings.findOne({ key: 'SHIPROCKET_PASSWORD' });

        console.log('\n--- Current Database Settings ---');
        console.log('Email setting exists:', !!emailSetting);
        console.log('Password setting exists:', !!passwordSetting);

        if (emailSetting) {
            console.log('Email value:', `"${emailSetting.value}"`);
            console.log('Email length:', emailSetting.value?.length);
            console.log('Email has whitespace:', emailSetting.value !== emailSetting.value?.trim());
        }

        if (passwordSetting) {
            console.log('Password exists:', !!passwordSetting.value);
            console.log('Password length:', passwordSetting.value?.length);
            console.log('Password has whitespace:', passwordSetting.value !== passwordSetting.value?.trim());
        }

        // Fix whitespace issues
        let fixed = false;
        
        if (emailSetting && emailSetting.value !== emailSetting.value?.trim()) {
            emailSetting.value = emailSetting.value.trim();
            await emailSetting.save();
            console.log('\n✓ Fixed email whitespace');
            fixed = true;
        }

        if (passwordSetting && passwordSetting.value !== passwordSetting.value?.trim()) {
            passwordSetting.value = passwordSetting.value.trim();
            await passwordSetting.save();
            console.log('✓ Fixed password whitespace');
            fixed = true;
        }

        if (!fixed) {
            console.log('\n✓ No whitespace issues found');
        }

        // Test authentication
        console.log('\n--- Testing Shiprocket Authentication ---');
        const axios = require('axios');
        const baseURL = 'https://apiv2.shiprocket.in/v1/external';
        
        const email = emailSetting?.value || process.env.SHIPROCKET_EMAIL;
        const password = passwordSetting?.value || process.env.SHIPROCKET_PASSWORD;

        if (!email || !password) {
            console.log('❌ Credentials not found in database or .env file');
            console.log('\nTo fix this, either:');
            console.log('1. Add credentials to Admin Panel');
            console.log('2. Add to .env file:');
            console.log('   SHIPROCKET_EMAIL=your-email@example.com');
            console.log('   SHIPROCKET_PASSWORD=your-password');
            process.exit(1);
        }

        try {
            console.log('Attempting authentication with email:', email);
            const { data } = await axios.post(`${baseURL}/auth/login`, { 
                email: email.trim(), 
                password: password.trim() 
            });
            
            if (data.token) {
                console.log('✓ Authentication successful!');
                console.log('Token received:', data.token.substring(0, 20) + '...');
            }
        } catch (error) {
            console.log('❌ Authentication failed');
            console.log('Error:', error.response?.data?.message || error.message);
            
            if (error.response?.status === 403) {
                console.log('\n⚠ Access Forbidden - Possible reasons:');
                console.log('1. Email or password is incorrect');
                console.log('2. Account is locked or inactive');
                console.log('3. IP address is blocked');
                console.log('\nPlease verify your credentials at: https://app.shiprocket.in/');
            }
            
            if (error.response?.data) {
                console.log('Full error:', JSON.stringify(error.response.data, null, 2));
            }
        }

        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');

    } catch (error) {
        console.error('Script error:', error);
        process.exit(1);
    }
}

fixShiprocketCredentials();
