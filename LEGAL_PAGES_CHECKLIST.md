# Legal Pages - Deployment Checklist

## 📋 Pre-Deployment Checklist

### 1. Installation ✅
- [ ] Navigate to frontend directory: `cd frontend`
- [ ] Install dependencies: `npm install`
- [ ] Verify react-helmet-async installed
- [ ] Verify react-quill installed

### 2. Database Setup ✅
- [ ] Navigate to backend directory: `cd be`
- [ ] Run seed script: `node seeds/legalPageSeed.js`
- [ ] Verify 4 legal pages created
- [ ] Check MongoDB for LegalPage collection

### 3. Backend Testing ✅
- [ ] Start backend: `npm start`
- [ ] Test public endpoint: `GET http://localhost:3001/api/legal`
- [ ] Test single page: `GET http://localhost:3001/api/legal/privacy-policy`
- [ ] Verify API returns data

### 4. Frontend Testing ✅
- [ ] Start frontend: `npm run dev`
- [ ] Visit: `http://localhost:5173/legal/privacy-policy`
- [ ] Visit: `http://localhost:5173/legal/terms-conditions`
- [ ] Visit: `http://localhost:5173/legal/shipping-policy`
- [ ] Visit: `http://localhost:5173/legal/return-refund-policy`
- [ ] Verify all pages load correctly

### 5. Footer Links ✅
- [ ] Go to homepage
- [ ] Scroll to footer
- [ ] Click "Privacy Policy" under Policies
- [ ] Click "Terms" under Policies
- [ ] Click "Shipping" under Policies
- [ ] Click "Returns" under Policies
- [ ] Verify all links work

### 6. Admin Panel ✅
- [ ] Login to admin: `http://localhost:5173/admin`
- [ ] Find "Legal Pages" in sidebar
- [ ] Click "Legal Pages"
- [ ] Verify table shows 4 pages
- [ ] Test create new page
- [ ] Test edit existing page
- [ ] Test toggle active/inactive
- [ ] Test preview button
- [ ] Test delete page (optional)

### 7. SEO Verification ✅
- [ ] Open any legal page
- [ ] View page source (Ctrl+U)
- [ ] Verify `<title>` tag present
- [ ] Verify `<meta name="description">` present
- [ ] Verify `<meta name="keywords">` present

### 8. Mobile Testing ✅
- [ ] Open legal page on mobile/tablet
- [ ] Verify responsive layout
- [ ] Check text readability
- [ ] Test footer links on mobile
- [ ] Verify admin panel on tablet

### 9. Content Review ✅
- [ ] Review Privacy Policy content
- [ ] Review Terms & Conditions content
- [ ] Review Shipping Policy content
- [ ] Review Return & Refund Policy content
- [ ] Update content for your business
- [ ] Update meta tags for SEO

### 10. Production Preparation ✅
- [ ] Update legal content with real business info
- [ ] Add company name, address, contact info
- [ ] Review all legal disclaimers
- [ ] Get legal review (recommended)
- [ ] Update meta descriptions
- [ ] Set all pages to active

## 🚀 Deployment Steps

### Backend Deployment
```bash
# 1. Ensure .env is configured
# 2. Run seed script on production DB
NODE_ENV=production node seeds/legalPageSeed.js

# 3. Deploy backend
# (Your deployment process)
```

### Frontend Deployment
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Deploy build folder
# (Your deployment process)
```

## ✅ Post-Deployment Verification

### Production URLs
- [ ] Test: `https://yourdomain.com/legal/privacy-policy`
- [ ] Test: `https://yourdomain.com/legal/terms-conditions`
- [ ] Test: `https://yourdomain.com/legal/shipping-policy`
- [ ] Test: `https://yourdomain.com/legal/return-refund-policy`

### Production Admin
- [ ] Login to production admin panel
- [ ] Verify Legal Pages accessible
- [ ] Test editing a page
- [ ] Verify changes reflect on frontend

### Production Footer
- [ ] Check footer links on production
- [ ] Verify all legal page links work
- [ ] Test on mobile devices

### SEO Check
- [ ] Google Search Console: Submit sitemap
- [ ] Verify meta tags in production
- [ ] Check page load speed
- [ ] Verify mobile-friendly

## 🔍 Monitoring

### Regular Checks
- [ ] Monitor legal page views in analytics
- [ ] Check for broken links monthly
- [ ] Review content quarterly
- [ ] Update "Last Updated" dates when changed
- [ ] Monitor admin panel usage

### Maintenance
- [ ] Keep legal content up-to-date
- [ ] Review and update policies annually
- [ ] Monitor for legal compliance changes
- [ ] Backup legal page content
- [ ] Version control for major changes

## 📊 Success Metrics

- [ ] All 4 legal pages accessible
- [ ] Footer links working
- [ ] Admin panel functional
- [ ] SEO tags present
- [ ] Mobile responsive
- [ ] Fast page load (<2s)
- [ ] No console errors
- [ ] No API errors

## 🐛 Common Issues & Solutions

### Issue: Pages not loading
**Check:**
- Backend running?
- Database seeded?
- API endpoint correct?
- Pages set to active?

### Issue: Admin panel not showing Legal Pages
**Check:**
- Logged in as admin?
- AdminLayout.jsx updated?
- Browser cache cleared?
- Frontend restarted?

### Issue: Footer links not working
**Check:**
- Footer.jsx updated?
- Routes in App.jsx added?
- Correct slug format?

### Issue: Rich text editor not working
**Check:**
- react-quill installed?
- CSS imported?
- Modal destroyOnClose set?

## 📝 Documentation

- [ ] Read: `LEGAL_PAGES_SYSTEM.md`
- [ ] Read: `LEGAL_PAGES_QUICK_START.md`
- [ ] Read: `LEGAL_PAGES_IMPLEMENTATION_SUMMARY.md`
- [ ] Bookmark admin panel URL
- [ ] Share docs with team

## 🎯 Final Checklist

- [ ] All dependencies installed
- [ ] Database seeded
- [ ] Backend running
- [ ] Frontend running
- [ ] All pages accessible
- [ ] Footer links working
- [ ] Admin panel working
- [ ] SEO tags present
- [ ] Mobile responsive
- [ ] Content reviewed
- [ ] Ready for production

## 📞 Support

If any checklist item fails:
1. Check documentation
2. Review error logs
3. Verify file changes
4. Check browser console
5. Test API endpoints

---

**Checklist Version**: 1.0
**Last Updated**: ${new Date().toLocaleDateString()}
**Status**: Ready for Deployment ✅
