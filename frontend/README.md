# Delicons - E-commerce Frontend

A modern React + Ant Design e-commerce frontend for jewelry store with complete UI components and responsive design.

## Features

- **Modern Tech Stack**: React 18, Ant Design 5, React Router DOM 6
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **State Management**: Context API for cart and user state
- **Complete E-commerce Flow**: Product browsing, cart, checkout, user account
- **Professional UI**: Clean, elegant design with consistent theming

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation with cart badge
│   ├── Footer.jsx      # Site footer with links
│   ├── ProductCard.jsx # Product display card
│   ├── ProductList.jsx # Product grid with sorting
│   ├── Sidebar.jsx     # Account navigation
│   └── CartSummary.jsx # Order summary component
├── pages/              # Page components
│   ├── Home.jsx        # Homepage with hero & categories
│   ├── AshtaDhatu.jsx  # Ashta Dhatu products
│   ├── FashionJewelry.jsx # Fashion jewelry products
│   ├── ProductDetail.jsx  # Product detail page
│   ├── Cart.jsx        # Shopping cart
│   ├── Checkout.jsx    # Multi-step checkout
│   ├── ContactUs.jsx   # Contact form & info
│   ├── AboutUs.jsx     # Company information
│   ├── ReturnRefund.jsx # Return policy
│   └── Account/        # User account pages
│       ├── AccountOverview.jsx
│       ├── MyOrders.jsx
│       ├── Wishlist.jsx
│       ├── Addresses.jsx
│       └── ReturnsRefunds.jsx
├── context/            # React Context providers
│   ├── CartContext.jsx # Cart state management
│   └── UserContext.jsx # User & wishlist state
├── data/               # Mock data
│   └── products.js     # Product data & utilities
├── App.jsx             # Main app with routing
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## Pages Overview

### Public Pages
- **Home**: Hero section, categories, bestsellers, testimonials
- **Ashta Dhatu**: Traditional jewelry collection
- **Fashion Jewelry**: Modern jewelry collection  
- **Product Detail**: Image gallery, specs, related products
- **Cart**: Item management, quantity controls
- **Checkout**: Multi-step form (shipping, payment, review)
- **Contact Us**: Contact form with business info
- **About Us**: Company story, values, timeline
- **Return & Refund**: Policy and process details

### Account Pages
- **Account Overview**: User profile and stats
- **My Orders**: Order history with status tracking
- **Wishlist**: Saved favorite products
- **Addresses**: Saved shipping addresses
- **Returns & Refunds**: Return/refund history

## Key Features

### Shopping Experience
- Product browsing with sorting and pagination
- Wishlist functionality
- Shopping cart with quantity management
- Multi-step checkout process
- Order summary calculations

### User Account
- Account dashboard with navigation sidebar
- Order tracking and history
- Wishlist management
- Address book
- Return/refund tracking

### Responsive Design
- Mobile-first responsive layout
- Tablet and desktop optimizations
- Touch-friendly interactions
- Collapsible navigation for mobile

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Technology Stack

- **React 18**: Latest React with hooks and concurrent features
- **Ant Design 5**: Professional UI component library
- **React Router DOM 6**: Client-side routing
- **Vite**: Fast build tool and dev server
- **Context API**: State management for cart and user data

## Customization

### Theming
The app uses Ant Design's ConfigProvider for consistent theming:
- Primary color: `#667eea`
- Border radius: `8px`
- Custom font family

### Adding Products
Update `src/data/products.js` to add new products or categories.

### Styling
- Global styles in `src/index.css`
- Component-specific styles using Ant Design's styling system
- Responsive breakpoints handled by Ant Design Grid

## Backend Integration Ready

The frontend is designed for easy backend integration:
- Context API can be replaced with Redux/Zustand if needed
- API calls can be added to context actions
- Form submissions ready for backend endpoints
- Authentication flow prepared in UserContext

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting with React Router
- Optimized images with proper sizing
- Minimal bundle size with tree shaking
- Fast development with Vite HMR