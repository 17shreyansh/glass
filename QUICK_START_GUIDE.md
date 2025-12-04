# Quick Start Guide - E-Commerce System

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

#### Backend:
```bash
cd be
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

#### Backend (.env):
```env
MONGODB_URI=mongodb://localhost:27017/glass-store
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env):
```env
VITE_API_URL=http://localhost:3001/api
```

### Step 3: Start the Servers

#### Terminal 1 - Backend:
```bash
cd be
npm start
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Admin Panel**: http://localhost:5173/admin

### Step 5: Create Admin Account

Run the admin seed script:
```bash
cd be
node seeds/adminSeed.js
```

Default admin credentials:
- Email: admin@glass.com
- Password: admin123

## 🎯 Quick Test Flow

### Test User Journey:

1. **Register**: http://localhost:5173/signup
   - Create a new user account

2. **Browse Products**: http://localhost:5173/shop
   - View available products

3. **Add to Cart**:
   - Click "Add to Cart" on any product

4. **Add to Wishlist**:
   - Click the heart icon on products

5. **Checkout**: http://localhost:5173/checkout
   - Fill shipping address
   - Select payment method
   - Place order

6. **View Orders**: http://localhost:5173/account/orders
   - See your order status

### Test Admin Journey:

1. **Login**: http://localhost:5173/login
   - Use admin credentials

2. **Admin Dashboard**: http://localhost:5173/admin
   - View statistics

3. **Manage Orders**: http://localhost:5173/admin/orders
   - Update order status
   - Generate invoices

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution**: 
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Try: `mongod` or start MongoDB service

### Issue: CORS Error
**Solution**:
- Check FRONTEND_URL in backend .env
- Verify frontend is running on correct port
- Clear browser cache

### Issue: Razorpay Not Working
**Solution**:
- Get test keys from https://razorpay.com
- Add keys to backend .env
- Restart backend server
- Check browser console for errors

### Issue: Products Not Showing
**Solution**:
- Run product seed: `node seeds/productSeed.js`
- Check MongoDB connection
- Verify API is responding: http://localhost:3001/api/products

### Issue: Login Not Working
**Solution**:
- Check JWT_SECRET in .env
- Clear browser cookies
- Check browser console for errors
- Verify user exists in database

## 📦 Seed Data (Optional)

Add sample data to your database:

```bash
cd be

# Add admin user
node seeds/adminSeed.js

# Add categories
node seeds/categorySeed.js

# Add products
node seeds/productSeed.js

# Add more products
node seeds/addMoreProducts.js
```

## 🎨 Customize

### Change Colors:
Edit `frontend/src/App.jsx`:
```javascript
const theme = {
  token: {
    colorPrimary: '#667eea', // Change this
    borderRadius: 8,
  },
};
```

### Change Logo:
Replace `frontend/public/logo.png` with your logo

### Change Site Name:
Edit `frontend/index.html`:
```html
<title>Your Store Name</title>
```

## 📱 Test Payment

### Razorpay Test Cards:

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4000 0000 0000 0002

### Test UPI:
- UPI ID: success@razorpay
- For failure: failure@razorpay

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to strong random string
- [ ] Use production MongoDB
- [ ] Use production Razorpay keys
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Update CORS origins
- [ ] Remove console.logs
- [ ] Add rate limiting
- [ ] Enable MongoDB authentication

## 📊 Monitor Your Store

### Check Backend Health:
```bash
curl http://localhost:3001/api/health
```

### Check Database:
```bash
mongosh
use glass-store
db.orders.countDocuments()
db.products.countDocuments()
db.users.countDocuments()
```

## 🎉 You're Ready!

Your e-commerce store is now running with:
- ✅ User authentication
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Checkout system
- ✅ Order management
- ✅ Admin panel
- ✅ Payment integration

## 📞 Need Help?

1. Check console logs (browser & terminal)
2. Review error messages
3. Check network tab in browser DevTools
4. Verify environment variables
5. Restart servers

## 🚀 Next Steps

1. Add your products
2. Configure delivery charges
3. Create discount coupons
4. Customize design
5. Add more payment methods
6. Set up email notifications
7. Add SMS notifications
8. Configure shipping partners

Happy selling! 🛍️
