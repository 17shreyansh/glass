// Quick database diagnostic script
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkDatabase() {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected\n');

    // Check total products
    const totalProducts = await Product.countDocuments();
    console.log(`📦 Total Products: ${totalProducts}`);

    // Check featured products
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    console.log(`⭐ Featured Products: ${featuredProducts}`);

    // Check active products
    const activeProducts = await Product.countDocuments({ isActive: true });
    console.log(`✅ Active Products: ${activeProducts}`);

    // Check products in stock
    const inStockProducts = await Product.countDocuments({ inStock: true });
    console.log(`📊 In Stock Products: ${inStockProducts}\n`);

    // Show featured products details
    if (featuredProducts > 0) {
      console.log('⭐ Featured Products List:');
      const featured = await Product.find({ isFeatured: true })
        .select('name price productType isFeatured')
        .limit(10);
      featured.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - $${p.price} (${p.productType})`);
      });
    } else {
      console.log('⚠️  WARNING: No featured products found!');
      console.log('   The "Featured Collection" section will be empty.');
      console.log('   Please mark some products as featured in the admin panel.\n');
    }

    // Show product types breakdown
    console.log('\n📊 Products by Type:');
    const productTypes = await Product.aggregate([
      { $group: { _id: '$productType', count: { $sum: 1 } } }
    ]);
    productTypes.forEach(type => {
      console.log(`   - ${type._id || 'undefined'}: ${type.count}`);
    });

    // Check if any products exist
    if (totalProducts === 0) {
      console.log('\n❌ ERROR: No products in database!');
      console.log('   Please add products via admin panel or seed data.');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database check complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
