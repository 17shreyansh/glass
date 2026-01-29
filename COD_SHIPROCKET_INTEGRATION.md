# COD & Shiprocket Integration - Complete Guide

## Overview
This document explains the Cash on Delivery (COD) and Shiprocket integration in the e-commerce system.

## Features Implemented

### 1. COD Payment Method
- ✅ COD option available in checkout
- ✅ Admin can enable/disable COD globally
- ✅ Orders are created immediately for COD
- ✅ No payment gateway required for COD orders
- ✅ Stock is deducted immediately on COD order placement

### 2. Shiprocket Integration
- ✅ Automatic delivery charge calculation based on pincode
- ✅ COD orders properly marked in Shiprocket
- ✅ Prepaid orders properly marked in Shiprocket
- ✅ Serviceability check before order placement
- ✅ AWB generation and tracking
- ✅ Label and manifest generation

## How It Works

### Frontend Flow

#### 1. Checkout Page (`frontend/src/pages/Checkout.jsx`)
```javascript
// Payment method selection
<Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
  <Radio value="RAZORPAY">Online Payment</Radio>
  <Radio value="COD">Cash on Delivery</Radio>
</Radio.Group>
```

#### 2. Order Placement
- **COD Orders**: Order is created immediately, user redirected to orders page
- **Online Orders**: Razorpay payment gateway opens, order created after payment verification

### Backend Flow

#### 1. Order Controller (`be/controllers/orderController.js`)

**Create Order Endpoint**: `POST /api/orders`
```javascript
// For COD orders
if (paymentMethod === 'COD') {
    const order = await orderService.createOrder({
        items,
        shippingAddress,
        paymentMethod: 'COD',
        couponCode
    }, userId);
    
    // Order created immediately
    // Stock deducted
    // Response sent to user
}

// For Razorpay orders
if (paymentMethod === 'RAZORPAY') {
    // Create Razorpay order
    // Return payment details
    // Order created after payment verification
}
```

#### 2. Order Service (`be/services/OrderService.js`)

**Order Creation**:
```javascript
async createOrder(orderData, userId) {
    // 1. Validate items and check stock
    // 2. Calculate delivery charges from Shiprocket
    // 3. Apply coupons if any
    // 4. Create order in database
    // 5. Update stock
    // 6. Update coupon usage
}
```

#### 3. Shiprocket Service (`be/services/shiprocket.service.js`)

**Key Methods**:

1. **Check Serviceability**
```javascript
await shiprocketService.checkServiceability(
    pickupPincode,
    deliveryPincode,
    cod, // 0 for prepaid, 1 for COD
    weight
);
```

2. **Create Order**
```javascript
await shiprocketService.createOrder({
    orderNumber,
    items,
    shippingAddress,
    payment: {
        method: 'COD' // or 'RAZORPAY'
    }
});
// Automatically sets payment_method as 'COD' or 'Prepaid' in Shiprocket
```

3. **Ship Order (Admin)**
```javascript
// Step 1: Create order in Shiprocket
const shiprocketOrder = await shiprocketService.createOrder(order);

// Step 2: Generate AWB
const awbData = await shiprocketService.generateAWB(shipmentId, courierId);

// Step 3: Schedule pickup
const pickupData = await shiprocketService.schedulePickup(shipmentId);

// Step 4: Generate label and manifest
const labelData = await shiprocketService.generateLabel(shipmentId);
const manifestData = await shiprocketService.generateManifest(shipmentId);
```

## API Endpoints

### Public Endpoints
- `GET /api/orders/cod-status` - Check if COD is enabled
- `GET /api/orders/check-pincode?pincode=110001` - Check serviceability

### User Endpoints (Authenticated)
- `POST /api/orders` - Create order (COD or Razorpay)
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `POST /api/orders/apply-coupon` - Apply coupon code
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/my-orders/:orderId` - Get single order
- `GET /api/orders/my-orders/:orderId/tracking` - Get tracking info
- `PATCH /api/orders/my-orders/:orderId/cancel` - Cancel order

### Admin Endpoints
- `GET /api/orders/admin/orders` - Get all orders
- `PATCH /api/orders/admin/orders/:orderId/status` - Update order status
- `POST /api/orders/admin/orders/:orderId/ship` - Ship order via Shiprocket
- `GET /api/orders/admin/orders/:orderId/label` - Download shipping label
- `GET /api/orders/admin/orders/:orderId/manifest` - Download manifest
- `POST /api/orders/admin/toggle-cod` - Enable/disable COD

## Environment Variables

Add these to your `.env` file:

```env
# Shiprocket Configuration
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password
SHIPROCKET_PICKUP_PINCODE=110001
SHIPROCKET_PICKUP_LOCATION=Primary

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

