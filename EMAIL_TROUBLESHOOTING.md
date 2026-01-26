# ❌ Email Authentication Failed - Troubleshooting Guide

## 🔴 Current Issue
**Error:** `Invalid login: 535 5.7.8 Error: authentication failed`

**Email:** noreply@mvcreafted.com  
**Password:** Affobe@1234  
**SMTP Host:** smtp.hostinger.com  
**Port Tested:** 465 (SSL) ❌ | 587 (TLS) ❌

---

## ✅ Troubleshooting Checklist

### Step 1: Verify Email Account Exists
- [ ] Login to Hostinger control panel: https://hpanel.hostinger.com
- [ ] Go to **Emails** section
- [ ] Confirm `noreply@mvcreafted.com` exists
- [ ] Check if email is active (not suspended)

### Step 2: Verify Password
- [ ] Password is case-sensitive: `Affobe@1234`
- [ ] Try logging into webmail: https://webmail.hostinger.com
  - Email: noreply@mvcreafted.com
  - Password: Affobe@1234
- [ ] If webmail login fails, reset password in Hostinger panel

### Step 3: Check SMTP Settings in Hostinger
- [ ] Login to Hostinger panel
- [ ] Go to **Emails** → Select your email
- [ ] Check **Email Configuration** section
- [ ] Verify SMTP is enabled
- [ ] Check if there are any restrictions

### Step 4: Common Issues

#### Issue A: Wrong Password
**Solution:** Reset password in Hostinger:
1. Go to Hostinger panel → Emails
2. Click on `noreply@mvcreafted.com`
3. Click "Change Password"
4. Set new password
5. Update `.env` file

#### Issue B: Email Not Created Yet
**Solution:** Create email in Hostinger:
1. Go to Hostinger panel → Emails
2. Click "Create Email Account"
3. Email: noreply@mvcreafted.com
4. Set password: Affobe@1234
5. Save and wait 5-10 minutes

#### Issue C: SMTP Disabled
**Solution:** Enable SMTP:
1. Contact Hostinger support
2. Ask to enable SMTP for noreply@mvcreafted.com
3. Some plans require SMTP activation

#### Issue D: Two-Factor Authentication
**Solution:** Disable 2FA or use app password:
1. Check if 2FA is enabled
2. Disable it or generate app-specific password
3. Use app password in `.env`

#### Issue E: Domain Not Verified
**Solution:** Verify domain:
1. Check if mvcreafted.com is verified in Hostinger
2. Check DNS records are pointing to Hostinger
3. Wait for DNS propagation (up to 24 hours)

---

## 🔧 Quick Fixes to Try

### Fix 1: Reset Password
```
1. Login to Hostinger
2. Emails → noreply@mvcreafted.com → Change Password
3. Set new password
4. Update d:\Office\glass\be\.env
5. Run: node test-email.js
```

### Fix 2: Try Alternative SMTP (Gmail for testing)
If you have a Gmail account, test with Gmail first:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
FROM_NAME=MV Crafted
FROM_EMAIL=your-gmail@gmail.com
```

**Note:** Gmail requires "App Password" (not regular password)
- Enable 2FA in Gmail
- Generate App Password: https://myaccount.google.com/apppasswords

---

## 🧪 Test Commands

```bash
# Test current config
cd d:\Office\glass\be
node test-email.js

# Test multiple configs
node test-smtp-configs.js

# Test webmail login
# Open: https://webmail.hostinger.com
# Email: noreply@mvcreafted.com
# Password: Affobe@1234
```

---

## 📞 Contact Hostinger Support

If nothing works, contact Hostinger:

**What to ask:**
```
Hi, I'm trying to use SMTP for noreply@mvcreafted.com but getting 
authentication error. Can you please:

1. Verify SMTP is enabled for this email
2. Confirm the correct SMTP settings
3. Check if there are any restrictions on this account
4. Verify the email account is active

SMTP Settings I'm using:
- Host: smtp.hostinger.com
- Port: 465 (SSL)
- Email: noreply@mvcreafted.com
```

**Hostinger Support:**
- Live Chat: https://www.hostinger.com/contact
- Email: support@hostinger.com
- Phone: Check your Hostinger panel

---

## ✅ Once Fixed

After fixing the issue:

```bash
# 1. Test email
node test-email.js

# 2. Should see:
# ✅ SMTP connection verified successfully!
# ✅ Test email sent successfully!

# 3. Start your server
npm run dev

# 4. Test registration
# POST http://localhost:3001/api/auth/register
```

---

## 📋 Current Configuration

**File:** `d:\Office\glass\be\.env`

```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USERNAME=noreply@mvcreafted.com
EMAIL_PASSWORD=Affobe@1234
FROM_NAME=MV Crafted
FROM_EMAIL=noreply@mvcreafted.com
```

**Status:** ❌ Authentication failing  
**Next Step:** Verify email exists and password is correct in Hostinger panel

---

## 🎯 Most Likely Causes (in order)

1. **Wrong password** (90% of cases)
   - Try webmail login first
   - Reset if needed

2. **Email doesn't exist** (5% of cases)
   - Create in Hostinger panel

3. **SMTP not enabled** (3% of cases)
   - Contact Hostinger support

4. **Domain issues** (2% of cases)
   - Verify DNS settings

---

**Priority Action:** Login to https://webmail.hostinger.com with these credentials to verify they work!
