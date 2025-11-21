const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+91 9876543210',
    isEmailVerified: true,
    accountStatus: 'active',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+91 9876543211',
    isEmailVerified: true,
    accountStatus: 'active',
    address: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '+91 9876543212',
    isEmailVerified: true,
    accountStatus: 'active',
    address: {
      street: '789 Garden Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    }
  },
  {
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    password: 'password123',
    phone: '+91 9876543213',
    isEmailVerified: true,
    accountStatus: 'active',
    address: {
      street: '321 Lake View',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India'
    }
  },
  {
    name: 'Admin User',
    email: 'admin@delicorn.com',
    password: 'admin123',
    phone: '+91 9876543214',
    isAdmin: true,
    isEmailVerified: true,
    accountStatus: 'active'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    
    await User.deleteMany({});
    console.log('Existing users deleted');

    const users = await User.create(sampleUsers);
    console.log(`${users.length} users created successfully`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) ${user.isAdmin ? '[ADMIN]' : ''}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();