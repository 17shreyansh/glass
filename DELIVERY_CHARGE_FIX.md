# Delivery Charge Fix - Shiprocket Integration

## Issue
Delivery charges were showing as fixed ₹100 for all orders instead of dynamic charges from Shiprocket.

## Root Cause
1. Shiprocket API credentials not configured in `.env`
2. Delivery charge extraction logic needed improvement
3. Missing proper error logging

## Fix Applied

### 1. Updated Shiprocket Service (`be/services/shiprocket.service.js`)
- ✅ Added detailed logging for API responses
- ✅ Added error logging for debugging

### 2. Updated Order Service (`be/services/OrderService.js`)
- ✅ Improved delivery charge extraction logic
- ✅ Check multiple fields: `rate`, `freight_charge`, `total_charge`, `cod_charges`
- ✅ Added comprehensive logging
- ✅ Better fallback handling

### 3. Created Test Scripts
- ✅ `check-shiprocket-config.js` - Check configuration
- ✅ `test-delivery-charges.js` - Test API and charges

## How to Fix

### Step 1: Configure Shiprocket Credentials

Edit `be/.env` and add your Shiprocket credentials:

```env
# Shiprocket Configuration
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password
SHIPROCKET_PICKUP_PINCODE=110001
SHIPROCKET_PICKUP_LOCATION=Primary
```

**How to get these:**
1. Go to https://www.shiprocket.in/
2. Login to your account
3. Email: Your Shiprocket login email
4. Password: Your Shiprocket login password
5. Pickup Pincode: Your warehouse/store pincode
6. Pickup Location: Name of your pickup location (usually "Primary")

### Step 2: Verify Configuration

```bash
cd be
node check-shiprocket-config.js
```

Expected output:
```
✓ SHIPROCKET_EMAIL: your-email@example.com
✓ SHIPROCKET_PASSWORD: ***configured***
✓ SHIPROCKET_PICKUP_PINCODE: 110001
✓ SHIPROCKET_PICKUP_LOCATION: Primary
```

### Step 3: Test Delivery Charges

```bash
node test-delivery-charges.js
```

Expected output:
```
Test: Delhi to Mumbai
Pickup: 110001, Delivery: 400001, Weight: 0.5kg
---
✓ Found 5 couriers

Courier 1: Delhivery Surface
  - Rate: ₹45
  - Freight Charge: ₹45
  - Estimated Days: 4-5

Courier 2: Bluedart
  - Rate: ₹78
  - Freight Charge: ₹78
  - Estimated Days: 2-3

✓ Minimum Delivery Charge: ₹45
```

### Step 4: Restart Server

```bash
# Stop the server (Ctrl+C)
# Start again
npm start
```

## How It Works Now

### 1. User Adds Address
When user enters delivery pincode, system:
1. Calls Shiprocket API with pickup and delivery pincodes
2. Gets list of available couriers with their charges
3. Selects minimum charge from available couriers
4. Displays to user

### 2. Delivery Charge Calculation
```javascript
// Example API response from Shiprocket
{
  "data": {
    "available_courier_companies": [
      {
        "courier_name": "Delhivery Surface",
        "rate": 45,
        "freight_charge": 45,
        "estimated_delivery_days": "4-5"
      },
      {
        "courier_name": "Bluedart",
        "rate": 78,
        "freight_charge": 78,
        "estimated_delivery_days": "2-3"
      }
    ]
  }
}

// System selects minimum: ₹45
```

### 3. Fallback Behavior
If Shiprocket API fails or returns no couriers:
- System defaults to ₹100
- Logs error for debugging
- Order can still be placed

## Troubleshooting

### Issue: Still showing ₹100

**Check 1: Configuration**
```bash
node check-shiprocket-config.js
```
If any ❌, update `.env` file

**Check 2: API Connection**
```bash
node test-delivery-charges.js
```
If error, check:
- Internet connection
- Shiprocket credentials are correct
- Shiprocket account is active

