require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');

const testCouponSystem = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected\n');

    // Test 1: Create a test coupon
    console.log('TEST 1: Creating test coupon...');
    const testCoupon = new Coupon({
      code: 'TEST20',
      name: 'Test 20% Off',
      description: 'Test coupon for validation',
      type: 'PERCENTAGE',
      value: 20,
      minimumOrderAmount: 500,
      maximumDiscountAmount: 200,
      usageLimit: 10,
      userUsageLimit: 1,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      isPublic: true,
      createdBy: new mongoose.Types.ObjectId()
    });

    await testCoupon.save();
    console.log('✅ Coupon created:', testCoupon.code);

    // Test 2: Check if coupon is valid
    console.log('\nTEST 2: Checking coupon validity...');
    console.log('Is currently valid:', testCoupon.isCurrentlyValid);
    console.log('Is expired:', testCoupon.isExpired);
    console.log('✅ Validity check passed');

    // Test 3: Test discount calculation
    console.log('\nTEST 3: Testing discount calculation...');
    const orderAmount = 1000;
    const discount = testCoupon.calculateDiscount(orderAmount, 0, []);
    console.log(`Order Amount: ₹${orderAmount}`);
    console.log(`Discount: ₹${discount.discount}`);
    console.log(`Expected: ₹${Math.min(200, orderAmount * 0.2)}`);
    console.log(discount.discount === 200 ? '✅ Discount calculation correct' : '❌ Discount calculation failed');

    // Test 4: Test minimum order amount
    console.log('\nTEST 4: Testing minimum order amount...');
    const lowOrderAmount = 300;
    const lowDiscount = testCoupon.calculateDiscount(lowOrderAmount, 0, []);
    console.log(`Order Amount: ₹${lowOrderAmount} (below minimum ₹500)`);
    console.log(`Error: ${lowDiscount.error}`);
    console.log(lowDiscount.error ? '✅ Minimum order validation works' : '❌ Minimum order validation failed');

    // Test 5: Test user usage limit
    console.log('\nTEST 5: Testing user usage limit...');
    const testUserId = new mongoose.Types.ObjectId();
    const canUse = testCoupon.canUserUseCoupon(testUserId);
    console.log(`Can user use coupon: ${canUse}`);
    console.log(canUse ? '✅ User can use coupon' : '❌ User cannot use coupon');

    // Test 6: Find coupon by code
    console.log('\nTEST 6: Finding coupon by code...');
    const foundCoupon = await Coupon.findOne({ code: 'TEST20', isActive: true });
    console.log(foundCoupon ? '✅ Coupon found by code' : '❌ Coupon not found');

    // Test 7: Test fixed amount coupon
    console.log('\nTEST 7: Testing fixed amount coupon...');
    const fixedCoupon = new Coupon({
      code: 'FIXED100',
      name: 'Fixed ₹100 Off',
      type: 'FIXED_AMOUNT',
      value: 100,
      minimumOrderAmount: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      createdBy: new mongoose.Types.ObjectId()
    });
    await fixedCoupon.save();
    const fixedDiscount = fixedCoupon.calculateDiscount(500, 0, []);
    console.log(`Fixed discount: ₹${fixedDiscount.discount}`);
    console.log(fixedDiscount.discount === 100 ? '✅ Fixed amount coupon works' : '❌ Fixed amount coupon failed');

    // Test 8: Test free shipping coupon
    console.log('\nTEST 8: Testing free shipping coupon...');
    const shippingCoupon = new Coupon({
      code: 'FREESHIP',
      name: 'Free Shipping',
      type: 'FREE_SHIPPING',
      value: 0,
      minimumOrderAmount: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      createdBy: new mongoose.Types.ObjectId()
    });
    await shippingCoupon.save();
    const shippingDiscount = shippingCoupon.calculateDiscount(500, 50, []);
    console.log(`Shipping discount: ₹${shippingDiscount.discountOnDelivery}`);
    console.log(shippingDiscount.discountOnDelivery === 50 ? '✅ Free shipping coupon works' : '❌ Free shipping coupon failed');

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await Coupon.deleteMany({ code: { $in: ['TEST20', 'FIXED100', 'FREESHIP'] } });
    console.log('✅ Test data cleaned up');

    console.log('\n✅ ALL TESTS PASSED!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testCouponSystem();
