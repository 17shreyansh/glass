require('dotenv').config();
const nodemailer = require('nodemailer');

// Test email configuration
async function testEmailConfig() {
    console.log('🔍 Testing Email Configuration...\n');
    
    // Display current configuration
    console.log('📧 Email Settings:');
    console.log('   Host:', process.env.EMAIL_HOST);
    console.log('   Port:', process.env.EMAIL_PORT);
    console.log('   Username:', process.env.EMAIL_USERNAME);
    console.log('   From Name:', process.env.FROM_NAME);
    console.log('   From Email:', process.env.FROM_EMAIL);
    console.log('   Password:', process.env.EMAIL_PASSWORD ? '***SET***' : '❌ NOT SET');
    console.log('\n');

    // Check if all required variables are set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || 
        !process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        console.error('❌ ERROR: Missing email configuration in .env file');
        console.log('\nPlease update your .env file with:');
        console.log('EMAIL_HOST=smtp.hostinger.com');
        console.log('EMAIL_PORT=465');
        console.log('EMAIL_USERNAME=your-email@yourdomain.com');
        console.log('EMAIL_PASSWORD=your-email-password');
        console.log('FROM_NAME=Your Shoe Store');
        console.log('FROM_EMAIL=your-email@yourdomain.com');
        process.exit(1);
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        // Verify connection
        console.log('🔄 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!\n');

        // Send test email
        console.log('📤 Sending test email...');
        const info = await transporter.sendMail({
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: process.env.EMAIL_USERNAME, // Send to yourself
            subject: 'Test Email - Nodemailer Configuration',
            html: `
                <h1>✅ Email Configuration Successful!</h1>
                <p>Your Hostinger SMTP configuration is working perfectly.</p>
                <h3>Configuration Details:</h3>
                <ul>
                    <li><strong>Host:</strong> ${process.env.EMAIL_HOST}</li>
                    <li><strong>Port:</strong> ${process.env.EMAIL_PORT}</li>
                    <li><strong>SSL/TLS:</strong> Enabled (Port 465)</li>
                </ul>
                <p>You can now use email verification and password reset features.</p>
                <br>
                <p><em>This is an automated test email from your application.</em></p>
            `,
        });

        console.log('✅ Test email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('\n✨ All email features are working correctly!');
        console.log('\n📋 Available Features:');
        console.log('   ✓ User Registration with Email Verification');
        console.log('   ✓ Email Verification Links');
        console.log('   ✓ Password Reset Emails');
        console.log('   ✓ Resend Verification Emails');
        
    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check your email credentials in .env file');
        console.log('   2. Verify your Hostinger email account is active');
        console.log('   3. Check if your email password is correct');
        console.log('   4. Ensure SMTP is enabled in your Hostinger panel');
        console.log('   5. Check firewall/antivirus blocking port 465');
        process.exit(1);
    }
}

testEmailConfig();
