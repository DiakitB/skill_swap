const mongoose = require('mongoose');

const pendingTransferSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenAmount: { type: Number, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingTokenTransfer', pendingTransferSchema);
