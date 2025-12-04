const mongoose = require('mongoose');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const slugify = require('slugify');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Sample Ashta Dhatu products
    const ashtaDhatuProducts = [
      {
        name: "Traditional Ashta Dhatu Ring",
        slug: slugify("Traditional Ashta Dhatu Ring", { lower: true, strict: true }),
        sku: "JW001",
        description: "Handcrafted ring made from eight sacred metals with intricate traditional designs. Perfect for daily wear and spiritual practices.",
        price: 2500,
        originalPrice: 3000,
        variants: [
          { attributes: { Size: "6", Color: "Gold" }, stock: 10 },
          { attributes: { Size: "7", Color: "Gold" }, stock: 15 },
          { attributes: { Size: "8", Color: "Gold" }, stock: 20 },
          { attributes: { Size: "9", Color: "Silver" }, stock: 12 },
          { attributes: { Size: "10", Color: "Silver" }, stock: 8 }
        ],
        image: "/uploads/products/ashta-dhatu-ring-1.jpg",
        mainImage: "/uploads/products/ashta-dhatu-ring-1.jpg",
        galleryImages: [
          "/uploads/products/ashta-dhatu-ring-1-gallery-1.jpg",
          "/uploads/products/ashta-dhatu-ring-1-gallery-2.jpg"
        ],
        category: "Rings",
        rating: 4.5,
        reviewsCount: 23,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Ashta Dhatu Pendant",
        slug: slugify("Ashta Dhatu Pendant", { lower: true, strict: true }),
        sku: "JW002",
        description: "Sacred pendant with intricate designs representing divine energy. Comes with adjustable chain.",
        price: 1800,
        originalPrice: 2200,
        variants: [
          { attributes: { Size: "One Size" }, stock: 25 }
        ],
        image: "/uploads/products/ashta-dhatu-pendant-1.jpg",
        mainImage: "/uploads/products/ashta-dhatu-pendant-1.jpg",
        galleryImages: [
          "/uploads/products/ashta-dhatu-pendant-1-gallery-1.jpg"
        ],
        category: "Pendants",
        rating: 4.8,
        reviewsCount: 15,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Ashta Dhatu Bracelet",
        slug: slugify("Ashta Dhatu Bracelet", { lower: true, strict: true }),
        sku: "JW003",
        description: "Elegant bracelet with traditional motifs. Adjustable size for comfortable fit.",
        price: 3200,
        variants: [
          { attributes: { Size: "Small" }, stock: 12 },
          { attributes: { Size: "Medium" }, stock: 8 },
          { attributes: { Size: "Large" }, stock: 6 }
        ],
        image: "/uploads/products/ashta-dhatu-bracelet-1.jpg",
        mainImage: "/uploads/products/ashta-dhatu-bracelet-1.jpg",
        category: "Bracelets",
        rating: 4.6,
        reviewsCount: 31,
        isFeatured: true,
        isActive: true
      }
    ];

    // Sample Fashion Jewelry products
    const fashionJewelryProducts = [
      {
        name: "Diamond Stud Earrings",
        slug: slugify("Diamond Stud Earrings", { lower: true, strict: true }),
        sku: "JW004",
        description: "Classic diamond studs for everyday elegance. Premium quality with secure backing.",
        price: 8500,
        originalPrice: 10000,
        variants: [
          { attributes: { Color: "White" }, stock: 15 },
          { attributes: { Color: "Rose Gold" }, stock: 10 }
        ],
        image: "/uploads/products/diamond-studs-1.jpg",
        mainImage: "/uploads/products/diamond-studs-1.jpg",
        galleryImages: [
          "/uploads/products/diamond-studs-1-gallery-1.jpg",
          "/uploads/products/diamond-studs-1-gallery-2.jpg"
        ],
        category: "Earrings",
        rating: 4.8,
        reviewsCount: 67,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Pearl Necklace",
        slug: slugify("Pearl Necklace", { lower: true, strict: true }),
        sku: "JW005",
        description: "Elegant pearl necklace for special occasions. Lustrous pearls with secure clasp.",
        price: 4200,
        variants: [
          { attributes: { Size: "16 inch" }, stock: 8 },
          { attributes: { Size: "18 inch" }, stock: 12 },
          { attributes: { Size: "20 inch" }, stock: 6 }
        ],
        image: "/uploads/products/pearl-necklace-1.jpg",
        mainImage: "/uploads/products/pearl-necklace-1.jpg",
        category: "Necklaces",
        rating: 4.6,
        reviewsCount: 34,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Gold Chain Bracelet",
        slug: slugify("Gold Chain Bracelet", { lower: true, strict: true }),
        sku: "JW006",
        description: "Delicate gold chain bracelet perfect for layering or wearing alone.",
        price: 3800,
        variants: [
          { attributes: { Size: "7 inch" }, stock: 10 },
          { attributes: { Size: "8 inch" }, stock: 15 }
        ],
        image: "/uploads/products/gold-chain-bracelet-1.jpg",
        mainImage: "/uploads/products/gold-chain-bracelet-1.jpg",
        category: "Bracelets",
        rating: 4.5,
        reviewsCount: 28,
        isFeatured: true,
        isActive: true
      }
    ];

    // Insert all products
    const allProducts = [...ashtaDhatuProducts, ...fashionJewelryProducts];
    await Product.insertMany(allProducts);

    console.log(`Successfully seeded ${allProducts.length} products`);
    console.log('Product seeding completed!');

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the seed function
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;