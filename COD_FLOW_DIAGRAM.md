# COD & Payment Flow Diagram

## Complete Order Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. BROWSE & ADD TO CART
   ┌──────────┐
   │ Products │ → Add to Cart → ┌──────┐
   └──────────┘                  │ Cart │
                                 └──────┘
                                    ↓
2. CHECKOUT - STEP 1 (Cart Review)
   ┌─────────────────────────────────────┐
   │ • Review Items                      │
   │ • Apply Coupon (Optional)           │
   │ • View Subtotal                     │
   │ • Calculate Delivery Charges        │
   └─────────────────────────────────────┘
                ↓
3. CHECKOUT - STEP 2 (Address & Payment)
   ┌─────────────────────────────────────┐
   │ • Select/Add Delivery Address       │
   │ • Delivery Charge Calculated        │
   │ • SELECT PAYMENT METHOD:            │
   │   ┌─────────────────────────────┐   │
   │   │ ○ Online Payment (Razorpay) │   │
   │   │ ○ Cash on Delivery (COD)    │   │
   │   └─────────────────────────────┘   │
   └─────────────────────────────────────┘
                ↓
        ┌───────┴────────┐
        │                │
    COD Path      Razorpay Path
        │                │
        ↓                ↓

┌──────────────────────┐  ┌──────────────────────┐
│   COD ORDER FLOW     │  │  RAZORPAY ORDER FLOW │
└──────────────────────┘  └──────────────────────┘

COD:                      RAZORPAY:
1. Click "Place Order"    1. Click "Place Order & Pay"
   ↓                         ↓
2. Order Created          2. Razorpay Modal Opens
   Immediately               ↓
   ↓                      3. User Pays
3. Stock Deducted            ↓
   ↓                      4. Payment Verified
4. Order Status:             ↓
   - PENDING              5. Order Created
   ↓                         ↓
5. Payment Status:        6. Stock Deducted
   - PENDING                 ↓
   ↓                      7. Order Status:
6. Success Message           - CONFIRMED
   ↓                         ↓
7. Redirect to Orders     8. Payment Status:
                             - PAID
                             ↓
                          9. Success Message
                             ↓
                          10. Redirect to Orders

┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

1. VIEW ORDERS
   ┌─────────────────────────────────┐
   │ All Orders Dashboard            │
   │ • Filter by Status              │
   │ • Filter by Payment Method      │
   │ • Search Orders                 │
   └─────────────────────────────────┘
                ↓
2. SELECT ORDER TO SHIP
   ┌─────────────────────────────────┐
   │ Order Details                   │
   │ • Order Number                  │
   │ • Items                         │
   │ • Customer Info                 │
   │ • Payment Method: COD/Prepaid   │
   │ • Payment Status                │
   └─────────────────────────────────┘
                ↓
3. SHIP VIA SHIPROCKET
   ┌─────────────────────────────────┐
   │ Click "Ship via Shiprocket"     │
   └─────────────────────────────────┘
                ↓
4. SHIPROCKET INTEGRATION
   ┌─────────────────────────────────┐
   │ Step 1: Create Order            │
   │   • Send order to Shiprocket    │
   │   • payment_method: COD/Prepaid │
   │   ↓                             │
   │ Step 2: Generate AWB            │
   │   • Select Courier              │
   │   • Get AWB Code                │
   │   ↓                             │
   │ Step 3: Schedule Pickup         │
   │   • Schedule pickup time        │
   │   • Get pickup token            │
   │   ↓                             │
   │ Step 4: Generate Documents      │
   │   • Shipping Label              │
   │   • Manifest                    │
   └─────────────────────────────────┘
                ↓
5. ORDER UPDATED
   ┌─────────────────────────────────┐
   │ • Status: PROCESSING            │
   │ • Tracking Number: AWB Code     │
   │ • Shiprocket Data Saved         │
   │ • Label & Manifest URLs         │
   └─────────────────────────────────┘
                ↓
6. TRACK SHIPMENT
   ┌─────────────────────────────────┐
   │ • Real-time Tracking            │
   │ • Status Updates                │
   │ • Delivery Estimates            │
   └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

Frontend (React)
    ↓
API Service (api.js)
    ↓
Backend Routes (orderRoutes.js)
    ↓
Order Controller (orderController.js)
    ↓
Order Service (OrderService.js)
    ├─→ Product Validation
    ├─→ Stock Check
    ├─→ Coupon Validation
    ├─→ Delivery Charge Calculation
    │   └─→ Shiprocket Service
    │       └─→ checkServiceability()
    ├─→ Order Creation
    │   ├─→ MongoDB (Order Model)
    │   └─→ Stock Update
    └─→ Payment Processing
        ├─→ COD: Immediate Order
        └─→ Razorpay: Payment Gateway

Shiprocket Service (shiprocket.service.js)
    ├─→ authenticate()
    ├─→ checkServiceability()
    ├─→ createOrder()
    ├─→ generateAWB()
    ├─→ schedulePickup()
    ├─→ generateLabel()
    ├─→ generateManifest()
    └─→ trackShipment()

┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE STRUCTURE                            │
└─────────────────────────────────────────────────────────────────┘

