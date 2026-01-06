require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

async function checkStock() {
  await connectDB();
  
  const products = await Product.find().limit(5);
  
  console.log('\n=== PRODUCT STOCK CHECK ===\n');
  
  products.forEach(p => {
    console.log(`Product: ${p.name}`);
    console.log(`  SKU: ${p.sku}`);
    console.log(`  Total Stock: ${p.totalStock}`);
    console.log(`  In Stock: ${p.inStock}`);
    console.log(`  Variants: ${p.variants?.length || 0}`);
    
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v, i) => {
        const attrs = v.attributes instanceof Map ? 
          Object.fromEntries(v.attributes) : v.attributes;
        console.log(`    Variant ${i + 1}:`, JSON.stringify(attrs), `Stock: ${v.stock}`);
      });
    }
    console.log('---\n');
  });
  
  process.exit(0);
}

checkStock().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
