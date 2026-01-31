# Legal Pages System - Complete Implementation

## Overview
A complete legal pages management system with frontend display, backend API, and admin panel editor with rich text editing and SEO meta fields.

## Features
✅ Dynamic legal pages (Privacy Policy, Terms & Conditions, Shipping Policy, Return Policy)
✅ Rich text editor (React Quill) in admin panel
✅ SEO meta fields (title, description, keywords)
✅ Active/Inactive status toggle
✅ Clean, professional page layout
✅ Mobile responsive
✅ No images on legal pages (text-only)
✅ Footer integration with legal page links

## Backend Structure

### Model: `be/models/LegalPage.js`
```javascript
{
  slug: String (unique, lowercase)
  title: String
  content: String (HTML content)
  metaTitle: String
  metaDescription: String
  metaKeywords: String
  isActive: Boolean
  lastUpdatedBy: ObjectId (User reference)
  timestamps: true
}
```

### Controller: `be/controllers/legalPageController.js`
- `getAllLegalPages` - Public: Get all active pages
- `getLegalPageBySlug` - Public: Get single page by slug
- `adminGetAllPages` - Admin: Get all pages (including inactive)
- `adminGetPage` - Admin: Get single page by ID
- `createLegalPage` - Admin: Create new page
- `updateLegalPage` - Admin: Update existing page
- `deleteLegalPage` - Admin: Delete page
- `togglePageStatus` - Admin: Toggle active/inactive status

### Routes: `be/routes/legalPageRoutes.js`
**Public Routes:**
- `GET /api/legal` - Get all active legal pages
- `GET /api/legal/:slug` - Get single legal page by slug

**Admin Routes (Protected):**
- `GET /api/legal/admin/all` - Get all pages
- `GET /api/legal/admin/:id` - Get single page
- `POST /api/legal/admin` - Create page
- `PUT /api/legal/admin/:id` - Update page
- `DELETE /api/legal/admin/:id` - Delete page
- `PATCH /api/legal/admin/:id/toggle` - Toggle status

## Frontend Structure

### Public Page: `frontend/src/pages/LegalPage.jsx`
- Dynamic route: `/legal/:slug`
- Fetches content from API based on slug
- SEO meta tags with react-helmet-async
- Clean, professional layout
- No images, text-only content
- Shows last updated date
- Includes Footer

### Admin Panel: `frontend/src/admin/pages/LegalPages.jsx`
- Full CRUD operations
- Rich text editor (React Quill)
- Meta fields editor (title, description, keywords)
- Active/Inactive toggle
- Preview button (opens in new tab)
- Table view with all pages
- Modal-based create/edit forms

## Installation & Setup

### 1. Install Dependencies

**Backend:**
```bash
cd be
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Seed Default Legal Pages
```bash
cd be
node seeds/legalPageSeed.js
```

This creates 4 default legal pages:
- Privacy Policy (`privacy-policy`)
- Terms & Conditions (`terms-conditions`)
- Shipping Policy (`shipping-policy`)
- Return & Refund Policy (`return-refund-policy`)

### 3. Start Servers

**Backend:**
```bash
cd be
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Usage

### Public Access
Users can access legal pages via:
- Footer links (Privacy Policy, Terms, Shipping, Returns)
- Direct URL: `http://localhost:5173/legal/privacy-policy`
- Direct URL: `http://localhost:5173/legal/terms-conditions`
- Direct URL: `http://localhost:5173/legal/shipping-policy`
- Direct URL: `http://localhost:5173/legal/return-refund-policy`

### Admin Access
1. Login to admin panel: `http://localhost:5173/admin`
2. Navigate to "Legal Pages" in sidebar
3. View all legal pages in table
4. Create new page with "Create Legal Page" button
5. Edit existing pages with edit icon
6. Toggle active/inactive status with switch
7. Preview pages with eye icon
8. Delete pages with delete icon

### Creating/Editing Legal Pages

**Required Fields:**
- Slug (unique identifier, lowercase, hyphenated)
- Title (page title)
- Content (HTML content via rich text editor)

**Optional Fields:**
- Meta Title (SEO title, defaults to title)
- Meta Description (SEO description)
- Meta Keywords (comma-separated keywords)
- Active Status (toggle visibility)

