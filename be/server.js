// server.js
require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const isAdmin = require('./routes/isadmin'); // This is likely your route for checking admin status
const uploadRoutes = require('./routes/uploadRoutes'); // <--- NEW: Import the upload routes
const path = require('path'); // <--- NEW: Import the path module

const orders = require('./routes/orderRoutes')
const dummyPayment = require('./routes/paymentDummy');
const wishlist = require('./routes/wishlistRoutes');
const reviews = require('./routes/reviews')
const coupon = require('./routes/CouponRoutes')
const support = require('./routes/supportRoutes'); // Import support ticket routes
const menu = require('./routes/menuRoutes'); // Import menu routes
const searchRoutes = require('./routes/searchRoutes'); // Import search routes
const deliveryRoutes = require('./routes/deliveryRoutes'); // Import delivery routes
const addressRoutes = require('./routes/addressRoutes'); // Import address routes
const returnRoutes = require('./routes/returnRoutes'); // Import return routes
const OrderService = require('./services/OrderService');
const cron = require('node-cron');

// Initialize services and setup
const initializeServices = async () => {
    try {
        // Connect to database
        await connectDB();

        // Initialize OrderService
        const orderService = new OrderService();

        // Schedule cleanup job for abandoned orders - runs every 15 minutes
        cron.schedule('*/15 * * * *', async () => {
            try {
                console.log('[Cleanup Job] Starting cleanup of abandoned orders...');
                const cleanedCount = await orderService.cleanupPendingOrders(30); // Clean orders older than 30 minutes
                console.log(`[Cleanup Job] Successfully cleaned up ${cleanedCount} abandoned orders`);
            } catch (error) {
                console.error('[Cleanup Job] Error cleaning up abandoned orders:', error);
            }
        });

        console.log('Services initialized successfully');
    } catch (error) {
        console.error('Error initializing services:', error);
        process.exit(1);
    }
};

const app = express();

// Initialize services before starting the server
initializeServices().catch(error => {
    console.error('Failed to initialize services:', error);
    process.exit(1);
});

// Middleware setup
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// IMPORTANT: Add cookie-parser middleware BEFORE your routes.
// This middleware parse    s the cookies from the incoming request and populates req.cookies.
app.use(cookieParser());

// Serve static files from the 'uploads' directory
// When a request comes for /uploads, it will look in the actual 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <--- NEW: Serve static uploaded files

// Route definitions
app.use("/api/auth", authRoutes); // For user authentication (login, register, etc.)
app.use("/api/products", productRoutes); // For product-related API calls
app.use("/api/categories", categoryRoutes); // For category-related API calls
app.use("/api/brands", brandRoutes); // For brand-related API calls
app.use("/api/admin", isAdmin); // Your specific admin check route
app.use("/api/upload", uploadRoutes); // <--- NEW: For image upload API calls
 
app.use("/api/orders", orders); 
app.use('/api/payment', dummyPayment);
app.use('/api/wishlist', wishlist); // NEW: Wishlist routes
app.use('/api/reviews', reviews); 
app.use('/api/coupons', coupon); 
app.use('/api/tickets', support); // NEW: Support ticket routes
app.use('/api/menus', menu); // NEW: Menu routes
app.use('/api/search', searchRoutes); // NEW: Search routes
app.use('/api/delivery', deliveryRoutes); // NEW: Delivery routes
app.use('/api/user/addresses', addressRoutes); // NEW: Address routes
app.use('/api/returns', returnRoutes); // NEW: Return routes




// Basic route for testing API status
app.get("/", (req, res) => {
    res.send("Delicorn E-commerce API is running...");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "API is healthy" });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 Delicorn E-commerce API Server`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`\n📝 Available endpoints:`);
    console.log(`   - Products: http://localhost:${PORT}/api/products`);
    console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   - Admin: http://localhost:${PORT}/admin`);
    console.log(`\n✅ Ready for connections!\n`);
});