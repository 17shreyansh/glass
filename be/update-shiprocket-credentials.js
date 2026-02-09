require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateCredentials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glass');
    console.log('✅ DB connected\n');

    console.log('📝 Update Shiprocket Credentials\n');
    
    const email = await question('Enter Shiprocket Email: ');
    const password = await question('Enter Shiprocket Password: ');

    if (!email || !password) {
      console.log('❌ Email and password are required');
      process.exit(1);
    }

    // Save to database
    await Settings.setValue('SHIPROCKET_EMAIL', email, 'Shiprocket account email');
    await Settings.setValue('SHIPROCKET_PASSWORD', password, 'Shiprocket account password');

    console.log('\n✅ Credentials saved successfully!');
    console.log('\nStored values:');
    console.log('Email:', email);
    console.log('Password length:', password.length);

    // Verify by reading back
    const savedEmail = await Settings.getValue('SHIPROCKET_EMAIL');
    const savedPassword = await Settings.getValue('SHIPROCKET_PASSWORD');
    
    console.log('\nVerification:');
    console.log('Saved email:', savedEmail);
    console.log('Saved password length:', savedPassword?.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    await mongoose.connection.close();
    process.exit();
  }
}

updateCredentials();