## Database Models

### Order Model
```javascript
{
  orderNumber: String,
  userId: ObjectId,
  items: [OrderItem],
  shippingAddress: Address,
  
  // Payment
  payment: {
    method: 'COD' | 'RAZORPAY',
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },
  
  // Shiprocket
  shiprocket: {
    orderId: Number,
    shipmentId: Number,
    awbCode: String,
    courierName: String,
    courierId: Number,
    trackingUrl: String,
    labelUrl: String,
    manifestUrl: String,
    pickupScheduled: Boolean
  },
  
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}
```

### Settings Model
```javascript
{
  key: 'COD_ENABLED',
  value: true, // or false
  category: 'PAYMENT',
  isActive: true
}
```

## Testing

### 1. Test COD Status
```bash
cd be
node test-cod.js
```

### 2. Manual Testing Steps

#### Enable COD (Admin)
1. Login as admin
2. Go to Settings > Payment Settings
3. Enable COD toggle
4. Save settings

#### Place COD Order (User)
1. Login as user
2. Add products to cart
3. Go to checkout
4. Fill shipping address
5. Select "Cash on Delivery" payment method
6. Click "Place Order"
7. Order should be created immediately
8. Check order status in "My Orders"

#### Ship COD Order (Admin)
1. Login as admin
2. Go to Orders
3. Select a COD order
4. Click "Ship via Shiprocket"
5. Select courier
6. Order will be created in Shiprocket with payment_method = 'COD'
7. AWB, label, and manifest will be generated

### 3. Verify Shiprocket Integration
1. Login to Shiprocket dashboard
2. Check if order appears with correct payment method (COD/Prepaid)
3. Verify order details match
4. Check AWB generation
5. Verify pickup scheduling

## Common Issues & Solutions

### Issue 1: COD Option Not Showing
**Solution**: 
- Check if COD is enabled in settings
- Verify `getCODStatus()` API call is working
- Check browser console for errors

### Issue 2: Shiprocket Order Creation Fails
**Solution**:
- Verify Shiprocket credentials in `.env`
- Check if pickup location is configured
- Verify pincode serviceability
- Check Shiprocket API logs

### Issue 3: Delivery Charges Not Calculating
**Solution**:
- Verify `SHIPROCKET_PICKUP_PINCODE` is set
- Check if Shiprocket API is accessible
- Verify pincode format (6 digits)
- Check network connectivity

### Issue 4: Stock Not Deducting for COD Orders
**Solution**:
- Check OrderService.createOrder() method
- Verify product variants exist
- Check stock update logs in console
- Verify product stock before order

## Best Practices

1. **Always verify COD availability** before showing the option
2. **Check pincode serviceability** before allowing checkout
3. **Log all Shiprocket API calls** for debugging
4. **Handle Shiprocket API failures gracefully** with fallback delivery charges
5. **Update order status** in sync with Shiprocket tracking
6. **Test COD orders** in staging before production
7. **Monitor COD order cancellation rates** to detect fraud
8. **Set COD limits** if needed (e.g., max order value for COD)

## Security Considerations

1. **COD Fraud Prevention**:
   - Limit COD to verified users after first successful order
   - Set maximum order value for COD
   - Monitor cancellation patterns
   - Verify phone numbers

2. **Shiprocket API Security**:
   - Store credentials in environment variables
   - Use token-based authentication
   - Implement rate limiting
   - Log all API calls

3. **Payment Verification**:
   - Always verify Razorpay signatures
   - Never trust client-side payment status
   - Implement webhook verification
   - Log all payment attempts

## Future Enhancements

1. **COD Charges**: Add COD handling charges
2. **COD Limits**: Set min/max order value for COD
3. **Partial COD**: Allow partial payment online + COD
4. **COD Verification**: OTP verification for COD orders
5. **Smart Routing**: Auto-select best courier based on COD/Prepaid
6. **Bulk Shipping**: Ship multiple orders at once
7. **Return Integration**: Handle returns via Shiprocket
8. **NDR Management**: Handle non-delivery reports

## Support

For issues or questions:
1. Check logs in `be/logs/`
2. Review Shiprocket dashboard
3. Check order status in database
4. Contact Shiprocket support if API issues persist

## Changelog

### v1.0.0 (Current)
- ✅ COD payment method implemented
- ✅ Shiprocket integration complete
- ✅ Delivery charge calculation
- ✅ Order tracking
- ✅ Label and manifest generation
- ✅ Admin controls for COD
