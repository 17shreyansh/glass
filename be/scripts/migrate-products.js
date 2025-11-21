const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const migrateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all products to have a generic productType
    const result = await Product.updateMany(
      { productType: { $in: ['ashta-dhatu', 'fashion-jewelry'] } },
      { $set: { productType: 'jewelry' } }
    );

    console.log(`Updated ${result.modifiedCount} products`);
    
    // List all products to verify
    const products = await Product.find({}, 'name productType');
    console.log('Current products:');
    products.forEach(product => {
      console.log(`- ${product.name}: ${product.productType}`);
    });

    await mongoose.disconnect();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateProducts();