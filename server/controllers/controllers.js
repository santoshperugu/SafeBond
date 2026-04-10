const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const { Message, Meeting, Consent, Certificate } = require('../models');

// PROFILE CONTROLLERS
const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: req.body },
        { new: true }
      );
    } else {
      profile = await Profile.create({ user: req.user._id, ...req.body });
    }
    
    // The pre('save') hook calculates completeness, but findOneAndUpdate circumvents it.
    // Instead, let's just save it properly:
    const updatedProfile = await Profile.findOne({ user: req.user._id });
    await updatedProfile.save(); // triggers completeness update
    
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', '-password');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MESSAGE CONTROLLERS
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    // Emit via Socket.io if receiver is connected
    req.io.emit(`message_receive_${receiverId}`, message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CONSENT CONTROLLERS
const submitConsent = async (req, res) => {
  try {
    const { role, groomId, brideId, status } = req.body; // status = 'Consented' | 'Withdrawn'
    
    // Logic goes here depending on whether it's the bride's family or groom's family giving consent.
    // Simplifying for now: We assume one consent record per pair.
    let consent = await Consent.findOne({ brideFamily: brideId, groomFamily: groomId });
    if (!consent) {
      consent = new Consent({ brideFamily: brideId, groomFamily: groomId });
    }

    if (role === 'bride') {
      consent.brideConsentStatus = status;
    } else if (role === 'groom') {
      consent.groomConsentStatus = status;
    }

    await consent.save();
    res.json(consent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MEETING CONTROLLERS
const scheduleMeeting = async (req, res) => {
  try {
    const { participants, scheduledAt, location, videoLink } = req.body;

    const meeting = await Meeting.create({
      participants,
      scheduledAt,
      location,
      videoLink
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', '-password').sort('-createdAt');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', '-password');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBackgroundReport = async (req, res) => {
  try {
    console.log('getBackgroundReport profileId:', req.params.profileId);
    if (!mongoose.Types.ObjectId.isValid(req.params.profileId)) {
      console.error('getBackgroundReport - Invalid Profile ID format');
      return res.status(400).json({ message: 'Invalid Profile ID' });
    }
    const profile = await Profile.findById(req.params.profileId).select('backgroundCheck aadhaarVerified verificationStatus verificationChecklist');
    if (!profile) {
      console.warn('getBackgroundReport - Profile not found in database for ID:', req.params.profileId);
      return res.status(404).json({ message: 'Profile not found' });
    }
    console.log('getBackgroundReport - Success: backgroundCheck found');
    res.json(profile);
  } catch (error) {
    console.error('getBackgroundReport - Controller Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateProfile,
  getProfile,
  sendMessage,
  getMessages,
  submitConsent,
  scheduleMeeting,
  getAllProfiles,
  getProfileById,
  getBackgroundReport
};
