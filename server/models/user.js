const mongoose = require('mongoose');

// Define transaction schema
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['send', 'receive', 'purchase', 'withdraw'],
    required: true
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  details: { type: String }
});

// Extend user schema
const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Token System
  // tokenBalance: { type: Number, default: 10 },
  premiumTokenBalance: { type: Number, default: 0 },
  totalEarnedTokens: { type: Number, default: 0 },
  isEligibleForCashout: { type: Boolean, default: false },

  // Profile Completion
  isProfileComplete: { type: Boolean, default: false },

  // User Profile Details
  profile: {
    skillsOffered: { type: [String], default: [] },
    skillsWanted: { type: [String], default: [] },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    geolocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    availability: { type: String, default: '' },
  },

  profilePicture: { type: String, default: '' },
  rating: {
    average: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },

  // ✅ Transaction History
  transactions: [transactionSchema],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

