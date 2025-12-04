const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const categorySlug = 'rings';
    const categoryDoc = await Category.findOne({ slug: categorySlug });
    console.log('Category:', categoryDoc);
    
    if (categoryDoc) {
      const query = { isActive: true, categories: categoryDoc._id };
      console.log('Query:', JSON.stringify(query));
      
      const products = await Product.find(query);
      console.log(`Found ${products.length} products`);
      products.forEach(p => console.log(`- ${p.name}`));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

test();
