const mongoose = require('mongoose');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
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
        description: "Handcrafted ring made from eight sacred metals with intricate traditional designs. Perfect for daily wear and spiritual practices.",
        price: 2500,
        originalPrice: 3000,
        productType: "ashta-dhatu",
        sizeVariants: [
          { size: "6", stock: 10 },
          { size: "7", stock: 15 },
          { size: "8", stock: 20 },
          { size: "9", stock: 12 },
          { size: "10", stock: 8 }
        ],
        availableColors: ["gold", "silver"],
        material: "Ashta Dhatu Alloy",
        metalDetails: ["Ashta Dhatu alloy base", "Precise gold plating", "Premium quality finish"],
        benefits: ["Hypoallergenic & skin-friendly", "Spiritual significance", "Durable & long-lasting finish"],
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
        description: "Sacred pendant with intricate designs representing divine energy. Comes with adjustable chain.",
        price: 1800,
        originalPrice: 2200,
        productType: "ashta-dhatu",
        sizeVariants: [
          { size: "One Size", stock: 25 }
        ],
        image: "/uploads/products/ashta-dhatu-pendant-1.jpg",
        mainImage: "/uploads/products/ashta-dhatu-pendant-1.jpg",
        galleryImages: [
          "/uploads/products/ashta-dhatu-pendant-1-gallery-1.jpg"
        ],
        category: "Pendants",
        rating: 4.8,
        reviewsCount: 15,
        isFeatured: false,
        isActive: true
      },
      {
        name: "Ashta Dhatu Bracelet",
        description: "Elegant bracelet with traditional motifs. Adjustable size for comfortable fit.",
        price: 3200,
        productType: "ashta-dhatu",
        sizeVariants: [
          { size: "Small", stock: 12 },
          { size: "Medium", stock: 8 },
          { size: "Large", stock: 6 }
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
        description: "Classic diamond studs for everyday elegance. Premium quality with secure backing.",
        price: 8500,
        originalPrice: 10000,
        productType: "fashion-jewelry",
        sizeVariants: [
          { size: "One Size", stock: 15 }
        ],
        availableColors: ["white", "rose-gold"],
        material: "Sterling Silver with Diamonds",
        metalDetails: ["Sterling silver base", "Genuine diamond stones", "Secure backing system"],
        benefits: ["Hypoallergenic & skin-friendly", "Lightweight & comfortable", "Tarnish resistant"],
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
        description: "Elegant pearl necklace for special occasions. Lustrous pearls with secure clasp.",
        price: 4200,
        productType: "fashion-jewelry",
        sizeVariants: [
          { size: "16 inch", stock: 8 },
          { size: "18 inch", stock: 12 },
          { size: "20 inch", stock: 6 }
        ],
        image: "/uploads/products/pearl-necklace-1.jpg",
        mainImage: "/uploads/products/pearl-necklace-1.jpg",
        category: "Necklaces",
        rating: 4.6,
        reviewsCount: 34,
        isFeatured: false,
        isActive: true
      },
      {
        name: "Gold Chain Bracelet",
        description: "Delicate gold chain bracelet perfect for layering or wearing alone.",
        price: 3800,
        productType: "fashion-jewelry",
        sizeVariants: [
          { size: "7 inch", stock: 10 },
          { size: "8 inch", stock: 15 }
        ],
        image: "/uploads/products/gold-chain-bracelet-1.jpg",
        mainImage: "/uploads/products/gold-chain-bracelet-1.jpg",
        category: "Bracelets",
        rating: 4.5,
        reviewsCount: 28,
        isFeatured: false,
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