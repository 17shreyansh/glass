const mongoose = require('mongoose');
const Product = require('../models/Product');
const slugify = require('slugify');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const addMoreProducts = async () => {
  try {
    await connectDB();

    const additionalProducts = [
      {
        name: "Crystal Glass Tumbler Set",
        slug: slugify("Crystal Glass Tumbler Set", { lower: true, strict: true }),
        sku: "JW007",
        description: "Premium crystal glass tumbler set of 6. Perfect for serving water, juice, or cocktails.",
        price: 1500,
        originalPrice: 2000,
        variants: [
          { attributes: { Capacity: "300ml" }, stock: 20 }
        ],
        image: "/uploads/products/crystal-tumbler-1.jpg",
        mainImage: "/uploads/products/crystal-tumbler-1.jpg",
        category: "Glassware",
        rating: 4.7,
        reviewsCount: 45,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Handcrafted Wine Glasses",
        slug: slugify("Handcrafted Wine Glasses", { lower: true, strict: true }),
        sku: "JW008",
        description: "Elegant handcrafted wine glasses with delicate stem. Set of 4.",
        price: 2200,
        variants: [
          { attributes: { Capacity: "350ml" }, stock: 15 }
        ],
        image: "/uploads/products/wine-glass-1.jpg",
        mainImage: "/uploads/products/wine-glass-1.jpg",
        category: "Glassware",
        rating: 4.8,
        reviewsCount: 32,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Decorative Glass Bowl",
        slug: slugify("Decorative Glass Bowl", { lower: true, strict: true }),
        sku: "JW009",
        description: "Beautiful decorative glass bowl with intricate patterns. Perfect for centerpiece.",
        price: 3500,
        originalPrice: 4500,
        variants: [
          { attributes: { Size: "Large" }, stock: 8 }
        ],
        image: "/uploads/products/glass-bowl-1.jpg",
        mainImage: "/uploads/products/glass-bowl-1.jpg",
        category: "Decorative",
        rating: 4.6,
        reviewsCount: 28,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Glass Serving Platter",
        slug: slugify("Glass Serving Platter", { lower: true, strict: true }),
        sku: "JW010",
        description: "Large glass serving platter for parties and gatherings.",
        price: 2800,
        variants: [
          { attributes: { Size: "16 inch" }, stock: 12 }
        ],
        image: "/uploads/products/serving-platter-1.jpg",
        mainImage: "/uploads/products/serving-platter-1.jpg",
        category: "Serveware",
        rating: 4.5,
        reviewsCount: 19,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Colored Glass Vase",
        slug: slugify("Colored Glass Vase", { lower: true, strict: true }),
        sku: "JW011",
        description: "Stunning colored glass vase for flowers. Available in multiple colors.",
        price: 1800,
        variants: [
          { attributes: { Color: "Blue" }, stock: 10 },
          { attributes: { Color: "Green" }, stock: 8 },
          { attributes: { Color: "Amber" }, stock: 12 }
        ],
        image: "/uploads/products/glass-vase-1.jpg",
        mainImage: "/uploads/products/glass-vase-1.jpg",
        category: "Decorative",
        rating: 4.7,
        reviewsCount: 41,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Glass Tea Set",
        slug: slugify("Glass Tea Set", { lower: true, strict: true }),
        sku: "JW012",
        description: "Complete glass tea set with teapot and 6 cups. Heat resistant.",
        price: 3200,
        originalPrice: 4000,
        variants: [
          { attributes: { Capacity: "800ml" }, stock: 15 }
        ],
        image: "/uploads/products/tea-set-1.jpg",
        mainImage: "/uploads/products/tea-set-1.jpg",
        category: "Serveware",
        rating: 4.8,
        reviewsCount: 56,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Glass Storage Jars",
        slug: slugify("Glass Storage Jars", { lower: true, strict: true }),
        sku: "JW013",
        description: "Set of 3 glass storage jars with airtight lids. Perfect for kitchen organization.",
        price: 1200,
        variants: [
          { attributes: { Size: "Small" }, stock: 20 },
          { attributes: { Size: "Medium" }, stock: 18 },
          { attributes: { Size: "Large" }, stock: 15 }
        ],
        image: "/uploads/products/storage-jars-1.jpg",
        mainImage: "/uploads/products/storage-jars-1.jpg",
        category: "Storage",
        rating: 4.6,
        reviewsCount: 38,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Glass Candle Holders",
        slug: slugify("Glass Candle Holders", { lower: true, strict: true }),
        sku: "JW014",
        description: "Set of 3 elegant glass candle holders. Creates beautiful ambiance.",
        price: 1500,
        variants: [
          { attributes: { Size: "Medium" }, stock: 25 }
        ],
        image: "/uploads/products/candle-holders-1.jpg",
        mainImage: "/uploads/products/candle-holders-1.jpg",
        category: "Decorative",
        rating: 4.7,
        reviewsCount: 44,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Glass Pitcher with Lid",
        slug: slugify("Glass Pitcher with Lid", { lower: true, strict: true }),
        sku: "JW015",
        description: "Large glass pitcher with lid. Perfect for serving beverages.",
        price: 1800,
        originalPrice: 2200,
        variants: [
          { attributes: { Capacity: "1.5L" }, stock: 18 }
        ],
        image: "/uploads/products/glass-pitcher-1.jpg",
        mainImage: "/uploads/products/glass-pitcher-1.jpg",
        category: "Serveware",
        rating: 4.5,
        reviewsCount: 27,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Glass Dessert Bowls",
        slug: slugify("Glass Dessert Bowls", { lower: true, strict: true }),
        sku: "JW016",
        description: "Set of 6 glass dessert bowls. Perfect for serving ice cream, pudding, or fruit.",
        price: 1400,
        variants: [
          { attributes: { Capacity: "250ml" }, stock: 22 }
        ],
        image: "/uploads/products/dessert-bowls-1.jpg",
        mainImage: "/uploads/products/dessert-bowls-1.jpg",
        category: "Serveware",
        rating: 4.6,
        reviewsCount: 35,
        isFeatured: true,
        isActive: true
      }
    ];

    await Product.insertMany(additionalProducts);
    console.log(`Successfully added ${additionalProducts.length} more products!`);
    console.log(`Total featured products should now be: ${6 + additionalProducts.length}`);

  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the script
if (require.main === module) {
  addMoreProducts();
}

module.exports = addMoreProducts;
