# Shiprocket Authentication Issue - Troubleshooting Guide

## Problem
Getting "Access forbidden" error when trying to ship orders via Shiprocket, even with correct credentials in Admin Panel.

## Common Causes & Solutions

### 1. **Whitespace in Credentials** (Most Common)
Credentials saved with extra spaces before/after the email or password.

**Solution:**
- Run the diagnostic script: `node scripts/fix-shiprocket-credentials.js`
- Or manually re-enter credentials in Admin Panel (they will now be auto-trimmed)

### 2. **Incorrect Credentials**
Email or password is wrong.

**Solution:**
- Verify credentials at https://app.shiprocket.in/
- Try logging in manually to confirm they work
- Re-enter in Admin Panel

### 3. **Account Issues**
Shiprocket account might be:
- Locked due to multiple failed login attempts
- Inactive or suspended
- Requires password reset

**Solution:**
- Contact Shiprocket support
- Reset password at https://app.shiprocket.in/

### 4. **API Access Issues**
Some Shiprocket accounts might have API access restrictions.

**Solution:**
- Check if API access is enabled in your Shiprocket account settings
- Contact Shiprocket support to enable API access

## Testing Steps

### Step 1: Run Diagnostic Script
```bash
cd be
node scripts/fix-shiprocket-credentials.js
```

This will:
- Show current credentials (masked)
- Detect whitespace issues
- Auto-fix whitespace
- Test authentication with Shiprocket API

### Step 2: Test via API Endpoint
Use the new test endpoint (requires admin authentication):

```bash
POST /api/settings/test-shiprocket
Headers: Authorization: Bearer <admin-token>
```

### Step 3: Check Database Directly
```javascript
// In MongoDB shell or Compass
db.settings.find({ key: { $in: ['SHIPROCKET_EMAIL', 'SHIPROCKET_PASSWORD'] } })
```

### Step 4: Manual Test with cURL
```bash
curl -X POST https://apiv2.shiprocket.in/v1/external/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

If this works, the issue is with how credentials are stored/retrieved in your app.

## Code Changes Made

### 1. Enhanced Authentication (shiprocket.service.js)
- Added credential trimming
- Better error messages
- Detailed logging for debugging
- Specific handling for 403 errors

### 2. Settings Route (settingsRoutes.js)
- Auto-trim string values when saving
- Added test endpoint for Shiprocket
- Added endpoint to get all settings

### 3. Diagnostic Script
- Created `scripts/fix-shiprocket-credentials.js`
- Detects and fixes whitespace issues
- Tests authentication

## Quick Fix

If you want to quickly fix the issue:

1. **Delete existing settings:**
```javascript
// In MongoDB
db.settings.deleteMany({ key: { $in: ['SHIPROCKET_EMAIL', 'SHIPROCKET_PASSWORD'] } })
```

2. **Re-enter credentials in Admin Panel** (they will be auto-trimmed now)

3. **Or use .env file temporarily:**
```env
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=your-password
```

## Verification

After fixing, you should see:
```
✓ [Shiprocket] Using configuration from Admin Panel
[Shiprocket] Attempting authentication with email: your-email@example.com
✓ [Shiprocket] Authentication successful
```

Instead of:
```
✓ [Shiprocket] Using configuration from Admin Panel
❌ [Shiprocket] Authentication failed: Access forbidden
```

## Still Not Working?

1. Check Shiprocket API status: https://status.shiprocket.in/
2. Verify your Shiprocket plan includes API access
3. Contact Shiprocket support with your account email
4. Check if your IP is whitelisted (if Shiprocket has IP restrictions)
