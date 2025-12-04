const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const setsCategory = await Category.findOne({ slug: 'sets' });
    
    const glassProducts = await Product.find({
      category: { $in: ['Glassware', 'Decorative', 'Serveware'] }
    });
    
    for (const product of glassProducts) {
      product.category = 'Sets';
      product.categories = [setsCategory._id];
      await product.save();
      console.log(`Updated ${product.name} to Sets category`);
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

fix();
