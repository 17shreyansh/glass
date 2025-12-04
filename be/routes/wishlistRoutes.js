const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product'); // Assuming your Product model is here
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products.product', 'name price mainImage slug');

    if (!wishlist) {
      return res.status(200).json({ success: true, data: [] });
    }

    const products = wishlist.products.map(item => item.product).filter(p => p);
    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/', protect, async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (wishlist) {
      const isProductInWishlist = wishlist.products.some(
        (item) => item.product.toString() === productId
      );

      if (isProductInWishlist) {
        return res.status(400).json({ success: false, message: 'Product already in wishlist' });
      }

      wishlist.products.push({ product: productId });
      await wishlist.save();
    } else {
      wishlist = new Wishlist({
        user: req.user.id,
        products: [{ product: productId }]
      });
      await wishlist.save();
    }
    
    res.json({ success: true, message: 'Added to wishlist', data: product });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await wishlist.save();
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;