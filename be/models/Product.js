const mongoose = require("mongoose");
const slugify = require("slugify");

// Size variant schema
const sizeVariantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  price: { type: Number }, // Optional different price for size
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  
  productType: {
    type: String,
    default: "jewelry"
  },
  
  // Size variants for different sizes and their stock
  sizeVariants: [sizeVariantSchema],
  totalStock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  
  // Colors and materials
  availableColors: [{ type: String }],
  material: { type: String },
  metalDetails: [{ type: String }],
  benefits: [{ type: String }],
  
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
  
  // Calculate total stock from size variants
  this.totalStock = this.sizeVariants.reduce((total, variant) => total + variant.stock, 0);
  this.inStock = this.totalStock > 0;
  this.reviews = this.reviewsCount;
  this.image = this.mainImage; // Sync for frontend compatibility
  next();
});



productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Product", productSchema);