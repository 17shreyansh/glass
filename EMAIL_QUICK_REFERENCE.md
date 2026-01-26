# 📧 Email Configuration Quick Reference

## ⚠️ ACTION REQUIRED

Your email configuration has been added to `.env` but you need to update these values:

### 📝 Update in: `d:\Office\glass\be\.env`

```env
EMAIL_USERNAME=your-email@yourdomain.com    ← Replace with your Hostinger email
EMAIL_PASSWORD=your-email-password          ← Replace with your email password
FROM_EMAIL=your-email@yourdomain.com        ← Same as EMAIL_USERNAME
FROM_NAME=Your Shoe Store                   ← Your business name
```

---

## 🎯 Hostinger SMTP Settings (Already Configured)

| Setting | Value | Status |
|---------|-------|--------|
| **Protocol** | SMTP | ✅ Set |
| **Hostname** | smtp.hostinger.com | ✅ Set |
| **Port** | 465 | ✅ Set |
| **SSL/TLS** | Enabled | ✅ Set |
| **Username** | ⚠️ NEEDS UPDATE | ❌ |
| **Password** | ⚠️ NEEDS UPDATE | ❌ |

---

## 🧪 Test Your Setup (3 Steps)

### Step 1: Update Credentials
Edit `be\.env` and replace placeholder values

### Step 2: Run Test Script
```bash
cd d:\Office\glass\be
node test-email.js
```

### Step 3: Verify Output
You should see:
```
✅ SMTP connection verified successfully!
✅ Test email sent successfully!
```

---

## 📍 Where Email is Used in Your Code

### File: `be/controllers/authController.js`

| Function | Line | Purpose |
|----------|------|---------|
| `createEmailTransporter()` | 35-45 | Creates SMTP connection |
| `register()` | 47-110 | Sends verification email on signup |
| `forgotPassword()` | 245-295 | Sends password reset email |
| `resendVerification()` | 355-420 | Resends verification email |

---

## 🔄 Email Verification Flow

```
1. User registers → POST /api/auth/register
2. System creates user with accountStatus: 'pending'
3. System sends verification email
4. User clicks link → GET /api/auth/verify-email/:token
5. System updates: accountStatus: 'active', isEmailVerified: true
6. User can now login and use all features
```

---

## 🚀 API Endpoints Using Email

| Endpoint | Method | Email Sent |
|----------|--------|------------|
| `/api/auth/register` | POST | ✉️ Verification email |
| `/api/auth/verify-email/:token` | GET | - |
| `/api/auth/resend-verification` | POST | ✉️ Verification email |
| `/api/auth/forgot-password` | POST | ✉️ Password reset email |
| `/api/auth/reset-password/:token` | PUT | - |

---

## ⚡ Quick Commands

```bash
# Test email
node test-email.js

# Start server
npm run dev

# Test registration (after server starts)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check EMAIL_USERNAME and EMAIL_PASSWORD |
| "Connection timeout" | Check if port 465 is open |
| "Email not received" | Check spam folder, verify email is active |
| "Invalid credentials" | Login to Hostinger and verify email works |

---

## ✅ Checklist

- [ ] Update EMAIL_USERNAME in .env
- [ ] Update EMAIL_PASSWORD in .env
- [ ] Update FROM_EMAIL in .env
- [ ] Update FROM_NAME in .env
- [ ] Run `node test-email.js`
- [ ] Check email inbox for test email
- [ ] Test user registration
- [ ] Verify email verification works
- [ ] Test forgot password flow

---

## 📚 Documentation Files

- `EMAIL_SETUP_GUIDE.md` - Complete setup guide
- `test-email.js` - Email testing script
- `.env` - Configuration file (UPDATE THIS!)

---

**Status:** ⚠️ Configuration added, credentials need to be updated
**Next Step:** Update .env with your Hostinger email credentials
