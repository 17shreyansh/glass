# Admin Panel Image URL Fix

## Problem
Image URLs in the admin panel were not displaying correctly due to hardcoded `http://localhost:3001` URLs.

## Root Cause
The Products.jsx component had hardcoded base URLs instead of using the environment variable, causing issues when:
- Running on different ports
- Deploying to production
- Using different API endpoints

## Solution
Replaced all hardcoded `http://localhost:3001` references with dynamic `API_BASE_URL` from environment variables.

### Changes Made (`frontend/src/admin/pages/Products.jsx`)

1. **Added API_BASE_URL constant**:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
   ```

2. **Updated image display in table**:
   - Changed: `http://localhost:3001${text}`
   - To: `${API_BASE_URL}${text}`

3. **Updated image display in grid view**:
   - Changed: `http://localhost:3001${product.mainImage}`
   - To: `${API_BASE_URL}${product.mainImage}`

4. **Updated image loading in edit mode**:
   - Main image URL: `${API_BASE_URL}${record.mainImage}`
   - Gallery images: `${API_BASE_URL}${url}`

5. **Updated image URL processing on submit**:
   - Changed: `mainFile.url.startsWith('http://localhost:3001')`
   - To: `mainFile.url.startsWith(API_BASE_URL)`

## Benefits
✅ Images display correctly in admin panel  
✅ Works with any API endpoint (dev/staging/production)  
✅ No hardcoded URLs  
✅ Easy to configure via .env file  

## Environment Variable
Set in `frontend/.env`:
```
VITE_API_URL=http://localhost:3001/api
```

The code automatically strips `/api` to get the base URL for images.
