const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const categories = await Category.find({});
    console.log(`Total categories: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

checkCategories();
