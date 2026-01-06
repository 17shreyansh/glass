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
  image: { type: String, default: "placeholder.jpg" },
  mainImage: { type: String, default: "placeholder.jpg" },
  galleryImages: [{ type: String }],
  
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0, min: 0 },
  reviews: { type: Number, default: 0, min: 0 },
  
  // Categories - can be multiple
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  category: { type: String, trim: true },
  
  sku: { type: String, unique: true },
  
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Methods for stock management
productSchema.methods.getStockForVariant = function(size, color) {
  if (!this.variants || this.variants.length === 0) {
    return this.totalStock || 0;
  }
  
  const variant = this.variants.find(v => {
    const attrs = v.attributes instanceof Map ? v.attributes : new Map(Object.entries(v.attributes || {}));
    const vSize = attrs.get('Size') || attrs.get('size');
    const vColor = attrs.get('Color') || attrs.get('color');
    return vSize?.toString() === size?.toString() && 
           vColor?.toLowerCase() === color?.toLowerCase();
  });
  
  return variant ? variant.stock : 0;
};

productSchema.methods.updateVariantStock = function(size, color, newStock) {
  if (!this.variants || this.variants.length === 0) {
    return false;
  }
  
  const variantIndex = this.variants.findIndex(v => {
    const attrs = v.attributes instanceof Map ? v.attributes : new Map(Object.entries(v.attributes || {}));
    const vSize = attrs.get('Size') || attrs.get('size');
    const vColor = attrs.get('Color') || attrs.get('color');
    return vSize?.toString() === size?.toString() && 
           vColor?.toLowerCase() === color?.toLowerCase();
  });
  
  if (variantIndex !== -1) {
    this.variants[variantIndex].stock = Math.max(0, newStock);
    return true;
  }
  
  return false;
};

// Pre-save hook to generate slug, SKU and calculate stock
productSchema.pre("save", async function(next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (!this.sku) {
    this.sku = `JW${Date.now().toString().slice(-6)}`;
  }
  
  // Convert plain objects to Maps for attributes
  if (this.variants && this.variants.length > 0) {
    this.variants = this.variants.map(v => {
      if (v.attributes && !(v.attributes instanceof Map)) {
        v.attributes = new Map(Object.entries(v.attributes));
      }
      return v;
    });
    
    // Calculate total stock from variants
    this.totalStock = this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
    this.inStock = this.totalStock > 0;
  }
  // If no variants, keep existing totalStock and inStock values
  
  this.reviews = this.reviewsCount;
  this.image = this.mainImage;
  
  // Set category string from first category for backward compatibility
  if (this.categories && this.categories.length > 0 && this.isModified('categories')) {
    const Category = require('./Category');
    const firstCat = await Category.findById(this.categories[0]);
    if (firstCat) {
      this.category = firstCat.name;
    }
  }
  
  next();
});

productSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Convert Map to plain object for variants attributes
    if (ret.variants && Array.isArray(ret.variants)) {
      ret.variants = ret.variants.map(v => {
        if (v.attributes instanceof Map) {
          return {
            ...v,
            attributes: Object.fromEntries(v.attributes)
          };
        }
        return v;
      });
    }
    return ret;
  }
});
productSchema.set('toObject', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Convert Map to plain object for variants attributes
    if (ret.variants && Array.isArray(ret.variants)) {
      ret.variants = ret.variants.map(v => {
        if (v.attributes instanceof Map) {
          return {
            ...v,
            attributes: Object.fromEntries(v.attributes)
          };
        }
        return v;
      });
    }
    return ret;
  }
});

module.exports = mongoose.model("Product", productSchema);