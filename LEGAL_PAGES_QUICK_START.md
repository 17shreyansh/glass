# Legal Pages - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

This will install:
- `react-helmet-async` - For SEO meta tags
- `react-quill` - For rich text editor in admin panel

### Step 2: Seed Legal Pages
```bash
cd be
node seeds/legalPageSeed.js
```

Expected output:
```
MongoDB Connected
Clearing existing legal pages...
Seeding legal pages...
✅ Legal pages seeded successfully!
Created 4 legal pages
```

### Step 3: Start Backend
```bash
cd be
npm start
```

### Step 4: Start Frontend
```bash
cd frontend
npm run dev
```

## ✅ Verify Installation

### Test Public Pages
Open in browser:
- http://localhost:5173/legal/privacy-policy
- http://localhost:5173/legal/terms-conditions
- http://localhost:5173/legal/shipping-policy
- http://localhost:5173/legal/return-refund-policy

### Test Admin Panel
1. Login: http://localhost:5173/admin
2. Click "Legal Pages" in sidebar
3. You should see 4 legal pages
4. Try editing one page
5. Preview the page

### Test Footer Links
1. Go to homepage: http://localhost:5173
2. Scroll to footer
3. Click on "Privacy Policy" under Policies section
4. Click on "Terms" under Policies section
5. Click on "Shipping" under Policies section
6. Click on "Returns" under Policies section

## 📝 Default Legal Pages Created

1. **Privacy Policy** (`privacy-policy`)
   - Information collection
   - Data usage
   - Security measures
   - User rights

2. **Terms & Conditions** (`terms-conditions`)
   - Acceptance of terms
   - Website usage
   - Product information
   - Pricing and orders

3. **Shipping Policy** (`shipping-policy`)
   - Shipping methods
   - Processing time
   - Delivery time
   - Restrictions

4. **Return & Refund Policy** (`return-refund-policy`)
   - Return window
   - Return conditions
   - Refund processing
   - Exchanges

## 🎨 Customization

### Edit Legal Pages Content
1. Login to admin panel
2. Go to Legal Pages
3. Click edit icon on any page
4. Use rich text editor to modify content
5. Update meta fields for SEO
6. Click "Update"

### Add New Legal Page
1. Click "Create Legal Page" button
2. Enter slug (e.g., `cookie-policy`)
3. Enter title (e.g., `Cookie Policy`)
4. Write content using rich text editor
5. Add meta fields
6. Click "Create"

### Toggle Page Visibility
- Use the switch in the table to activate/deactivate pages
- Inactive pages won't show on frontend

## 🔗 URL Structure

All legal pages follow this pattern:
```
/legal/{slug}
```

Examples:
- `/legal/privacy-policy`
- `/legal/terms-conditions`
- `/legal/shipping-policy`
- `/legal/return-refund-policy`
- `/legal/cookie-policy` (if you create it)

## 🛠️ Troubleshooting

### Issue: "Cannot find module 'react-helmet-async'"
**Solution:**
```bash
cd frontend
npm install react-helmet-async
```

### Issue: "Cannot find module 'react-quill'"
**Solution:**
```bash
cd frontend
npm install react-quill
```

### Issue: Legal pages not showing
**Solution:**
1. Check if backend is running
2. Check if pages are seeded: `node seeds/legalPageSeed.js`
3. Check if pages are active in admin panel

### Issue: Admin panel not showing Legal Pages menu
**Solution:**
1. Clear browser cache
2. Restart frontend dev server
3. Check if you're logged in as admin

## 📦 What Was Changed

### Backend Files Created:
- `be/models/LegalPage.js` - Database model
- `be/controllers/legalPageController.js` - API logic
- `be/routes/legalPageRoutes.js` - API routes
- `be/seeds/legalPageSeed.js` - Seed script

### Backend Files Modified:
- `be/server.js` - Added legal page routes

### Frontend Files Created:
- `frontend/src/pages/LegalPage.jsx` - Public page component
- `frontend/src/admin/pages/LegalPages.jsx` - Admin management

### Frontend Files Modified:
- `frontend/src/App.jsx` - Added legal page route
- `frontend/src/main.jsx` - Added HelmetProvider
- `frontend/src/admin/pages/AdminLayout.jsx` - Added menu item
- `frontend/src/components/layout/Footer.jsx` - Updated links
- `frontend/package.json` - Added dependencies

## 🎯 Next Steps

1. ✅ Customize legal page content for your business
2. ✅ Review and update meta tags for SEO
3. ✅ Test all pages on mobile devices
4. ✅ Add more legal pages if needed (Cookie Policy, GDPR, etc.)
5. ✅ Update footer with any additional links

## 📞 Support

If you encounter any issues:
1. Check the main documentation: `LEGAL_PAGES_SYSTEM.md`
2. Verify all dependencies are installed
3. Check browser console for errors
4. Check backend logs for API errors

---

**Setup Time**: ~5 minutes
**Status**: ✅ Ready to Use
