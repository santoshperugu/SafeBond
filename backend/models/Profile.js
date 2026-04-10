const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Personal Details
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  education: { type: String },
  occupation: { type: String },
  annualIncome: { type: Number },
  religion: { type: String },
  caste: { type: String },
  
  // Family Background
  fathersName: { type: String },
  mothersName: { type: String },
  familyType: { type: String },
  familyValues: { type: String },
  
  // Contact Info
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },

  // Documents (URLs typically from Cloudinary/S3)
  documents: {
    aadhaarOrPassport: { type: String },
    photos: [{ type: String }],
    incomeProof: { type: String },
    familyCertificates: { type: String }
  },

  // Aadhaar Verification
  aadhaarNumber: { type: String },       // stored masked e.g. XXXX XXXX 0123
  aadhaarVerified: { type: Boolean, default: false },

  // Background Check Report
  backgroundCheck: {
    clearedStatus: { type: String, enum: ['Clear', 'Minor Flag', 'Alert'], default: 'Clear' },
    checkConductedOn: { type: Date },
    remarks: { type: String },
    policeCases: [{
      caseNo:      { type: String },
      date:        { type: String },
      description: { type: String },
      status:      { type: String },
      court:       { type: String }
    }],
    firs: [{
      firNo:   { type: String },
      station: { type: String },
      date:    { type: String },
      charge:  { type: String },
      status:  { type: String }
    }],
    complaints: [{
      complaintNo: { type: String },
      date:        { type: String },
      description: { type: String },
      filedBy:     { type: String }
    }]
  },

  // Profile Completeness
  completeness: { type: Number, default: 0 },

  // Admin Verification
  verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected', 'Re-submission Requested'], default: 'Pending' },
  verificationRemarks: { type: String },
  
  verificationChecklist: {
    identityVerification: { type: Boolean, default: false },
    criminalRecordCheck: { type: Boolean, default: false },
    familyBackgroundValidation: { type: Boolean, default: false },
    educationAndEmploymentCheck: { type: Boolean, default: false },
    socialMediaScreeningFlag: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Middleware to calculate completeness automatically before saving
profileSchema.pre('save', async function() {
  let score = 0;
  const totalFields = 15;

  if (this.dob) score++;
  if (this.education) score++;
  if (this.occupation) score++;
  if (this.religion) score++;
  if (this.fathersName) score++;
  if (this.address) score++;
  if (this.documents?.aadhaarOrPassport) score++;
  if (this.documents?.photos && this.documents.photos.length > 0) score++;
  if (this.documents?.incomeProof) score++;

  this.completeness = Math.round((score / totalFields) * 100);
});

module.exports = mongoose.model('Profile', profileSchema);
