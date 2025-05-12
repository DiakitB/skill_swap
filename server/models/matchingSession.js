const mongoose = require('mongoose');

const matchingSessionSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  sessionDate: { type: Date, default: Date.now },
  duration: { type: Number }, // Optional: in minutes
  status: {
    type: String,
    enum: ['pending', 'completed', 'confirmed', 'disputed'],
    default: 'pending',
  },
  pendingTransferId: { type: mongoose.Schema.Types.ObjectId, ref: 'PendingTokenTransfer' },
  learnerFeedback: { type: String },
  teacherFeedback: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MatchingSession', matchingSessionSchema);
