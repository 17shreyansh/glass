# Checkout & Invoice Shiprocket Integration Fix

## Issues Fixed

### 1. **Delivery Charges**
- ❌ **Before**: Showed "FREE" shipping, used static database values (₹50 default)
- ✅ **After**: Fetches real-time delivery charges from Shiprocket API based on pincode

### 2. **GST Calculation**
- ❌ **Before**: GST was removed from backend but still shown in frontend
- ✅ **After**: GST (18%) properly calculated on subtotal after discount in both backend and frontend

### 3. **Invoice Generation**
- ❌ **Before**: Invoice didn't show delivery discount separately
- ✅ **After**: Invoice shows both product discount and delivery discount separately

### 4. **Coupon Handling**
- ❌ **Before**: Coupon validation didn't consider delivery charges
- ✅ **After**: Coupon properly applies to products or delivery, updates UI accordingly

## Changes Made

### Backend (`be/services/OrderService.js`)
```javascript
// Now fetches Shiprocket delivery charges
const serviceability = await shiprocketService.checkServiceability(
    pickupPincode,
    shippingAddress.pincode,
    0,
    weight
);
deliveryCharge = Math.min(...charges); // Cheapest courier
```

### Frontend (`frontend/src/pages/Checkout.jsx`)
```javascript
// Fetches delivery charge when address is selected
const fetchDeliveryCharge = async (pincode) => {
    const response = await apiService.request(`/orders/check-pincode?pincode=${pincode}`);
    setDeliveryCharge(Math.min(...charges));
};
```

### Invoice (`be/controllers/orderController.js`)
```javascript
// Shows delivery discount separately
if (order.discountOnDelivery > 0) {
    doc.text('Delivery Discount:', summaryX, summaryY)
        .text(`-${formatCurrency(order.discountOnDelivery)}`, ...);
}
```

## Calculation Flow

### Order Total Calculation:
1. **Subtotal** = Sum of (item.price × item.quantity)
2. **Delivery Charge** = Shiprocket API (based on pincode & weight)
3. **Product Discount** = Coupon discount on products
4. **Delivery Discount** = Coupon discount on delivery (FREE_SHIPPING type)
5. **GST (18%)** = (Subtotal - Product Discount) × 0.18
6. **Total** = Subtotal - Product Discount + Delivery Charge - Delivery Discount + GST

### Example:
- Subtotal: ₹1000
- Delivery (Shiprocket): ₹120
- Coupon (10% off): -₹100
- GST (18% on ₹900): ₹162
- **Total: ₹1182**

## Testing Checklist

- [x] Delivery charge fetched from Shiprocket on address selection
- [x] GST calculated correctly (18% on subtotal after discount)
- [x] Coupon applies correctly (product discount or free shipping)
- [x] Invoice shows all charges accurately
- [x] Razorpay amount matches order total
- [x] Order confirmation email shows correct amounts

## Notes

- Default delivery charge: ₹100 (if Shiprocket API fails)
- Weight per item: 0.5 kg (configurable)
- Pickup pincode: From `SHIPROCKET_PICKUP_PINCODE` env variable
- GST rate: 18% (fixed)