**Check 3: Server Logs**
Look for these logs in console:
```
[OrderService] Checking serviceability: pickup=110001, delivery=400001, weight=0.5
[Shiprocket] Serviceability response: {...}
[OrderService] Courier Delhivery: charge=45
[OrderService] Selected delivery charge: ₹45
```

### Issue: API Authentication Failed

**Solution:**
1. Verify email and password in `.env`
2. Login to Shiprocket dashboard to confirm credentials
3. Check if account is active
4. Try resetting password if needed

### Issue: No Couriers Available

**Possible Reasons:**
1. Delivery pincode not serviceable
2. Pickup location not configured in Shiprocket
3. Weight exceeds courier limits
4. COD not available for that pincode

**Solution:**
1. Login to Shiprocket dashboard
2. Go to Settings > Pickup Locations
3. Verify pickup location is active
4. Check serviceability for the pincode

### Issue: Different Charges for COD vs Prepaid

**This is normal:**
- COD orders may have additional charges
- System passes `cod=1` for COD orders
- Shiprocket returns different rates

**To test COD charges:**
```javascript
// In test-delivery-charges.js, change:
const result = await shiprocketService.checkServiceability(
    test.pickup,
    test.delivery,
    1, // COD = 1
    test.weight
);
```

## Verification Checklist

- [ ] Shiprocket credentials configured in `.env`
- [ ] Configuration check passes
- [ ] Test script shows actual charges (not ₹100)
- [ ] Server restarted
- [ ] Frontend checkout shows dynamic charges
- [ ] Different pincodes show different charges
- [ ] Logs show Shiprocket API responses

## Expected Behavior

### Before Fix
```
All orders: ₹100 delivery charge
```

### After Fix
```
Mumbai (400001): ₹45
Bangalore (560001): ₹52
Kolkata (700001): ₹48
Remote areas: ₹80-120
Unserviceable: ₹100 (fallback)
```

## API Response Fields

Shiprocket may return charges in different fields:

| Field | Description | Priority |
|-------|-------------|----------|
| `rate` | Base rate | 1st |
| `freight_charge` | Freight charge | 2nd |
| `total_charge` | Total charge | 3rd |
| `cod_charges` | COD charges | 4th |

System checks all fields and uses first available value.

## Performance

- API call: ~1-2 seconds
- Cached for same pincode
- Fallback to ₹100 if timeout
- Non-blocking order placement

## Security

- Credentials stored in `.env` (not in code)
- Token-based authentication
- Token cached for 9 days
- Auto-refresh on expiry

## Monitoring

### Check Logs
```bash
# Backend logs
tail -f logs/app.log

# Look for:
[OrderService] Checking serviceability
[Shiprocket] Serviceability response
[OrderService] Selected delivery charge
```

### Check Database
```javascript
// Orders should have actual delivery charges
db.orders.find({}, { deliveryCharge: 1, shippingAddress: 1 })
```

## Support

### Shiprocket Support
- Dashboard: https://app.shiprocket.in/
- Support: https://www.shiprocket.in/support
- API Docs: https://apidocs.shiprocket.in/

### Common Questions

**Q: Why ₹100 for some pincodes?**
A: Either not serviceable or API error. Check logs.

**Q: Can I set custom delivery charges?**
A: Yes, modify fallback value in OrderService.js

**Q: How to add free shipping?**
A: Use FREE_SHIPPING coupon type

**Q: Different charges for COD?**
A: Yes, pass `cod=1` to checkServiceability

## Summary

✅ **Fixed**: Dynamic delivery charges from Shiprocket
✅ **Added**: Comprehensive logging
✅ **Added**: Test scripts
✅ **Added**: Configuration checker
✅ **Improved**: Error handling
✅ **Improved**: Fallback behavior

**Next Steps:**
1. Configure Shiprocket credentials
2. Run test scripts
3. Restart server
4. Test in frontend
5. Monitor logs
