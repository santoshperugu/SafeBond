const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Profile = require('./models/Profile');

dotenv.config();

const log = (msg) => {
  fs.appendFileSync('seed_debug.log', msg + '\n');
  console.log(msg);
};

async function run() {
  fs.writeFileSync('seed_debug.log', '--- Seed Debug Start ---\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safebond');
    log('Connected to MongoDB');

    // Wipe everything
    await Profile.deleteMany({});
    await User.deleteMany({});
    log('Cleared all data');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Admin
    await User.create({
      firstName: 'System', lastName: 'Admin',
      email: 'admin@safebond.com', password: adminPassword,
      mobile: '9999999999', role: 'admin', isVerified: true
    });
    log('Admin created');

    const people = [
      // Brides - Verified
      { first:'Ananya', last:'Sharma', email:'ananya@example.com', mobile:'9888811111', role:'bride', status:'Verified' },
      { first:'Priya', last:'Patel', email:'priya@example.com', mobile:'9888811112', role:'bride', status:'Verified' },
      { first:'Ishani', last:'Verma', email:'ishani@example.com', mobile:'9888811113', role:'bride', status:'Verified' },
      { first:'Meera', last:'Reddy', email:'meera@example.com', mobile:'9888811114', role:'bride', status:'Verified' },
      { first:'Sana', last:'Khan', email:'sana@example.com', mobile:'9888811115', role:'bride', status:'Verified' },
      // Brides - Pending
      { first:'Riya', last:'Sen', email:'riya@example.com', mobile:'9888811116', role:'bride', status:'Pending' },
      { first:'Tanvi', last:'Joshi', email:'tanvi@example.com', mobile:'9888811117', role:'bride', status:'Pending' },
      // Brides - Rejected
      { first:'Zara', last:'Sheikh', email:'zara@example.com', mobile:'9888811118', role:'bride', status:'Rejected' },

      // Grooms - Verified
      { first:'Arnav', last:'Singh', email:'arnav@example.com', mobile:'9777711111', role:'groom', status:'Verified' },
      { first:'Rahul', last:'Gupta', email:'rahul@example.com', mobile:'9777711112', role:'groom', status:'Verified' },
      { first:'Vikram', last:'Malhotra', email:'vikram@example.com', mobile:'9777711113', role:'groom', status:'Verified' },
      { first:'Aditya', last:'Iyer', email:'aditya@example.com', mobile:'9777711114', role:'groom', status:'Verified' },
      // Grooms - Pending
      { first:'Zaid', last:'Ahmed', email:'zaid@example.com', mobile:'9777711115', role:'groom', status:'Pending' },
      { first:'Kabir', last:'Bose', email:'kabir@example.com', mobile:'9777711116', role:'groom', status:'Pending' },
      { first:'Rohan', last:'Desai', email:'rohan@example.com', mobile:'9777711117', role:'groom', status:'Pending' },
      // Grooms - Rejected
      { first:'Imran', last:'Khan', email:'imran@example.com', mobile:'9777711118', role:'groom', status:'Rejected' },
    ];

    // Users without profiles (Incomplete)
    const incomplete = [
      { first:'Neha', last:'Kapoor', email:'neha.nodata@example.com', mobile:'9666611111', role:'bride' },
      { first:'Simran', last:'Kaur', email:'simran.nodata@example.com', mobile:'9666611112', role:'bride' },
      { first:'Arjun', last:'Nair', email:'arjun.nodata@example.com', mobile:'9666611113', role:'groom' },
      { first:'Dev', last:'Chopra', email:'dev.nodata@example.com', mobile:'9666611114', role:'groom' },
    ];

    for (const p of people) {
      try {
        const user = await User.create({
          firstName: p.first, lastName: p.last,
          email: p.email, password: hashedPassword,
          mobile: p.mobile, role: p.role,
          isVerified: p.status === 'Verified'
        });

        await Profile.create({
          user: user._id,
          dob: new Date(1990, 5, 15),
          gender: p.role === 'bride' ? 'Female' : 'Male',
          education: 'MBA',
          occupation: 'Engineer',
          religion: 'Hindu',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400001',
          verificationStatus: p.status,
          backgroundCheck: {
            clearedStatus: p.status === 'Rejected' ? 'Alert' : 'Clear',
            checkConductedOn: new Date(),
            remarks: p.status === 'Rejected' ? 'Failed background checks' : 'All checks passed',
            policeCases: [],
            firs: [],
            complaints: []
          }
        });

        log(`OK: ${p.first} ${p.last} (${p.role}) -> ${p.status}`);
      } catch (e) {
        log(`FAIL: ${p.first} ${p.last} -> ${e.message}`);
      }
    }

    // Incomplete users
    for (const u of incomplete) {
      try {
        await User.create({
          firstName: u.first, lastName: u.last,
          email: u.email, password: hashedPassword,
          mobile: u.mobile, role: u.role, isVerified: false
        });
        log(`OK (no profile): ${u.first} ${u.last}`);
      } catch (e) {
        log(`FAIL incomplete: ${u.first} -> ${e.message}`);
      }
    }

    // Summary
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const pending = await Profile.countDocuments({ verificationStatus: 'Pending' });
    const verified = await Profile.countDocuments({ verificationStatus: 'Verified' });
    const rejected = await Profile.countDocuments({ verificationStatus: 'Rejected' });

    log('');
    log('=== FINAL SUMMARY ===');
    log(`Total Users:    ${totalUsers}`);
    log(`Total Profiles: ${totalProfiles}`);
    log(`Verified:       ${verified}`);
    log(`Pending:        ${pending}`);
    log(`Rejected:       ${rejected}`);
    log(`No Profile:     ${totalUsers - totalProfiles}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    log(`FATAL: ${e.message}`);
    log(e.stack);
    process.exit(1);
  }
}

run();
