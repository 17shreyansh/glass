# Shiprocket Configuration Logging

## What Was Added

Console logs to show if Shiprocket is configured via Admin Panel or .env file.

## Server Startup Logs

When you start the server, you'll now see:

### ✅ Configured via Admin Panel (Best)
```
============================================================
📦 SHIPROCKET CONFIGURATION STATUS
============================================================
✓ Shiprocket configured via Admin Panel
  Email: your-email@example.com
============================================================
```

### ⚠️ Configured via .env File
```
============================================================
📦 SHIPROCKET CONFIGURATION STATUS
============================================================
⚠ Shiprocket configured via .env file
  Email: your-email@example.com
  Note: Configure in Admin Panel for better management
============================================================
```

### ❌ Not Configured
```
============================================================
📦 SHIPROCKET CONFIGURATION STATUS
============================================================
✗ Shiprocket NOT CONFIGURED
  Delivery charges will default to ₹100
  Configure in Admin Panel or .env file
============================================================
```

## Authentication Logs

When Shiprocket API is called, you'll see:

### ✅ Using Admin Panel Config
```
✓ [Shiprocket] Using configuration from Admin Panel
✓ [Shiprocket] Authentication successful
```

### ⚠️ Using .env Config
```
⚠ [Shiprocket] Using configuration from .env file (Admin Panel not configured)
✓ [Shiprocket] Authentication successful
```

### ❌ Not Configured
```
✗ [Shiprocket] NOT CONFIGURED - Please configure in Admin Panel or .env file
✗ [Shiprocket] Authentication failed: Shiprocket credentials not configured
```

## How to Configure in Admin Panel

### Step 1: Login as Admin
Go to admin panel and login

### Step 2: Go to Settings
Navigate to Settings > Shiprocket Configuration

### Step 3: Add Credentials
```
Email: your-shiprocket-email@example.com
Password: your-shiprocket-password
Pickup Pincode: 110001
Pickup Location: Primary
```

### Step 4: Save
Click Save and restart server

## How to Configure in .env

Edit `be/.env`:
```env
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=your-password
SHIPROCKET_PICKUP_PINCODE=110001
SHIPROCKET_PICKUP_LOCATION=Primary
```

## Priority

System checks in this order:
1. **Admin Panel** (Database Settings) - Highest priority
2. **.env file** - Fallback
3. **Not configured** - Error

## Benefits of Admin Panel Config

✅ No need to restart server
✅ Easy to update
✅ No code changes needed
✅ Secure (not in code)
✅ Can be managed by non-technical staff

## Testing

### Check Configuration
```bash
cd be
node check-shiprocket-config.js
```

### Test API
```bash
node test-delivery-charges.js
```

### Start Server
```bash
npm start
```

Look for the configuration status in startup logs.

## Troubleshooting

### Not seeing logs?
- Make sure you restarted the server
- Check console output
- Look for "SHIPROCKET CONFIGURATION STATUS"

### Still showing ₹100?
- Check if authentication is successful
- Look for "Authentication successful" log
- Run test-delivery-charges.js

### Authentication failed?
- Verify credentials are correct
- Check Shiprocket account is active
- Try logging into Shiprocket dashboard

## Summary

✅ **Added**: Startup configuration check
✅ **Added**: Authentication source logging
✅ **Added**: Clear status messages
✅ **Shows**: Admin Panel vs .env vs Not Configured
✅ **Helps**: Quick debugging and configuration verification
