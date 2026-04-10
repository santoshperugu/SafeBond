const User = require('../models/User');
const Profile = require('../models/Profile');
const { AuditLog } = require('../models');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    
    const pendingProfiles = await Profile.countDocuments({ verificationStatus: 'Pending' });
    const verifiedProfiles = await Profile.countDocuments({ verificationStatus: 'Verified' });
    const rejectedProfiles = await Profile.countDocuments({ verificationStatus: 'Rejected' });

    res.json({
      totalUsers,
      totalProfiles,
      pendingProfiles,
      verifiedProfiles,
      rejectedProfiles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Profile Verification Status
// @route   PUT /api/admin/verify/:profileId
// @access  Private/Admin
const verifyProfile = async (req, res) => {
  try {
    const { status, remarks, checklist } = req.body;
    const profile = await Profile.findById(req.params.profileId).populate('user');
    
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.verificationStatus = status;
    if (remarks) profile.verificationRemarks = remarks;
    if (checklist) {
      profile.verificationChecklist = { ...profile.verificationChecklist, ...checklist };
    }

    await profile.save();

    // Make User as verified if Profile is verified
    if (status === 'Verified') {
      await User.findByIdAndUpdate(profile.user._id, { isVerified: true });
    } else if (status === 'Rejected' || status === 'Re-submission Requested') {
      await User.findByIdAndUpdate(profile.user._id, { isVerified: false });
    }

    // Audit Log
    await AuditLog.create({
      admin: req.user._id,
      action: `Profile Verification: ${status}`,
      targetUser: profile.user._id,
      details: `Remarks: ${remarks || 'None'}`
    });

    res.json({ message: `Profile marked as ${status}`, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('admin', 'firstName lastName email')
      .populate('targetUser', 'firstName lastName email')
      .sort('-createdAt');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Users with Profiles
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    const enrichedUsers = await Promise.all(users.map(async (u) => {
      const profile = await Profile.findOne({ user: u._id });
      return {
        ...u.toObject(),
        profile: profile || null
      };
    }));
    res.json(enrichedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, verifyProfile, getAuditLogs, getAllUsers };
