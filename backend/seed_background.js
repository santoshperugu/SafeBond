/**
 * seed_background.js
 * Run with: node seed_background.js
 * Seeds all existing profiles with fake background check data for demo purposes.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Profile = require('./models/Profile');

const FAKE_BACKGROUNDS = [
  {
    clearedStatus: 'Clear',
    checkConductedOn: new Date('2024-03-15'),
    remarks: 'Individual passed all background checks. No criminal history found. Character references positive. Socially well-regarded in local community.',
    policeCases: [],
    firs: [],
    complaints: []
  },
  {
    clearedStatus: 'Clear',
    checkConductedOn: new Date('2024-02-20'),
    remarks: 'Clean record across all databases. Employment and education verified. No pending cases.',
    policeCases: [],
    firs: [],
    complaints: []
  },
  {
    clearedStatus: 'Minor Flag',
    checkConductedOn: new Date('2024-01-10'),
    remarks: 'A minor traffic dispute from 2019 was found and has been resolved. No criminal intent. All other checks are clear.',
    policeCases: [
      {
        caseNo:      'PC/KA/2019/4821',
        date:        '14 Jun 2019',
        description: 'Minor traffic altercation — dispute over right of way',
        status:      'Closed',
        court:       'Metropolitan Magistrate Court, Bengaluru'
      }
    ],
    firs: [],
    complaints: [
      {
        complaintNo: 'CC/BLR/2019/3302',
        date:        '14 Jun 2019',
        description: 'Verbal dispute during traffic incident on Outer Ring Road.',
        filedBy:     'Traffic Police, Bellandur PS'
      }
    ]
  },
  {
    clearedStatus: 'Clear',
    checkConductedOn: new Date('2024-03-01'),
    remarks: 'Extensive background screening completed. No adverse findings. Individual is employed with a reputed MNC and holds a clean civic record.',
    policeCases: [],
    firs: [],
    complaints: []
  },
  {
    clearedStatus: 'Clear',
    checkConductedOn: new Date('2024-02-14'),
    remarks: 'Background verification complete. Individual comes from a well-established family. No criminal, civil or financial disputes recorded.',
    policeCases: [],
    firs: [],
    complaints: []
  },
  {
    clearedStatus: 'Alert',
    checkConductedOn: new Date('2023-11-05'),
    remarks: 'An FIR was registered in 2021 for a financial dispute. Case is currently under trial. Parties are advised to review this record carefully before proceeding.',
    policeCases: [
      {
        caseNo:      'CC/MH/2021/1177',
        date:        '09 Mar 2021',
        description: 'Alleged cheque dishonour under Section 138 NI Act',
        status:      'Under Trial',
        court:       'Judicial Magistrate First Class, Pune'
      }
    ],
    firs: [
      {
        firNo:   'FIR/PUNE/2021/0882',
        station: 'Shivajinagar Police Station, Pune',
        date:    '08 Mar 2021',
        charge:  'Cheque Dishonour (Section 138 NI Act)',
        status:  'Charge-sheeted'
      }
    ],
    complaints: [
      {
        complaintNo: 'EC/PUNE/2021/0550',
        date:        '07 Mar 2021',
        description: 'Complainant alleges non-payment of ₹4,50,000 for business services rendered.',
        filedBy:     'Aarav Enterprises, Pune'
      }
    ]
  }
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safebond');
  console.log('MongoDB connected');

  const profiles = await Profile.find({});
  console.log(`Found ${profiles.length} profiles to seed`);

  for (let i = 0; i < profiles.length; i++) {
    const bg = FAKE_BACKGROUNDS[i % FAKE_BACKGROUNDS.length];
    profiles[i].backgroundCheck = bg;
    profiles[i].aadhaarVerified = true;
    // Assign a demo aadhaar (masked)
    const lastFour = String(1000 + ((i + 1) * 111)).slice(-4);
    profiles[i].aadhaarNumber = `XXXX XXXX ${lastFour}`;
    await profiles[i].save();
    console.log(`✓ Seeded profile: ${profiles[i]._id} — Status: ${bg.clearedStatus}`);
  }

  console.log('\n✅ Background check seeding complete!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