**Rich Text Editor Features:**
- Headers (H1, H2, H3)
- Bold, Italic, Underline, Strikethrough
- Ordered & Unordered Lists
- Indentation
- Links
- Clean formatting

## API Endpoints

### Public Endpoints

**Get All Active Legal Pages**
```
GET /api/legal
Response: Array of legal page objects (title, slug, metaTitle, metaDescription, updatedAt)
```

**Get Single Legal Page**
```
GET /api/legal/:slug
Response: Full legal page object with content
```

### Admin Endpoints (Requires Authentication)

**Get All Pages**
```
GET /api/legal/admin/all
Headers: Authorization: Bearer <token>
Response: Array of all legal pages with lastUpdatedBy populated
```

**Get Single Page**
```
GET /api/legal/admin/:id
Headers: Authorization: Bearer <token>
Response: Full legal page object
```

**Create Page**
```
POST /api/legal/admin
Headers: Authorization: Bearer <token>
Body: {
  slug: "new-page",
  title: "New Page",
  content: "<h2>Content</h2>",
  metaTitle: "New Page - MV Crafted",
  metaDescription: "Description",
  metaKeywords: "keywords",
  isActive: true
}
Response: Created legal page object
```

**Update Page**
```
PUT /api/legal/admin/:id
Headers: Authorization: Bearer <token>
Body: { title, content, metaTitle, metaDescription, metaKeywords, isActive }
Response: Updated legal page object
```

**Delete Page**
```
DELETE /api/legal/admin/:id
Headers: Authorization: Bearer <token>
Response: Success message
```

**Toggle Status**
```
PATCH /api/legal/admin/:id/toggle
Headers: Authorization: Bearer <token>
Response: Updated legal page object
```

## File Structure

```
be/
├── models/
│   └── LegalPage.js
├── controllers/
│   └── legalPageController.js
├── routes/
│   └── legalPageRoutes.js
├── seeds/
│   └── legalPageSeed.js
└── server.js (updated)

frontend/
├── src/
│   ├── pages/
│   │   └── LegalPage.jsx
│   ├── admin/
│   │   └── pages/
│   │       ├── LegalPages.jsx
│   │       └── AdminLayout.jsx (updated)
│   ├── components/
│   │   └── layout/
│   │       └── Footer.jsx (updated)
│   ├── App.jsx (updated)
│   └── main.jsx (updated)
└── package.json (updated)
```

## Styling

Legal pages use a clean, professional design:
- White content area on light gray background
- Maximum width: 1200px
- Proper typography hierarchy
- Responsive padding
- Clean spacing between sections
- Last updated date at bottom
- No images or graphics

## SEO Optimization

Each legal page includes:
- Custom meta title
- Meta description
- Meta keywords
- Semantic HTML structure
- Proper heading hierarchy
- Last updated timestamp

## Production Considerations

1. **Content Management**: Admin can update legal pages without code changes
2. **Version Control**: Track changes via lastUpdatedBy and timestamps
3. **SEO**: All pages have proper meta tags
4. **Performance**: Lightweight, text-only pages
5. **Accessibility**: Semantic HTML, proper heading structure
6. **Mobile**: Fully responsive design
7. **Security**: Admin routes protected with authentication

## Testing Checklist

- [ ] Seed default legal pages
- [ ] Access legal pages from footer links
- [ ] Access legal pages via direct URLs
- [ ] Login to admin panel
- [ ] View all legal pages in admin
- [ ] Create new legal page
- [ ] Edit existing legal page
- [ ] Toggle page active/inactive status
- [ ] Preview page in new tab
- [ ] Delete legal page
- [ ] Verify SEO meta tags in page source
- [ ] Test mobile responsiveness
- [ ] Verify footer links work correctly

## Future Enhancements

- Version history for legal pages
- Scheduled publishing
- Multi-language support
- Page templates
- Approval workflow
- Change notifications to users
- PDF export functionality

## Support

For issues or questions, contact the development team.

---

**Status**: ✅ Production Ready
**Last Updated**: ${new Date().toLocaleDateString()}
