const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require('mongoose');
const { uploadService } = require('./uploadController');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all products with filtering, sorting, and search
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      sortBy, 
      search,
      inStock,
      featured,
      limit,
      skip,
      admin 
    } = req.query;
    
    let query = {};
    
    // Only filter by isActive if not an admin request
    if (admin !== 'true') {
      query.isActive = true;
    }

    // Category filter - support both slug and ObjectId
    if (category) {
      console.log('Category filter requested:', category);
      const categoryDoc = await Category.findOne({ slug: category });
      console.log('Found category:', categoryDoc);
      if (categoryDoc) {
        query.categories = categoryDoc._id;
        console.log('Query:', JSON.stringify(query));
      } else {
        console.log('Category not found for slug:', category);
      }
    }
    if (featured === 'true') query.isFeatured = true;

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock === 'true') {
      query.totalStock = { $gt: 0 };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }

    let productsQuery = Product.find(query).populate('categories', 'name slug');

    // Sorting
    if (sortBy === "priceAsc") productsQuery = productsQuery.sort({ price: 1 });
    else if (sortBy === "priceDesc") productsQuery = productsQuery.sort({ price: -1 });
    else if (sortBy === "nameAsc") productsQuery = productsQuery.sort({ name: 1 });
    else if (sortBy === "rating") productsQuery = productsQuery.sort({ rating: -1 });
    else if (sortBy === "featured") productsQuery = productsQuery.sort({ isFeatured: -1, createdAt: -1 });
    else productsQuery = productsQuery.sort({ createdAt: -1 });

    // Pagination
    if (skip) productsQuery = productsQuery.skip(parseInt(skip));
    if (limit) productsQuery = productsQuery.limit(parseInt(limit));

    const products = await productsQuery.exec();
    console.log(`Found ${products.length} products`);
    res.json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// @desc    Get single product by slug or ID (with redirect)
// @route   GET /api/products/:identifier
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { identifier } = req.params;
    let product;

    // First try to find by slug
    product = await Product.findOne({ slug: identifier, isActive: true }).populate('categories', 'name slug');
    
    // If not found and identifier looks like an ObjectId, try finding by ID
    if (!product && mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findOne({ _id: identifier, isActive: true }).populate('categories', 'name slug');
      if (product) {
        // Redirect to slug-based URL
        return res.redirect(301, `/api/products/${product.slug}`);
      }
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ success: true, data: product });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};



// @desc    Get related products
// @route   GET /api/products/:identifier/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { limit = 4 } = req.query;
    
    let product;
    // Try to find by slug first, then by ID
    product = await Product.findOne({ slug: identifier, isActive: true }).populate('categories', 'name slug');
    if (!product && mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findOne({ _id: identifier, isActive: true }).populate('categories', 'name slug');
    }
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      categories: { $in: product.categories },
      isActive: true
    })
    .populate('categories', 'name slug')
    .limit(parseInt(limit))
    .sort({ rating: -1, createdAt: -1 });

    res.json({ success: true, data: relatedProducts });
  } catch (err) {
    console.error("Error fetching related products:", err);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    // Get existing product to check for old images
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if SKU is being changed and if it's already in use by another product
    if (req.body.sku && req.body.sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ sku: req.body.sku, _id: { $ne: req.params.id } });
      if (skuExists) {
        return res.status(400).json({ error: "SKU already exists for another product" });
      }
    }

    // Delete old main image if new one is provided
    if (req.body.mainImage && existingProduct.mainImage && req.body.mainImage !== existingProduct.mainImage) {
      await uploadService.deleteFileByUrl(existingProduct.mainImage);
    }

    // Delete old gallery images if new ones are provided
    if (req.body.galleryImages && existingProduct.galleryImages) {
      const newGalleryUrls = req.body.galleryImages || [];
      const oldGalleryUrls = existingProduct.galleryImages || [];
      
      for (const oldUrl of oldGalleryUrls) {
        if (!newGalleryUrls.includes(oldUrl)) {
          await uploadService.deleteFileByUrl(oldUrl);
        }
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.json({ success: true, data: product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete product images
    if (product.mainImage) {
      await uploadService.deleteFileByUrl(product.mainImage);
    }
    if (product.galleryImages && product.galleryImages.length > 0) {
      for (const imageUrl of product.galleryImages) {
        await uploadService.deleteFileByUrl(imageUrl);
      }
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// @desc    Update size variant stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res) => {
  try {
    const { size, stock } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variantIndex = req.body.variantIndex;
    if (variantIndex !== undefined && product.variants[variantIndex]) {
      product.variants[variantIndex].stock = stock;
    }

    await product.save();
    res.json({ message: "Stock updated successfully", totalStock: product.totalStock });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(400).json({ error: err.message });
  }
};