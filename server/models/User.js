const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  role: { type: String, enum: ['bride', 'groom', 'family', 'admin'], required: true },
  isVerified: { type: Boolean, default: false }, // General email/mobile verification status
  isTwoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  refreshToken: { type: String }, // For session state handling
  lastLoginEvent: { type: Date }
}, {
  timestamps: true
});



userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
