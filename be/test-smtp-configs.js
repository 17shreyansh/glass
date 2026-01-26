require('dotenv').config();
const nodemailer = require('nodemailer');

async function testMultipleConfigs() {
    console.log('🔍 Testing Multiple SMTP Configurations...\n');
    
    const configs = [
        {
            name: 'Port 465 (SSL)',
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true
        },
        {
            name: 'Port 587 (TLS)',
            host: 'smtp.hostinger.com',
            port: 587,
            secure: false
        }
    ];

    for (const config of configs) {
        console.log(`\n📧 Testing: ${config.name}`);
        console.log(`   Host: ${config.host}`);
        console.log(`   Port: ${config.port}`);
        console.log(`   Secure: ${config.secure}`);
        
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        try {
            await transporter.verify();
            console.log(`   ✅ SUCCESS! This configuration works!\n`);
            
            // Try sending test email
            console.log('   📤 Sending test email...');
            await transporter.sendMail({
                from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
                to: process.env.EMAIL_USERNAME,
                subject: 'Test Email - Configuration Working',
                html: '<h1>✅ Email Working!</h1><p>This configuration is successful.</p>',
            });
            console.log('   ✅ Test email sent successfully!\n');
            
            console.log(`\n🎉 WORKING CONFIGURATION FOUND:`);
            console.log(`   Update your .env with:`);
            console.log(`   EMAIL_PORT=${config.port}`);
            return;
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}\n`);
        }
    }
    
    console.log('\n❌ All configurations failed. Please check:');
    console.log('   1. Email: noreply@mvcreafted.com is correct');
    console.log('   2. Password is correct (case-sensitive)');
    console.log('   3. Email account exists in Hostinger');
    console.log('   4. SMTP is enabled in Hostinger panel');
    console.log('   5. Try logging into webmail: https://webmail.hostinger.com');
}

testMultipleConfigs();
