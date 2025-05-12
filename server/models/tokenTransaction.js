// const mongoose = require('mongoose');

// const tokenTransactionSchema = new mongoose.Schema({
//   fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   tokenAmount: { type: Number, required: true },
//   description: { type: String },
//   date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('TokenTransaction', tokenTransactionSchema);




// const pendingTokenTransferSchema = new mongoose.Schema({
//     fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     tokenAmount: { type: Number, required: true }, // Updated field name
//     description: { type: String },
//     date: { type: Date, default: Date.now },
//   });
  
//   module.exports = mongoose.model('PendingTokenTransfer', pendingTokenTransferSchema);