const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safebond');
    console.log('Connected to MongoDB for admin seeding...');

    const email = 'admin@safebond.com';
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log('Admin user exists. Deleting and re-creating...');
      await User.deleteOne({ email });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      firstName: 'System',
      lastName: 'Admin',
      email: email,
      password: hashedPassword,
      mobile: '9999999999',
      role: 'admin',
      isVerified: true
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@safebond.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();
