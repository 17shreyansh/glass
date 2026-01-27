# Shiprocket Integration - Quick Reference

## 🚀 Quick Start

### 1. Add Environment Variables
```env
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=your-password
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_PICKUP_PINCODE=110001
```

### 2. Configure Webhook
URL: `https://yourdomain.com/api/webhook/shiprocket`

### 3. Ship Your First Order
1. Admin Dashboard → Orders
2. Click rocket icon on confirmed order
3. Select courier → Ship Order

---

## 📡 API Quick Reference

### Check Pincode
```javascript
GET /api/orders/check-pincode?pincode=110001
```

### Ship Order (Admin)
```javascript
POST /api/orders/admin/orders/:orderId/ship
Body: { courierId: 1 }
```

### Get Tracking
```javascript
GET /api/orders/my-orders/:orderId/tracking
```

### Download Label
```javascript
GET /api/orders/admin/orders/:orderId/label
```

### Download Manifest
```javascript
GET /api/orders/admin/orders/:orderId/manifest
```

---

## 🏷️ Courier IDs

| Courier | ID |
|---------|-----|
| Delhivery | 1 |
| Bluedart | 2 |
| DTDC | 3 |
| Ecom Express | 4 |
| Xpressbees | 5 |

---

## 🔄 Status Flow

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
```

---

## 🎨 Frontend Components

### Pincode Check
```jsx
import PincodeCheck from '../components/PincodeCheck';
<PincodeCheck onPincodeVerified={(pincode) => {}} />
```

### Tracking Timeline
```jsx
import TrackingTimeline from '../components/TrackingTimeline';
<TrackingTimeline order={order} shippingHistory={history} />
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Auth failed | Check credentials in .env |
| Pincode not serviceable | Verify with Shiprocket |
| Webhook not working | Check public URL accessibility |
| AWB failed | Verify courier ID and order details |

---

## 📞 Quick Links

- Shiprocket Dashboard: https://app.shiprocket.in/
- API Docs: https://apidocs.shiprocket.in/
- Support: support@shiprocket.in

---

## ✅ Pre-Launch Checklist

- [ ] .env configured
- [ ] Webhook URL added in Shiprocket
- [ ] Test order shipped successfully
- [ ] Tracking visible to customer
- [ ] Labels/manifests downloadable

---

**Need detailed docs?** See `SHIPROCKET_INTEGRATION.md`
