const express = require('express');
const router = express.Router();
console.log('Registering API routes...');

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { getDashboardStats, verifyProfile, getAuditLogs, getAllUsers } = require('../controllers/adminController');
const { 
  updateProfile, getProfile, getAllProfiles, getProfileById,
  sendMessage, getMessages, 
  submitConsent, scheduleMeeting,
  getBackgroundReport
} = require('../controllers/controllers');

const { protect, adminOnly, verifiedOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/me', protect, getMe);

// Upload Route
router.post('/upload/document', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Profile Routes
router.get('/profile', protect, getProfile);
router.get('/profile/:id', getProfileById); // Publicly accessible for demo
router.get('/profiles/public', getAllProfiles); // Publicly accessible for demo
router.post('/profile', protect, updateProfile);
router.put('/profile', protect, updateProfile);

// Background Check Route (auth required)
router.get('/background/:profileId', protect, getBackgroundReport);

// Admin Routes
router.get('/admin/dashboard', protect, adminOnly, getDashboardStats);
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.get('/admin/logs', protect, adminOnly, getAuditLogs);
router.put('/admin/verify/:profileId', protect, adminOnly, verifyProfile);

// Communication Server
router.post('/messages', protect, verifiedOnly, sendMessage);
router.get('/messages/:userId', protect, verifiedOnly, getMessages);
router.post('/meetings', protect, verifiedOnly, scheduleMeeting);

// Consent
router.post('/consent', protect, verifiedOnly, submitConsent);

module.exports = router;
