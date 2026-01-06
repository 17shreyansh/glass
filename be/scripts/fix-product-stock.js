require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

async function fixProductStock() {
  try {
    await connectDB();
    
    console.log('🔧 Fixing product stock...\n');
    
    const products = await Product.find();
    let fixed = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      
      // If product has no variants, set to out of stock
      if (!product.variants || product.variants.length === 0) {
        product.variants = [];
        product.totalStock = 0;
        product.inStock = false;
        needsUpdate = true;
        console.log(`⚠️  ${product.name} - No variants, set to OUT OF STOCK (add variants in admin)`);
      } else {
        // Recalculate from variants
        const oldStock = product.totalStock;
        product.totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        product.inStock = product.totalStock > 0;
        
        if (oldStock !== product.totalStock || product.inStock !== (product.totalStock > 0)) {
          needsUpdate = true;
          console.log(`✅ ${product.name} - Stock: ${product.totalStock}, In Stock: ${product.inStock}`);
        }
      }
      
      if (needsUpdate) {
        await product.save();
        fixed++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} products!`);
    console.log(`📊 Total products: ${products.length}`);
    console.log(`\n⚠️  Products without variants are OUT OF STOCK`);
    console.log(`   → Go to Admin Panel and add variants with stock\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProductStock();
