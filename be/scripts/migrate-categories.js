const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all categories to have a generic productType
    const result = await Category.updateMany(
      { productType: { $in: ['ashta-dhatu', 'fashion-jewelry'] } },
      { $set: { productType: 'jewelry' } }
    );

    console.log(`Updated ${result.modifiedCount} categories`);
    
    // List all categories to verify
    const categories = await Category.find({}, 'name productType');
    console.log('Current categories:');
    categories.forEach(category => {
      console.log(`- ${category.name}: ${category.productType}`);
    });

    await mongoose.disconnect();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateCategories();