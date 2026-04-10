const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Profile = require('./models/Profile');
const bcrypt = require('bcryptjs');

dotenv.config();

const SEED_PROFILES = [
  // --- GROOMS WITH ISSUES ---
  {
    firstName: 'Vikram',
    lastName: 'Rathore',
    email: 'vikram.alert@example.com',
    role: 'groom',
    background: {
      clearedStatus: 'Alert',
      remarks: 'Serious integrity concerns. Subject has multiple active criminal proceedings related to financial misconduct.',
      policeCases: [
        { caseNo: 'SC/2023/1142', date: '2023-05-12', description: 'Attempted fraud and forgery of documents', court: 'Sessions Court, Mumbai', status: 'Ongoing' }
      ],
      firs: [
        { firNo: 'MB/EOW/2022/88', station: 'EOW, Mumbai', date: '2022-11-20', charge: 'IPC 420 (Cheating)', status: 'Active' }
      ],
      complaints: [
        { complaintNo: 'CP/2024/004', date: '2024-01-15', description: 'Misleading information on matrimonial profile', filedBy: 'Anonymous Verified User' }
      ]
    }
  },
  {
    firstName: 'Siddharth',
    lastName: 'Malhotra',
    email: 'sid.flag@example.com',
    role: 'groom',
    background: {
      clearedStatus: 'Minor Flag',
      remarks: 'Minor civil dispute on record. Subject cleared of criminal intent, but case remains in mediation.',
      policeCases: [
        { caseNo: 'CC/2021/552', date: '2021-08-20', description: 'Property dispute with neighbors', court: 'Dindoshi Court', status: 'In Mediation' }
      ],
      firs: [],
      complaints: []
    }
  },

  // --- BRIDES WITH ISSUES ---
  {
    firstName: 'Anjali',
    lastName: 'Deshmukh',
    email: 'anjali.alert@example.com',
    role: 'bride',
    background: {
      clearedStatus: 'Alert',
      remarks: 'Involved in a major investigation regarding professional credential forgery.',
      policeCases: [
        { caseNo: 'DL/CYB/2023/44', date: '2023-09-30', description: 'Corporate Espionage and Data Theft', court: 'High Court, Delhi', status: 'Under Investigation' }
      ],
      firs: [
        { firNo: 'DL/PS12/2023/2', station: 'Sector 12, Noida', date: '2023-09-01', charge: 'IT Act Section 66', status: 'Pending' }
      ],
      complaints: []
    }
  },
  {
    firstName: 'Ishani',
    lastName: 'Kapoor',
    email: 'ishani.flag@example.com',
    role: 'bride',
    background: {
      clearedStatus: 'Minor Flag',
      remarks: 'Public nuisance charge during a college protest. No serious criminal record otherwise.',
      policeCases: [],
      firs: [
        { firNo: 'PN/PS3/2019/11', station: 'Deccan Gymkhana, Pune', date: '2019-12-15', charge: 'Unlawful Assembly', status: 'Discharged' }
      ],
      complaints: [
        { complaintNo: 'REF/2020/99', date: '2020-02-10', description: 'Noise complaint during social gathering', filedBy: 'Society Secretary' }
      ]
    }
  },

  // --- CLEAR PROFILES ---
  { firstName: 'Sameer', lastName: 'Joshi', email: 'sameer.clear@example.com', role: 'groom', background: { clearedStatus: 'Clear', remarks: 'No adverse records found. Verified professional history.' } },
  { firstName: 'Rohan', lastName: 'Mehra', email: 'rohan.clear@example.com', role: 'groom', background: { clearedStatus: 'Clear', remarks: 'Exemplary record. Standard verification completed.' } },
  { firstName: 'Karan', lastName: 'Oberoi', email: 'karan.clear@example.com', role: 'groom', background: { clearedStatus: 'Clear', remarks: 'Perfect verification status.' } },
  { firstName: 'Aditya', lastName: 'Singhania', email: 'adi.clear@example.com', role: 'groom', background: { clearedStatus: 'Clear', remarks: 'No flags found.' } },
  { firstName: 'Meera', lastName: 'Reddy', email: 'meera.clear@example.com', role: 'bride', background: { clearedStatus: 'Clear', remarks: 'All background checks passed successfully.' } },
  { firstName: 'Tanvi', lastName: 'Shah', email: 'tanvi.clear@example.com', role: 'bride', background: { clearedStatus: 'Clear', remarks: 'Clean record. Trust score verified.' } },
  { firstName: 'Riya', lastName: 'Bansal', email: 'riya.clear@example.com', role: 'bride', background: { clearedStatus: 'Clear', remarks: 'No criminal or civil issues.' } },
  { firstName: 'Sanya', lastName: 'Malhotra', email: 'sanya.clear@example.com', role: 'bride', background: { clearedStatus: 'Clear', remarks: 'Verified background.' } }
];

const seedDiverse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safebond');
    console.log('Connected to MongoDB for diverse seeding...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    for (const data of SEED_PROFILES) {
      // Create User
      const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        mobile: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        role: data.role
      });

      // Create Profile
      await Profile.create({
        user: user._id,
        dob: new Date(1990 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        gender: data.role === 'bride' ? 'Female' : 'Male',
        occupation: ['Software Engineer', 'Doctor', 'Architect', 'Entrepreneur', 'Manager'][Math.floor(Math.random() * 5)],
        education: ['B.Tech', 'M.B.B.S', 'MBA', 'Ph.D', 'M.Tech'][Math.floor(Math.random() * 5)],
        income: ['12 LPA', '25 LPA', '40 LPA', '18 LPA'][Math.floor(Math.random() * 4)],
        city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
        state: 'Maharashtra',
        religion: 'Hindu',
        aadhaarVerified: true,
        verificationStatus: 'Verified',
        backgroundCheck: {
          ...data.background,
          checkConductedOn: new Date(),
          policeCases: data.background.policeCases || [],
          firs: data.background.firs || [],
          complaints: data.background.complaints || []
        }
      });

      console.log(`✓ Seeded profile for ${data.firstName} (${data.role}) - Status: ${data.background.clearedStatus}`);
    }

    console.log('\nAll diverse profiles seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDiverse();
