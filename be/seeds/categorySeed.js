const mongoose = require('mongoose');
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

const seedCategories = async () => {
  try {
    await connectDB();

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    const categories = [
      {
        name: "Rings",
        slug: "rings",
        description: "Beautiful rings for all occasions",
        isActive: true
      },
      {
        name: "Necklaces",
        slug: "necklaces", 
        description: "Elegant necklaces and chains",
        isActive: true
      },
      {
        name: "Earrings",
        slug: "earrings",
        description: "Stunning earrings collection",
        isActive: true
      },
      {
        name: "Bracelets",
        slug: "bracelets",
        description: "Stylish bracelets and bangles",
        isActive: true
      },
      {
        name: "Pendants",
        slug: "pendants",
        description: "Sacred and decorative pendants",
        isActive: true
      },
      {
        name: "Sets",
        slug: "sets",
        description: "Complete jewelry sets",
        isActive: true
      }
    ];

    await Category.insertMany(categories);
    console.log(`Successfully seeded ${categories.length} categories`);
    console.log('Category seeding completed!');

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the seed function
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;