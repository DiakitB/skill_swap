const mongoose = require('mongoose');
const Message = require('../models/message');
const User = require('../models/user');
// Get recent con
// Send a message
exports.sendMessage = async (req, res) => {
  const { receiver, content } = req.body;
  console.log('Receiver:', receiver);
  console.log('Content:', content);
  console.log(req.body);
  const sender = req.user.id;
 console.log("hello Bick how can suck your dick?")
  try {
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
    console.log(message)
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  console.log(req.body)
 
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages TESTING  THIS ERROR MESSAGE IS COMING FROM getMessage controller' });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  const messageId = req.params.id;

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
};


// Mark all messages from a specific user as read
exports.markAllFromUserAsRead = async (req, res) => {
  const currentUserId = req.user.id;
  const fromUserId = req.params.fromUserId;

  try {
    const updatedMessages = await Message.updateMany(
      { sender: fromUserId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'Messages marked as read', updatedCount: updatedMessages.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

// Get count of unread messages for the logged-in user
exports.getUnreadCount = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const count = await Message.countDocuments({
      receiver: currentUserId,
      isRead: false
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread message count' });
  }
};


 exports.getRecentConversations = async (req, res) => {
  console.log("Fetching recent conversations...");
  const userId = req.user.id;

  try {
    // Get the latest message for each conversation
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: { $eq: req.user._id } },
            { receiver: { $eq: req.user._id } },
          ],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender',
            ],
          },
          message: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          username: '$user.name',
          location: '$user.location',
          skillsOffered: '$user.skillsOffered',
          skillsWanted: '$user.skillsWanted',
          message: {
            content: '$message.content',
            isRead: '$message.isRead',
            timestamp: '$message.timestamp',
            sender: '$message.sender',
          },
        },
      },
      {
        $sort: { 'message.timestamp': -1 },
      },
    ]);

    res.status(200).json(messages);
    console.log("Conversations fetched successfully:", messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

