import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

// Context Providers
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';

// Layout Components
import { Navbar } from './components';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import ReturnRefund from './pages/ReturnRefund';


// Account Pages
import AccountOverview from './pages/Account/AccountOverview';
import MyOrders from './pages/Account/MyOrders';
import OrderDetail from './pages/Account/OrderDetail';
import Wishlist from './pages/Account/Wishlist';
import Addresses from './pages/Account/Addresses';
import ReturnsRefunds from './pages/Account/ReturnsRefunds';

// Admin Pages
import AdminLayout from './admin/pages/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import Categories from './admin/pages/Categories';
import Brand from './admin/pages/Brand';
import Order from './admin/pages/Order';
import Users from './admin/pages/users';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Constants
import { ROUTES } from './constants/routes';

const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <UserProvider>
          <CartProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <div className="App">
                <Routes>
                  {/* Admin Routes - No Navbar */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  } />
                  
                  {/* All other routes - With Navbar */}
                  <Route path="*" element={
                    <>
                      <Navbar />
                      <Routes>
                        {/* Main Pages */}
                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path={ROUTES.SHOP} element={<Shop />} />
                        <Route path={ROUTES.CATEGORY} element={<Category />} />
                        <Route path="/collections" element={<Shop />} />
                        
                        {/* Auth Pages */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/auth" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-email/:token" element={<VerifyEmail />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        
                        {/* Product & Shopping */}
                        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
                        <Route path={ROUTES.CART} element={<Cart />} />
                        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
                        
                        {/* Info Pages */}
                        <Route path={ROUTES.CONTACT_US} element={<ContactUs />} />
                        <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />
                        <Route path={ROUTES.RETURN_REFUND} element={<ReturnRefund />} />

                        
                        {/* Account Pages */}
                        <Route path={ROUTES.ACCOUNT} element={<ProtectedRoute><AccountOverview /></ProtectedRoute>} />
                        <Route path={ROUTES.ACCOUNT_ORDERS} element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                        <Route path="/account/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                        <Route path={ROUTES.ACCOUNT_WISHLIST} element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                        <Route path={ROUTES.ACCOUNT_ADDRESSES} element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
                        <Route path={ROUTES.ACCOUNT_RETURNS} element={<ProtectedRoute><ReturnsRefunds /></ProtectedRoute>} />
                      </Routes>
                    </>
                  } />
                </Routes>
              </div>
            </Router>
          </CartProvider>
        </UserProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;