Order Document:
{
  orderNumber: "ORD1234567890",
  userId: ObjectId,
  items: [
    {
      productId: ObjectId,
      name: "Product Name",
      price: 999,
      quantity: 2,
      size: "Medium",
      color: "Blue"
    }
  ],
  shippingAddress: {
    fullName: "John Doe",
    phone: "9876543210",
    email: "john@example.com",
    address: "123 Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  payment: {
    method: "COD" | "RAZORPAY",
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
    razorpayOrderId: "order_xxx",
    razorpayPaymentId: "pay_xxx",
    razorpaySignature: "signature_xxx"
  },
  shiprocket: {
    orderId: 12345,
    shipmentId: 67890,
    awbCode: "AWB123456",
    courierName: "Delhivery",
    courierId: 1,
    labelUrl: "https://...",
    manifestUrl: "https://...",
    pickupScheduled: true,
    pickupTokenNumber: "PKP123"
  },
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  subtotal: 1998,
  deliveryCharge: 100,
  discountAmount: 200,
  discountOnDelivery: 0,
  gstAmount: 323.64,
  totalAmount: 2221.64
}

Settings Document:
{
  key: "COD_ENABLED",
  value: true,
  category: "PAYMENT",
  isActive: true
}

┌─────────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                                 │
└─────────────────────────────────────────────────────────────────┘

PUBLIC:
GET  /api/orders/cod-status
GET  /api/orders/check-pincode?pincode=110001

USER (Authenticated):
POST   /api/orders                          → Create Order
POST   /api/orders/verify-payment           → Verify Razorpay Payment
POST   /api/orders/apply-coupon             → Apply Coupon
GET    /api/orders/my-orders                → Get User Orders
GET    /api/orders/my-orders/:id            → Get Single Order
GET    /api/orders/my-orders/:id/tracking   → Get Tracking
PATCH  /api/orders/my-orders/:id/cancel     → Cancel Order
GET    /api/orders/invoice/:id              → Download Invoice

ADMIN:
GET    /api/orders/admin/orders             → Get All Orders
PATCH  /api/orders/admin/orders/:id/status  → Update Status
POST   /api/orders/admin/orders/:id/ship    → Ship via Shiprocket
GET    /api/orders/admin/orders/:id/label   → Download Label
GET    /api/orders/admin/orders/:id/manifest → Download Manifest
POST   /api/orders/admin/toggle-cod         → Enable/Disable COD

┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT METHOD COMPARISON                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┬──────────────────┬──────────────────────┐
│     Feature         │       COD        │      Razorpay        │
├─────────────────────┼──────────────────┼──────────────────────┤
│ Payment Timing      │ On Delivery      │ Immediate            │
│ Order Creation      │ Immediate        │ After Payment        │
│ Stock Deduction     │ Immediate        │ After Payment        │
│ Payment Status      │ PENDING          │ PAID                 │
│ Order Status        │ PENDING          │ CONFIRMED            │
│ Risk                │ Higher (COD)     │ Lower (Prepaid)      │
│ Customer Trust      │ Higher           │ Lower                │
│ Conversion Rate     │ Higher           │ Lower                │
│ Payment Gateway Fee │ None             │ 2-3%                 │
│ Shiprocket Method   │ COD              │ Prepaid              │
│ Cancellation        │ Easy             │ Requires Refund      │
└─────────────────────┴──────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    STATUS TRANSITIONS                            │
└─────────────────────────────────────────────────────────────────┘

COD Order Status Flow:
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
   ↓
CANCELLED (if cancelled before shipping)

Razorpay Order Status Flow:
CONFIRMED → PROCESSING → SHIPPED → DELIVERED
   ↓
CANCELLED → REFUNDED (if cancelled after payment)

Payment Status Flow:
COD:      PENDING → PAID (on delivery)
Razorpay: PAID → REFUNDED (if cancelled)

┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                                │
└─────────────────────────────────────────────────────────────────┘

1. COD Disabled
   → Show only Razorpay option
   → Display message: "COD not available"

2. Invalid Pincode
   → Show error message
   → Default delivery charge: ₹100
   → Allow order placement

3. Out of Stock
   → Block order placement
   → Show error: "Product out of stock"
   → Suggest alternatives

4. Shiprocket API Failure
   → Log error
   → Use fallback delivery charge
   → Allow order placement
   → Retry shipping later

5. Payment Failure (Razorpay)
   → Show error message
   → Allow retry
   → Don't create order
   → Don't deduct stock

6. Order Cancellation
   → Restore stock
   → Update order status
   → Process refund (if paid)
   → Cancel in Shiprocket (if shipped)
```

## Key Points

### COD Benefits
- ✅ No payment gateway fees
- ✅ Higher conversion rates
- ✅ Increased customer trust
- ✅ Wider customer reach
- ✅ Immediate order placement

### COD Challenges
- ⚠️ Higher cancellation risk
- ⚠️ Cash handling required
- ⚠️ Delayed payment receipt
- ⚠️ Potential fraud
- ⚠️ Return to origin costs

### Best Practices
1. Monitor COD cancellation rates
2. Set order value limits for COD
3. Verify customer phone numbers
4. Track repeat offenders
5. Offer incentives for prepaid orders
6. Use Shiprocket's COD remittance
7. Keep accurate inventory
8. Provide excellent customer service
