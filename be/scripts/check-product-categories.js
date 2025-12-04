const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const products = await Product.find({});
    products.forEach(p => {
      console.log(`${p.name}:`);
      console.log(`  category (string): "${p.category}"`);
      console.log(`  categories (array): ${p.categories}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

check();
