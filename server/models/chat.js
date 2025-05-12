const mongoose = require("mongoose");



const Schema = mongoose.Schema;

const chatSchema = new Schema({

  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

const Chats = mongoose.model("Chats", chatSchema);

module.exports = Chats;