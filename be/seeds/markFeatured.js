const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const markProductsAsFeatured = async () => {
  try {
    await connectDB();

    // Get all products
    const products = await Product.find({ isActive: true });
    
    if (products.length === 0) {
      console.log('No products found in database. Please run productSeed.js first.');
      return;
    }

    console.log(`Found ${products.length} products`);

    // Mark first 8 products as featured
    const productsToFeature = products.slice(0, 8);
    
    for (const product of productsToFeature) {
      product.isFeatured = true;
      await product.save();
      console.log(`✓ Marked "${product.name}" as featured`);
    }

    console.log(`\nSuccessfully marked ${productsToFeature.length} products as featured!`);

  } catch (error) {
    console.error('Error marking products as featured:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the script
if (require.main === module) {
  markProductsAsFeatured();
}

module.exports = markProductsAsFeatured;
