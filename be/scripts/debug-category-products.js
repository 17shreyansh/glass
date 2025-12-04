const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected\n');

    const categories = await Category.find({});
    console.log('=== CATEGORIES ===');
    categories.forEach(cat => {
      console.log(`${cat.name} (${cat.slug}) - ID: ${cat._id}`);
    });

    console.log('\n=== PRODUCTS ===');
    const products = await Product.find({}).limit(3);
    products.forEach(prod => {
      console.log(`\nProduct: ${prod.name}`);
      console.log(`  category (string): ${prod.category}`);
      console.log(`  categories (array): ${prod.categories}`);
      console.log(`  categories length: ${prod.categories?.length || 0}`);
    });

    // Test query
    console.log('\n=== TEST QUERY ===');
    const ringsCategory = await Category.findOne({ slug: 'rings' });
    if (ringsCategory) {
      console.log(`Looking for products with category ID: ${ringsCategory._id}`);
      const productsInRings = await Product.find({ categories: ringsCategory._id });
      console.log(`Found ${productsInRings.length} products in Rings category`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

debug();
