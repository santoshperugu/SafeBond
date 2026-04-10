const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Profile = require('./models/Profile');

dotenv.config();

const brides = [
  { first: 'Ananya', last: 'Sharma', email: 'ananya@example.com', mobile: '9888811111', bio: 'Passionate about classical dance and technology. Looking for someone who values tradition and growth.' },
  { first: 'Priya', last: 'Patel', email: 'priya@example.com', mobile: '9888811112', bio: 'Doctor by profession, traveler at heart. Looking for a partner to explore the world with.' },
  { first: 'Ishani', last: 'Verma', email: 'ishani@example.com', mobile: '9888811113', bio: 'Creative designer who loves minimalist living. Believes in transparency and mutual respect.' },
  { first: 'Meera', last: 'Reddy', email: 'meera@example.com', mobile: '9888811114', bio: 'Software engineer who loves animals and organic gardening. Family-oriented.' },
  { first: 'Sana', last: 'Khan', email: 'sana@example.com', mobile: '9888811115', bio: 'Marketing professional with a love for literature and history.' },
  { first: 'Riya', last: 'Sen', email: 'riya@example.com', mobile: '9888811116', bio: 'Architect focused on sustainable buildings. Quiet, thoughtful, and adventurous.' },
  { first: 'Tanvi', last: 'Joshi', email: 'tanvi@example.com', mobile: '9888811117', bio: 'Fashion designer who loves vibrant colors and classical music.' },
  { first: 'Zara', last: 'Sheikh', email: 'zara@example.com', mobile: '9888811118', bio: 'Psychologist who believes in deep connections and emotional intelligence.' }
];

const grooms = [
  { first: 'Arnav', last: 'Singh', email: 'arnav@example.com', mobile: '9777711111', bio: 'Tech entrepreneur. I value honesty and a good sense of humor above all else.' },
  { first: 'Rahul', last: 'Gupta', email: 'rahul@example.com', mobile: '9777711112', bio: 'Finance professional and marathon runner. Looking for my best friend and partner.' },
  { first: 'Vikram', last: 'Malhotra', email: 'vikram@example.com', mobile: '9777711113', bio: 'Pilot who loves the sky and quiet evenings with a book.' },
  { first: 'Aditya', last: 'Iyer', email: 'aditya@example.com', mobile: '9777711114', bio: 'Chef who expresses love through food. Traditional yet progressive.' },
  { first: 'Zaid', last: 'Ahmed', email: 'zaid@example.com', mobile: '9777711115', bio: 'Researcher focused on climate change. Looking for a conscious partner.' },
  { first: 'Kabir', last: 'Bose', email: 'kabir@example.com', mobile: '9777711116', bio: 'Lawyer with a passion for social justice and jazz music.' },
  { first: 'Rohan', last: 'Desai', email: 'rohan@example.com', mobile: '9777711117', bio: 'Musician who loves photography and late night drives.' },
  { first: 'Imran', last: 'Khan', email: 'imran@example.com', mobile: '9777711118', bio: 'Civil engineer with a love for hiking and ancient architecture.' }
];

const adminUser = {
  first: 'System',
  last: 'Administrator',
  email: 'admin@safebond.com',
  mobile: '0000000000',
  role: 'admin'
};

const occupations = ['Software Engineer', 'Doctor', 'Chartered Accountant', 'Architect', 'Marketing Manager', 'Product Designer', 'Pilot', 'Entrepreneur'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];
const religions = ['Hindu', 'Muslim', 'Sikh', 'Christian'];
const education = ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'B.Arch', 'PhD'];

const seedDatabase = async () => {
  try {
    console.log('Attempting to connect to MongoDB...', process.env.MONGODB_URI || 'mongodb://localhost:27017/safebond');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safebond');
    console.log('Connected to MongoDB successfully');

    // Clean existing mock data (idempotency)
    console.log('Clearing existing mock data...');
    await Profile.deleteMany({}); 
    await User.deleteMany({ email: { $regex: '@example.com|admin@safebond.com' } });
    console.log('Cleared existing mock data');
    
    const hashedPassword = await bcrypt.hash('password123', 10);

    const createProfile = async (userData, role) => {
      const user = new User({
        firstName: userData.first,
        lastName: userData.last,
        email: userData.email,
        password: hashedPassword,
        mobile: userData.mobile,
        role: role,
        isVerified: true
      });

      const savedUser = await user.save();

      const profile = new Profile({
        user: savedUser._id,
        dob: new Date(1988 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        gender: role === 'bride' ? 'Female' : 'Male',
        education: education[Math.floor(Math.random() * education.length)],
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        annualIncome: Math.floor(Math.random() * 5000000) + 800000,
        religion: religions[Math.floor(Math.random() * religions.length)],
        address: userData.bio, // Using bio in the address field temporarily as we don't have a 'bio' field in schema yet, or we assume address can hold it for demo
        city: cities[Math.floor(Math.random() * cities.length)],
        state: 'Maharashtra',
        country: 'India',
        pincode: '400' + Math.floor(Math.random() * 999),
        verificationStatus: 'Verified',
        completeness: 95
      });

      await profile.save();
      console.log(`Created ${role} profile for ${userData.first} ${userData.last}`);
    };

    console.log('Creating Admin user...');
    const admin = new User({
      firstName: adminUser.first,
      lastName: adminUser.last,
      email: adminUser.email,
      password: hashedPassword,
      mobile: adminUser.mobile,
      role: 'admin',
      isVerified: true
    });
    await admin.save();
    console.log('Admin account created: admin@safebond.com / password123');

    for (const bride of brides) {
      await createProfile(bride, 'bride');
    }

    for (const groom of grooms) {
      await createProfile(groom, 'groom');
    }

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();

