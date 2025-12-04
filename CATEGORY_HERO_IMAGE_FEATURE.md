# Category Hero Image Feature Implementation

## Overview
Added hero image functionality to categories with category name displayed at the bottom of the hero section, matching the Shop page design and fonts.

## Changes Made

### 1. Backend Changes

#### Category Model (`be/models/Category.js`)
- Added `heroImage` field to store hero banner images for category pages
- Field type: String, default: null

#### Category Controller (`be/controllers/categoryController.js`)
- Updated `updateCategory` to handle hero image deletion when a new one is uploaded
- Updated `deleteCategory` to delete hero image when category is deleted

### 2. Admin Panel Changes

#### Categories Admin Page (`frontend/src/admin/pages/Categories.jsx`)
- Added state management for hero image:
  - `heroImageFile` - stores selected hero image file
  - `heroImagePreview` - stores preview URL for hero image
- Added hero image upload logic in `onFinish` function
- Added hero image preview in `handleEdit` function
- Added new form field "Hero Banner Image" with:
  - Upload button for selecting hero images
  - Image preview (recommended size: 1920x400px)
  - Tooltip explaining it's for category page banner
- Updated all reset functions to clear hero image state

### 3. Frontend Changes

#### Category Page (`frontend/src/pages/Category.jsx`)
- Added `API_BASE_URL` constant for constructing image URLs
- Added `getHeroImage()` function to:
  - Use category's hero image from database if available
  - Fall back to default hero image if not set
- Updated CategoryPage component to use dynamic hero image

#### CategoryPage Component (`frontend/src/components/CategoryPage.jsx`)
- Updated hero section height from 300px to 400px (matching Shop page)
- Moved category name from inside hero section to below it
- Category name now displays below hero with Shop page styling:
  - Font: 'Prata', serif
  - Color: #8E6A4E
  - Font weight: 400
  - Centered alignment
- Updated toolbar styling to match Shop page:
  - Font: 'HK Grotesk', 'Hanken Grotesk', sans-serif
  - Consistent button heights (32px)
  - Proper spacing and alignment
- Removed view mode toggle (grid/list) for cleaner interface
- Updated sort options to match Shop page (Featured, Price, Newest)

## Features

### Admin Panel
1. When creating/editing a category, admins can now upload:
   - **Category Image**: Small icon/thumbnail for category
   - **Hero Banner Image**: Large banner for category page (recommended: 1920x400px)

2. Image management:
   - Old images are automatically deleted when new ones are uploaded
   - Images are deleted when category is deleted
   - Preview shown before saving

### Frontend
1. Category pages now display:
   - Hero banner image (from database or default fallback)
   - Category name below hero section with elegant Prata font
   - Consistent styling with Shop page
   - Professional breadcrumb navigation

2. Typography:
   - Headings: 'Prata', serif (elegant, classic)
   - Body/UI: 'HK Grotesk', 'Hanken Grotesk', sans-serif (modern, clean)

## Usage

### For Admins
1. Go to Admin Panel → Categories
2. Click "Add New Category" or edit existing category
3. Fill in category details
4. Upload "Hero Banner Image" (recommended size: 1920x400px)
5. Save category

### For Users
- Visit any category page (e.g., `/category/sets`)
- See beautiful hero banner with category name displayed below
- Enjoy consistent design matching the Shop page

## Technical Details

### Database Schema
```javascript
{
  heroImage: { type: String, default: null }
}
```

### Image Storage
- Images stored in: `be/uploads/categories/`
- Served via: `/uploads/categories/[filename]`

### API Endpoints
- POST `/api/categories` - Create category with hero image
- PUT `/api/categories/:id` - Update category with hero image
- DELETE `/api/categories/:id` - Delete category and its images

## Benefits
1. **Consistent Design**: Category pages now match Shop page aesthetics
2. **Better UX**: Large hero images create visual impact
3. **Flexibility**: Each category can have unique hero image
4. **Professional Look**: Elegant typography and layout
5. **Easy Management**: Simple upload interface in admin panel
