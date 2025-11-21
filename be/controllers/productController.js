const Product = require("../models/Product");
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
      productType,
      brand, 
      material, 
      color, 
      size,
      gender, 
      minPrice, 
      maxPrice, 
      sortBy, 
      search,
      inStock,
      featured 
    } = req.query;
    
    let query = { isActive: true };

    // Product type filter (ashta-dhatu or fashion-jewelry)
    if (productType) query.productType = productType;
    if (category) query.productType = category; // Frontend compatibility
    
    if (brand) query.brand = brand;
    if (gender) query.gender = gender;
    if (featured === 'true') query.isFeatured = true;
    
    // Handle multiple selections using $in operator
    if (material) {
      const materialsArray = material.split(',').map(m => new RegExp(m.trim(), 'i'));
      query.material = { $in: materialsArray };
    }
    
    if (color) {
      const colorsArray = color.split(',').map(c => c.trim());
      query.availableColors = { $in: colorsArray };
    }
    
    if (size) {
      const sizesArray = size.split(',').map(s => parseFloat(s.trim()));
      query.availableSizes = { $in: sizesArray };
    }

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

    // Enhanced search functionality
    if (search) {
      const searchTerms = search.split(' ').filter(term => term.length > 0);
      
      if (searchTerms.length > 0) {
        const searchConditions = searchTerms.map(term => ({
          $or: [
            { name: new RegExp(term, 'i') },
            { description: new RegExp(term, 'i') },
            { material: new RegExp(term, 'i') },
            { productType: new RegExp(term, 'i') },
            { gender: new RegExp(term, 'i') },

          ]
        }));
        
        query.$and = searchConditions;
      }
    }

    let productsQuery = Product.find(query);

    // Sorting
    if (sortBy === "priceAsc") productsQuery = productsQuery.sort({ price: 1 });
    else if (sortBy === "priceDesc") productsQuery = productsQuery.sort({ price: -1 });
    else if (sortBy === "nameAsc") productsQuery = productsQuery.sort({ name: 1 });
    else if (sortBy === "rating") productsQuery = productsQuery.sort({ rating: -1 });
    else if (sortBy === "featured") productsQuery = productsQuery.sort({ isFeatured: -1, createdAt: -1 });
    else productsQuery = productsQuery.sort({ createdAt: -1 });

    const products = await productsQuery.exec();
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
    product = await Product.findOne({ slug: identifier, isActive: true });
    
    // If not found and identifier looks like an ObjectId, try finding by ID
    if (!product && mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findOne({ _id: identifier, isActive: true });
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

// @desc    Get products by type (ashta-dhatu or fashion-jewelry)
// @route   GET /api/products/type/:type
// @access  Public
exports.getProductsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 20, sortBy = 'createdAt' } = req.query;
    
    // Allow any product type

    let query = Product.find({ productType: type, isActive: true })
      .limit(parseInt(limit));

    if (sortBy === 'featured') query = query.sort({ isFeatured: -1, createdAt: -1 });
    else if (sortBy === 'price') query = query.sort({ price: 1 });
    else if (sortBy === 'rating') query = query.sort({ rating: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query.exec();
    res.json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching products by type:", err);
    res.status(500).json({ error: "Failed to fetch products" });
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
    product = await Product.findOne({ slug: identifier, isActive: true });
    if (!product && mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findOne({ _id: identifier, isActive: true });
    }
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      productType: product.productType,
      isActive: true
    })
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

    const variant = product.sizeVariants.find(v => v.size === size);
    if (variant) {
      variant.stock = stock;
    } else {
      product.sizeVariants.push({ size, stock });
    }

    await product.save();
    res.json({ message: "Stock updated successfully", totalStock: product.totalStock });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(400).json({ error: err.message });
  }
};