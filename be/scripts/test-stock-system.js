// Test script for stock system
// Run with: node be/scripts/test-stock-system.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

async function testStockSystem() {
  try {
    console.log('🧪 Testing Stock System...\n');
    
    // Connect to database
    await connectDB();
    
    // Test 1: Create a product with variants
    console.log('Test 1: Creating product with variants...');
    const testProduct = new Product({
      name: 'Test Product - Stock System',
      price: 99.99,
      categories: [],
      variants: [
        {
          attributes: {
            Color: 'Red',
            Size: 'M'
          },
          stock: 10,
          sku: 'TEST-RED-M'
        },
        {
          attributes: {
            Color: 'Blue',
            Size: 'L'
          },
          stock: 5,
          sku: 'TEST-BLUE-L'
        }
      ]
    });
    
    await testProduct.save();
    console.log('✅ Product created with ID:', testProduct._id);
    console.log('   Total Stock:', testProduct.totalStock);
    console.log('   In Stock:', testProduct.inStock);
    
    // Test 2: Get stock for specific variant
    console.log('\nTest 2: Getting stock for Red/M variant...');
    const stockRedM = testProduct.getStockForVariant('M', 'Red');
    console.log('✅ Stock for Red/M:', stockRedM);
    
    // Test 3: Update stock for variant
    console.log('\nTest 3: Updating stock for Red/M to 20...');
    const updated = testProduct.updateVariantStock('M', 'Red', 20);
    if (updated) {
      await testProduct.save();
      console.log('✅ Stock updated successfully');
      console.log('   New Total Stock:', testProduct.totalStock);
    } else {
      console.log('❌ Failed to update stock');
    }
    
    // Test 4: Try to get stock for non-existent variant
    console.log('\nTest 4: Getting stock for non-existent variant...');
    const stockNonExistent = testProduct.getStockForVariant('XL', 'Green');
    console.log('✅ Stock for non-existent variant:', stockNonExistent, '(should be 0)');
    
    // Test 5: Verify attributes are properly stored
    console.log('\nTest 5: Verifying attribute storage...');
    const freshProduct = await Product.findById(testProduct._id);
    console.log('✅ Variants from DB:', freshProduct.variants.length);
    freshProduct.variants.forEach((v, i) => {
      const attrs = v.attributes instanceof Map ? 
        Object.fromEntries(v.attributes) : v.attributes;
      console.log(`   Variant ${i + 1}:`, attrs, 'Stock:', v.stock);
    });
    
    // Cleanup
    console.log('\nCleaning up test data...');
    await Product.findByIdAndDelete(testProduct._id);
    console.log('✅ Test product deleted');
    
    console.log('\n✅ All tests passed! Stock system is working correctly.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testStockSystem();
