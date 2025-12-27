const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Product = require('../models/Product');
const Category = require('../models/Category');

async function migrateProductCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);

    for (const product of products) {
      let updated = false;

      // If product has category string but no categories array
      if (product.category && (!product.categories || product.categories.length === 0)) {
        const category = await Category.findOne({ name: product.category });
        if (category) {
          product.categories = [category._id];
          updated = true;
          console.log(`Migrated product "${product.name}" - added category "${category.name}"`);
        }
      }

      // If product has categories array but no category string
      if (product.categories && product.categories.length > 0 && !product.category) {
        const category = await Category.findById(product.categories[0]);
        if (category) {
          product.category = category.name;
          updated = true;
          console.log(`Migrated product "${product.name}" - set category string to "${category.name}"`);
        }
      }

      if (updated) {
        await product.save();
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateProductCategories();
