const Category = require("../models/Category");
const Product = require("../models/Product"); // Import Product model to handle cascade delete
const { uploadService } = require('./uploadController');

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error (for unique name/slug)
      return res.status(400).json({ error: "Category name or slug already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

// Modified to fetch categories with parent populated and potentially structured
exports.getCategories = async (req, res) => {
  try {
    const { productType } = req.query;
    let query = {};
    
    if (productType) {
      query.productType = productType;
    }
    
    const categories = await Category.find(query).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    // Get existing category to check for old image
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Ensure slug is updated if name changes or if explicitly provided
    if (req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, "");
    }

    // Delete old image if new image is provided
    if (req.body.image && existingCategory.image && req.body.image !== existingCategory.image) {
      await uploadService.deleteFileByUrl(existingCategory.image);
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Category name or slug already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

// Modified for more robust deletion, including product re-assignment or cascade
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 1. Check if the category has children
    const hasChildren = await Category.exists({ parent: categoryId });
    if (hasChildren) {
      return res.status(400).json({ message: "Cannot delete category with subcategories. Please reassign or delete subcategories first." });
    }

    // 2. Decide how to handle products in this category:
    // Option A: Reassign products to a default category or null
    await Product.updateMany({ category: categoryId }, { $unset: { category: 1 } }); // Removes category from products

    // Option B: Delete products associated with this category (use with caution!)
    // await Product.deleteMany({ category: categoryId });

    const result = await Category.findByIdAndDelete(categoryId);
    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete category image if exists
    if (result.image) {
      await uploadService.deleteFileByUrl(result.image);
    }

    res.json({ message: "Category and associated products updated/deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};