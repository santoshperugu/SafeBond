const mongoose = require('mongoose');

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

// Meeting Schema
const meetingSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  scheduledAt: { type: Date, required: true },
  location: { type: String },
  videoLink: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  bride: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groom: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedAt: { type: Date, default: Date.now },
  adminSignature: { type: String, required: true },
  qrCodeUrl: { type: String },
  pdfUrl: { type: String }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Registration', 'Verification', 'Consent', 'Message', 'System'] },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Consent Schema
const consentSchema = new mongoose.Schema({
  brideFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groomFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  brideConsentStatus: { type: String, enum: ['Pending', 'Consented', 'Withdrawn'], default: 'Pending' },
  groomConsentStatus: { type: String, enum: ['Pending', 'Consented', 'Withdrawn'], default: 'Pending' },
  adminFinalApproval: { type: Boolean, default: false },
  approvedAt: { type: Date }
}, { timestamps: true });

// AuditLog Schema
const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: String }
}, { timestamps: true });

module.exports = {
  Message: mongoose.model('Message', messageSchema),
  Meeting: mongoose.model('Meeting', meetingSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Consent: mongoose.model('Consent', consentSchema),
  AuditLog: mongoose.model('AuditLog', auditLogSchema)
};
