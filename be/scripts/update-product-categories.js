const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const updateProductCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    const products = await Product.find({});
    
    for (const product of products) {
      if (product.category && typeof product.category === 'string') {
        const categoryId = categoryMap[product.category.toLowerCase()];
        if (categoryId) {
          product.categories = [categoryId];
          await product.save();
          console.log(`Updated ${product.name} with category ${product.category}`);
        }
      }
    }

    console.log(`All ${products.length} products updated!`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

updateProductCategories();
