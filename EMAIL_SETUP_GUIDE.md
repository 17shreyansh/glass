# Email Configuration & Verification Setup Guide

## 📧 Current Status

### ✅ What's Already Implemented:
- ✓ Nodemailer package installed (v7.0.3)
- ✓ Email verification logic in `authController.js`
- ✓ User model with email verification methods
- ✓ Password reset functionality
- ✓ Resend verification email feature
- ✓ Email verification tokens with expiration

### ❌ What Was Missing:
- ✗ Email configuration in `.env` file
- ✗ SMTP credentials not set

---

## 🔧 Configuration Setup

### Step 1: Update Your `.env` File

**Location:** `d:\Office\glass\be\.env`

Add these lines to your `.env` file (already added for you):

```env
# Email Configuration (Hostinger SMTP)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USERNAME=your-email@yourdomain.com
EMAIL_PASSWORD=your-email-password
FROM_NAME=Your Shoe Store
FROM_EMAIL=your-email@yourdomain.com
```

### Step 2: Replace Placeholder Values

**IMPORTANT:** Replace these values with your actual Hostinger email credentials:

1. **EMAIL_USERNAME** - Your full Hostinger email address (e.g., `noreply@yourdomain.com`)
2. **EMAIL_PASSWORD** - Your Hostinger email password
3. **FROM_EMAIL** - Same as EMAIL_USERNAME
4. **FROM_NAME** - Your business/store name (e.g., "Glass Store")

---

## 📍 Hostinger SMTP Settings Reference

### Outgoing Server (SMTP) - For Sending Emails:
```
Protocol: SMTP
Hostname: smtp.hostinger.com
Port: 465
SSL/TLS: Enabled (SSL)
Authentication: Required
```

### Incoming Servers (For Reference Only):
```
IMAP: imap.hostinger.com (Port 993)
POP3: pop.hostinger.com (Port 995)
```

**Note:** Your application only needs SMTP (outgoing) to send verification emails.

---

## 🧪 Testing Your Configuration

### Test 1: Run the Email Test Script

```bash
cd d:\Office\glass\be
node test-email.js
```

**Expected Output:**
```
🔍 Testing Email Configuration...
📧 Email Settings:
   Host: smtp.hostinger.com
   Port: 465
   ...
✅ SMTP connection verified successfully!
📤 Sending test email...
✅ Test email sent successfully!
```

### Test 2: Test User Registration

1. Start your server:
```bash
npm run dev
```

2. Register a new user via API:
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

3. Check the email inbox for verification link

---

## 📋 Email Features Available

### 1. **User Registration with Email Verification**
- **Endpoint:** `POST /api/auth/register`
- **Flow:** User registers → Receives verification email → Clicks link → Account activated
- **Token Expiry:** 24 hours

### 2. **Email Verification**
- **Endpoint:** `GET /api/auth/verify-email/:token`
- **Purpose:** Activates user account after email verification
- **Changes:** `accountStatus: 'pending'` → `'active'`, `isEmailVerified: false` → `true`

### 3. **Resend Verification Email**
- **Endpoint:** `POST /api/auth/resend-verification`
- **Body:** `{ "email": "user@example.com" }`
- **Use Case:** User didn't receive email or link expired

### 4. **Forgot Password**
- **Endpoint:** `POST /api/auth/forgot-password`
- **Body:** `{ "email": "user@example.com" }`
- **Token Expiry:** 15 minutes

### 5. **Reset Password**
- **Endpoint:** `PUT /api/auth/reset-password/:token`
- **Body:** `{ "password": "newPassword123" }`

---

## 🔍 Where Email Configuration is Used

### File: `be/controllers/authController.js`

#### Email Transporter Function (Lines 35-45):
```javascript
const createEmailTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,        // smtp.hostinger.com
        port: process.env.EMAIL_PORT,        // 465
        auth: {
            user: process.env.EMAIL_USERNAME, // your-email@domain.com
            pass: process.env.EMAIL_PASSWORD, // your-password
        },
        secure: process.env.EMAIL_PORT == 465, // true for port 465
    });
};
```

#### Used In These Functions:
1. **register()** - Line 47-110
   - Sends welcome email with verification link
   
2. **forgotPassword()** - Line 245-295
   - Sends password reset email
   
3. **resendVerification()** - Line 355-420
   - Resends verification email

---

## 🛠️ Troubleshooting

### Issue 1: "Email sending failed"
**Causes:**
- Wrong email credentials
- SMTP not enabled in Hostinger
- Firewall blocking port 465

**Solutions:**
1. Verify credentials in Hostinger panel
2. Check if email account is active
3. Try disabling firewall temporarily
4. Check server logs for detailed error

### Issue 2: "Connection timeout"
**Causes:**
- Port 465 blocked
- Network/firewall issues

**Solutions:**
1. Check if port 465 is open
2. Try from different network
3. Contact hosting provider

### Issue 3: "Authentication failed"
**Causes:**
- Wrong password
- Email account locked
- 2FA enabled

**Solutions:**
1. Reset email password in Hostinger
2. Disable 2FA for SMTP
3. Use app-specific password if available

### Issue 4: Emails going to spam
**Solutions:**
1. Add SPF record to DNS
2. Add DKIM record to DNS
3. Verify domain in Hostinger
4. Use professional email content

---

## 🔐 Security Best Practices

1. **Never commit `.env` file to Git**
   - Already in `.gitignore`
   
2. **Use strong email passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

3. **Enable SSL/TLS**
   - Already configured (port 465)

4. **Rotate credentials regularly**
   - Change email password every 3-6 months

5. **Monitor email logs**
   - Check for suspicious activity

---

## 📊 Email Verification Flow Diagram

```
User Registration
       ↓
Create User (accountStatus: 'pending')
       ↓
Generate Verification Token (24h expiry)
       ↓
Send Email with Verification Link
       ↓
User Clicks Link
       ↓
Verify Token (not expired?)
       ↓
Update User:
  - isEmailVerified: true
  - accountStatus: 'active'
       ↓
User Can Login & Use Full Features
```

---

## 🧪 Testing Checklist

- [ ] Update `.env` with real Hostinger credentials
- [ ] Run `node test-email.js` successfully
- [ ] Start server with `npm run dev`
- [ ] Register new user via API
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Verify account status changed to 'active'
- [ ] Test forgot password flow
- [ ] Test resend verification email
- [ ] Check emails not going to spam

---

## 📞 Support

If you encounter issues:

1. Check server console logs
2. Run the test script: `node test-email.js`
3. Verify Hostinger email settings
4. Check DNS records (SPF, DKIM)
5. Contact Hostinger support if needed

---

## 🎯 Quick Start Commands

```bash
# Test email configuration
node test-email.js

# Start development server
npm run dev

# Check database connection
node check-database.js
```

---

**Last Updated:** $(date)
**Status:** ✅ Ready to configure and test
