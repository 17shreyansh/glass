const mongoose = require("mongoose");
const slugify = require("slugify");

// Variant schema for customizable attributes
const variantSchema = new mongoose.Schema({
  attributes: { type: Map, of: String },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  

  
  // Variants with customizable attributes
  variants: [variantSchema],
  totalStock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  
  // Images
  image: { type: String, default: "placeholder.jpg" }, // Main image for frontend compatibility
  mainImage: { type: String, default: "placeholder.jpg" }, // Same as image
  galleryImages: [{ type: String }],
  
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0, min: 0 },
  reviews: { type: Number, default: 0, min: 0 },
  
  // Categories - can be multiple
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  category: { type: String, trim: true }, // Simple category string for backward compatibility
  
  sku: { type: String, unique: true },
  
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Pre-save hook to generate slug, SKU and calculate stock
productSchema.pre("save", function(next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (!this.sku) {
    this.sku = `JW${Date.now().toString().slice(-6)}`;
  }
  
  // Calculate total stock from variants
  this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
  this.inStock = this.totalStock > 0;
  this.reviews = this.reviewsCount;
  this.image = this.mainImage; // Sync for frontend compatibility
  next();
});



productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Product", productSchema);