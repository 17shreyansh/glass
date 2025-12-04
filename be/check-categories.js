require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected\n');

    const totalCategories = await Category.countDocuments();
    console.log(`📁 Total Categories: ${totalCategories}`);

    if (totalCategories > 0) {
      const categories = await Category.find().populate('parent');
      console.log('\n📋 Categories List:\n');
      categories.forEach((cat, i) => {
        const indent = '  '.repeat(cat.level || 0);
        const parent = cat.parent ? ` (Parent: ${cat.parent.name})` : ' (Top Level)';
        console.log(`${indent}${i + 1}. ${cat.name}${parent}`);
        console.log(`${indent}   Slug: ${cat.slug}`);
        console.log(`${indent}   Type: ${cat.productType}`);
      });
    } else {
      console.log('\n⚠️  No categories found!');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCategories();
