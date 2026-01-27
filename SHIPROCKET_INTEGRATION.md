# Shiprocket Integration - Complete Implementation Guide

## Overview
This document provides a complete guide for the Shiprocket API integration in your MERN e-commerce application. The integration automates order fulfillment, shipment tracking, and delivery management.

---

## 🚀 Features Implemented

### Backend
- ✅ Shiprocket authentication with token caching
- ✅ Pincode serviceability check
- ✅ Automated order creation in Shiprocket
- ✅ AWB (Airway Bill) generation
- ✅ Courier pickup scheduling
- ✅ Shipping label & manifest generation
- ✅ Real-time webhook integration for status updates
- ✅ Order tracking API

### Frontend
- ✅ Pincode availability check on checkout
- ✅ Admin dashboard "Ship via Shiprocket" button
- ✅ Download label & manifest buttons
- ✅ User order tracking timeline with live updates
- ✅ Shipping history display

---

## 📋 Prerequisites

1. **Shiprocket Account**: Sign up at [shiprocket.in](https://www.shiprocket.in/)
2. **API Credentials**: Get your email and password from Shiprocket dashboard
3. **Pickup Location**: Configure at least one pickup location in Shiprocket
4. **Node.js**: v14+ installed
5. **MongoDB**: Running instance
6. **Axios**: Already included in dependencies

---

## 🔧 Installation & Setup

### Step 1: Install Dependencies

```bash
cd be
npm install axios
```

### Step 2: Environment Variables

Add these to your `be/.env` file:

```env
# Shiprocket Configuration
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_PICKUP_PINCODE=110001
```

### Step 3: Update Database Schema

The Order model has been updated with Shiprocket fields. Run your application to apply schema changes automatically (Mongoose will handle it).

### Step 4: Configure Webhook in Shiprocket Dashboard

1. Login to Shiprocket Dashboard
2. Go to **Settings** → **API** → **Webhooks**
3. Add webhook URL: `https://yourdomain.com/api/webhook/shiprocket`
4. Select events: `Order Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`, `RTO`
5. Save configuration

---

## 📁 File Structure

### Backend Files Created/Modified

```
be/
├── models/
│   └── Order.js                    # ✅ Updated with Shiprocket fields
├── services/
│   └── shiprocket.service.js       # ✅ New - Shiprocket API integration
├── controllers/
│   ├── orderController.js          # ✅ Updated with Shiprocket methods
│   └── webhookController.js        # ✅ New - Webhook handler
├── routes/
│   ├── orderRoutes.js              # ✅ Updated with new routes
│   └── webhookRoutes.js            # ✅ New - Webhook routes
└── server.js                       # ✅ Updated to include webhook routes
```

### Frontend Files Created/Modified

```
frontend/src/
├── components/
│   ├── PincodeCheck.jsx            # ✅ New - Pincode serviceability
│   └── TrackingTimeline.jsx        # ✅ New - Order tracking UI
├── services/
│   ├── adminApi.js                 # ✅ Updated with Shiprocket APIs
│   └── api.js                      # ✅ Updated with tracking APIs
├── admin/pages/
│   └── Order.jsx                   # ✅ Updated with ship button
└── pages/Account/
    └── OrderDetail.jsx             # ✅ Updated with tracking timeline
```

---

## 🔌 API Endpoints

### Public Endpoints

```
GET  /api/orders/check-pincode?pincode=110001
     - Check delivery serviceability
```

### User Endpoints (Protected)

```
GET  /api/orders/my-orders/:orderId/tracking
     - Get order tracking information
```

### Admin Endpoints (Protected + Admin)

```
POST /api/orders/admin/orders/:orderId/ship
     Body: { courierId: 1 }
     - Ship order via Shiprocket

GET  /api/orders/admin/orders/:orderId/label
     - Get shipping label URL

GET  /api/orders/admin/orders/:orderId/manifest
     - Get manifest URL
```

### Webhook Endpoint (Public - Called by Shiprocket)

```
POST /api/webhook/shiprocket
     - Receive real-time shipment updates
```

---

## 🎯 Usage Guide

### For Customers

#### 1. Checkout - Pincode Check
```jsx
// Already integrated in checkout page
<PincodeCheck onPincodeVerified={(pincode, couriers) => {
  console.log('Delivery available!', couriers);
}} />
```

#### 2. Order Tracking
- Navigate to "My Orders"
- Click on any order
- View real-time tracking timeline with shipment status

### For Admin

#### 1. Ship an Order

1. Go to Admin → Orders
2. Find confirmed order
3. Click **Ship via Shiprocket** button (rocket icon)
4. Select courier service from dropdown
5. Click "Ship Order"

**What happens:**
- Order created in Shiprocket
- AWB generated automatically
- Pickup scheduled
- Label & manifest generated
- Order status updated to "PROCESSING"

#### 2. Download Documents

- **Label**: Click "Download Label" button
- **Manifest**: Click "Download Manifest" button

#### 3. Track Orders

View Shiprocket details in order drawer:
- AWB Code
- Courier Name
- Shipment ID
- Pickup Status

---

## 🔄 Shiprocket Workflow

```
1. Customer Places Order
   ↓
2. Admin Confirms Order
   ↓
3. Admin Clicks "Ship via Shiprocket"
   ↓
4. System Creates Order in Shiprocket
   ↓
5. AWB Generated & Pickup Scheduled
   ↓
6. Label & Manifest Created
   ↓
7. Courier Picks Up Package
   ↓
8. Real-time Updates via Webhook
   ↓
9. Customer Tracks Order
   ↓
10. Order Delivered
```

---

## 🎨 Frontend Components

### PincodeCheck Component

```jsx
import PincodeCheck from '../components/PincodeCheck';

<PincodeCheck 
  onPincodeVerified={(pincode, couriers) => {
    // Handle verified pincode
  }} 
/>
```

### TrackingTimeline Component

```jsx
import TrackingTimeline from '../components/TrackingTimeline';

<TrackingTimeline 
  order={orderData} 
  shippingHistory={orderData.shippingHistory} 
/>
```

---

## 🔐 Security Considerations

1. **Webhook Verification**: Consider adding signature verification for webhooks
2. **Rate Limiting**: Implement rate limiting on webhook endpoint
3. **Environment Variables**: Never commit `.env` file
4. **Token Caching**: Shiprocket token cached for 9 days (auto-refresh)

---

## 🐛 Troubleshooting

### Issue: "Shiprocket authentication failed"
**Solution**: Verify email and password in `.env` file

### Issue: "Pincode not serviceable"
**Solution**: Check if Shiprocket supports delivery to that pincode

### Issue: "Webhook not receiving updates"
**Solution**: 
- Verify webhook URL is publicly accessible
- Check Shiprocket dashboard webhook configuration
- Review server logs for incoming requests

### Issue: "AWB generation failed"
**Solution**: 
- Ensure courier ID is valid
- Check if order weight/dimensions are set
- Verify pickup location is configured

---

## 📊 Database Schema Changes

### Order Model - New Fields

```javascript
shiprocket: {
  orderId: Number,           // Shiprocket order ID
  shipmentId: Number,        // Shiprocket shipment ID
  awbCode: String,           // Airway Bill Number
  courierName: String,       // Assigned courier
  courierId: Number,         // Courier ID
  trackingUrl: String,       // Tracking URL
  labelUrl: String,          // Label download URL
  manifestUrl: String,       // Manifest download URL
  pickupScheduled: Boolean,  // Pickup status
  pickupTokenNumber: String  // Pickup token
},

shippingHistory: [{
  status: String,            // Status message
  statusCode: String,        // Status code
  timestamp: Date,           // Event timestamp
  location: String,          // Current location
  remarks: String            // Additional remarks
}]
```

---

## 🚦 Status Mapping

| Shiprocket Status | Your Order Status |
|-------------------|-------------------|
| PICKUP SCHEDULED  | PROCESSING        |
| PICKED UP         | PROCESSING        |
| IN TRANSIT        | SHIPPED           |
| OUT FOR DELIVERY  | SHIPPED           |
| DELIVERED         | DELIVERED         |
| CANCELLED         | CANCELLED         |
| RTO               | CANCELLED         |

---

## 📞 Support

For Shiprocket API issues:
- Email: support@shiprocket.in
- Documentation: https://apidocs.shiprocket.in/

For integration issues:
- Check server logs: `be/logs/`
- Review webhook payload in console
- Test API endpoints using Postman

---

## ✅ Testing Checklist

- [ ] Environment variables configured
- [ ] Pincode check working on checkout
- [ ] Admin can ship orders
- [ ] Labels download successfully
- [ ] Manifests download successfully
- [ ] Webhooks updating order status
- [ ] User can view tracking timeline
- [ ] Shipping history displays correctly

---

## 🎉 Congratulations!

Your Shiprocket integration is complete! Orders will now be automatically synced with Shiprocket, and customers can track their shipments in real-time.

---

**Last Updated**: December 2024
**Version**: 1.0.0
