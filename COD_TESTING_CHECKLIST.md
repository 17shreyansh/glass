# COD Testing Checklist

## Pre-requisites
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 5173
- [ ] MongoDB connected
- [ ] Shiprocket credentials configured in `.env`

## Backend Testing

### 1. Test COD Status API
```bash
curl http://localhost:3001/api/orders/cod-status
```
Expected Response:
```json
{
  "success": true,
  "codEnabled": true
}
```

### 2. Test Pincode Serviceability
```bash
curl http://localhost:3001/api/orders/check-pincode?pincode=110001
```
Expected Response:
```json
{
  "success": true,
  "available": true,
  "couriers": [...]
}
```

### 3. Run Test Script
```bash
cd be
node test-cod.js
```

## Frontend Testing

### 1. Checkout Page - COD Option
- [ ] Navigate to `/checkout`
- [ ] Add items to cart
- [ ] Proceed to address step
- [ ] Verify "Cash on Delivery" option is visible
- [ ] Verify "Online Payment" option is visible

### 2. Place COD Order
- [ ] Select COD payment method
- [ ] Click "Place Order" button
- [ ] Verify order is created immediately
- [ ] Verify success message appears
- [ ] Verify redirect to orders page
- [ ] Verify cart is cleared

### 3. Place Online Order
- [ ] Select "Online Payment" method
- [ ] Click "Place Order & Pay" button
- [ ] Verify Razorpay modal opens
- [ ] Complete payment
- [ ] Verify order is created after payment
- [ ] Verify redirect to orders page

### 4. Order Details
- [ ] Go to "My Orders"
- [ ] Click on COD order
- [ ] Verify payment method shows "COD"
- [ ] Verify payment status shows "PENDING"
- [ ] Verify order status shows "PENDING"

## Admin Testing

### 1. View Orders
- [ ] Login as admin
- [ ] Go to Orders section
- [ ] Verify COD orders are visible
- [ ] Verify payment method is displayed correctly

### 2. Ship COD Order
- [ ] Select a COD order
- [ ] Click "Ship via Shiprocket"
- [ ] Select courier
- [ ] Verify order is created in Shiprocket
- [ ] Verify AWB is generated
- [ ] Verify label URL is available
- [ ] Verify manifest URL is available

### 3. Toggle COD
- [ ] Go to Settings
- [ ] Find COD toggle
- [ ] Disable COD
- [ ] Verify COD option disappears from checkout
- [ ] Enable COD
- [ ] Verify COD option reappears

## Shiprocket Verification

### 1. Check Shiprocket Dashboard
- [ ] Login to Shiprocket
- [ ] Find the order by order number
- [ ] Verify payment method is "COD" for COD orders
- [ ] Verify payment method is "Prepaid" for online orders
- [ ] Verify order details match

### 2. Verify AWB Generation
- [ ] Check if AWB is assigned
- [ ] Verify courier is assigned
- [ ] Check tracking URL

### 3. Verify Pickup
- [ ] Check if pickup is scheduled
- [ ] Verify pickup token number
- [ ] Check pickup status

## Database Verification

### 1. Check Order Document
```javascript
// In MongoDB
db.orders.findOne({ orderNumber: "ORD..." })
```
Verify:
- [ ] `payment.method` is "COD"
- [ ] `payment.status` is "PENDING"
- [ ] `status` is "PENDING"
- [ ] `shiprocket` object is empty initially
- [ ] `items` array has correct products
- [ ] `shippingAddress` is correct

### 2. Check Settings Document
```javascript
db.settings.findOne({ key: "COD_ENABLED" })
```
Verify:
- [ ] `value` is true or false
- [ ] `category` is "PAYMENT"
- [ ] `isActive` is true

## Edge Cases Testing

### 1. COD Disabled
- [ ] Disable COD from admin
- [ ] Try to checkout
- [ ] Verify only online payment is available
- [ ] Try to place COD order via API (should fail)

### 2. Invalid Pincode
- [ ] Enter invalid pincode
- [ ] Verify error message
- [ ] Verify delivery charge defaults to ₹100

### 3. Out of Stock
- [ ] Add product to cart
- [ ] Reduce stock to 0
- [ ] Try to place order
- [ ] Verify error message

### 4. Invalid Coupon
- [ ] Enter invalid coupon code
- [ ] Try to apply
- [ ] Verify error message
- [ ] Verify order can still be placed

### 5. Order Cancellation
- [ ] Place COD order
- [ ] Cancel order
- [ ] Verify stock is restored
- [ ] Verify order status is "CANCELLED"

## Performance Testing

### 1. Delivery Charge Calculation
- [ ] Measure time taken for pincode check
- [ ] Should be < 2 seconds
- [ ] Verify fallback to ₹100 if API fails

### 2. Order Creation
- [ ] Measure time for COD order creation
- [ ] Should be < 1 second
- [ ] Verify stock update is immediate

### 3. Shiprocket Order Creation
- [ ] Measure time for Shiprocket API call
- [ ] Should be < 3 seconds
- [ ] Verify error handling

## Security Testing

### 1. Authentication
- [ ] Try to place order without login
- [ ] Verify redirect to login
- [ ] Try to access admin endpoints as user
- [ ] Verify 403 error

### 2. Authorization
- [ ] Try to cancel another user's order
- [ ] Verify error
- [ ] Try to view another user's order
- [ ] Verify error

### 3. Input Validation
- [ ] Try to place order with negative quantity
- [ ] Try to place order with invalid pincode
- [ ] Try to place order with empty cart
- [ ] Verify all validations work

## Checklist Summary

### Must Pass (Critical)
- [ ] COD option visible in checkout
- [ ] COD orders are created successfully
- [ ] Stock is deducted for COD orders
- [ ] Orders appear in Shiprocket with correct payment method
- [ ] Admin can ship COD orders

### Should Pass (Important)
- [ ] Delivery charges calculate correctly
- [ ] Coupons work with COD orders
- [ ] Order cancellation works
- [ ] Stock is restored on cancellation
- [ ] Tracking works for COD orders

### Nice to Have (Optional)
- [ ] Performance is optimal
- [ ] Error messages are user-friendly
- [ ] Loading states are shown
- [ ] Success messages are clear

## Known Issues
- None currently

## Notes
- Test in staging environment first
- Use test Shiprocket account
- Monitor logs during testing
- Keep Shiprocket dashboard open for verification
