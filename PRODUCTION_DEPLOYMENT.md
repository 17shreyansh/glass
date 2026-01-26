# Production Deployment Guide

## ✅ Fixed Issues

### 1. Email Configuration
- ✅ Changed brand name from "Your Shoe Store" to **MV Crafted**
- ✅ Fixed email links to use frontend URLs instead of backend `/api` URLs
- ✅ Updated email styling with brand colors (#8E6A4E)
- ✅ All emails now properly branded and professional

### 2. Production-Ready Configuration
- ✅ Set `NODE_ENV=production` in backend `.env`
- ✅ Environment-based CORS configuration
- ✅ Secure cookie settings for production
- ✅ Added `FRONTEND_URL` environment variable for email links

### 3. Frontend Routes
- ✅ Created `/verify-email/:token` page
- ✅ Created `/reset-password/:token` page
- ✅ Updated App.jsx with new routes

## 🚀 Deployment Checklist

### Backend Deployment

1. **Environment Variables**
   ```bash
   # Update .env file with production values
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-secure-secret
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Security Settings**
   - ✅ Secure cookies enabled in production
   - ✅ CORS restricted to production domains
   - ✅ HTTPS enforced for cookies

3. **Email Configuration**
   - ✅ SMTP configured with Hostinger
   - ✅ Email templates branded with MV Crafted
   - ✅ Links point to frontend URLs

### Frontend Deployment

1. **Environment Variables**
   ```bash
   # Update .env file
   VITE_API_URL=https://api.yourdomain.com/api
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

## 📧 Email Features

### Registration Email
- Subject: "Verify Your Email for MV Crafted Account"
- Link: `https://yourdomain.com/verify-email/{token}`
- Branding: MV Crafted with brand colors

### Password Reset Email
- Subject: "Password Reset Request for MV Crafted"
- Link: `https://yourdomain.com/reset-password/{token}`
- Branding: MV Crafted with brand colors

### Resend Verification Email
- Subject: "Resend Email Verification for MV Crafted"
- Link: `https://yourdomain.com/verify-email/{token}`
- Branding: MV Crafted with brand colors

## 🔒 Security Features

1. **JWT Tokens**
   - HttpOnly cookies
   - Secure flag in production
   - SameSite: Strict in production

2. **CORS**
   - Restricted to production domains
   - Credentials enabled
   - Proper headers configured

3. **Email Security**
   - Token expiration (24h for verification, 15min for reset)
   - Hashed tokens in database
   - Generic error messages to prevent enumeration

## 📝 Testing Before Production

1. **Test Email Flow**
   ```bash
   # Run test script
   node be/test-email.js
   ```

2. **Test Registration**
   - Register new user
   - Check email received
   - Click verification link
   - Verify redirect to login

3. **Test Password Reset**
   - Request password reset
   - Check email received
   - Click reset link
   - Set new password
   - Verify login works

## 🌐 Production URLs

### Backend
- API: `http://localhost:3001/api` (development)
- API: `https://api.yourdomain.com/api` (production)

### Frontend
- App: `http://localhost:5173` (development)
- App: `https://yourdomain.com` (production)

## 📊 Monitoring

1. **Health Check**
   - Endpoint: `/api/health`
   - Returns: `{ status: "OK", message: "API is healthy" }`

2. **Logs**
   - Email sending logs
   - Order cleanup job logs
   - Error logs

## 🔧 Maintenance

### Scheduled Jobs
- Order cleanup: Every 15 minutes
- Cleans abandoned orders older than 30 minutes

### Database Backups
- Regular MongoDB backups recommended
- Store backups securely

## 📞 Support

For issues or questions:
- Check logs in console
- Review email configuration
- Verify environment variables
- Test SMTP connection

---

**Last Updated:** $(date)
**Version:** 1.0.0
**Status:** Production Ready ✅
