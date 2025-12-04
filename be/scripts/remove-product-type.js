const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const removeProductType = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Remove productType field from all products
    const productResult = await Product.updateMany(
      {},
      { $unset: { productType: "" } }
    );
    console.log(`Updated ${productResult.modifiedCount} products - removed productType field`);

    // Remove productType field from all categories
    const categoryResult = await Category.updateMany(
      {},
      { $unset: { productType: "" } }
    );
    console.log(`Updated ${categoryResult.modifiedCount} categories - removed productType field`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

removeProductType();
