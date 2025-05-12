const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

// ✅ Apply authentication to all message routes
router.use(authController.protect);

// ==========================
// 📤 Sending Messages
// ==========================

// POST /api/messages/ - Send a message
router.post('/', messageController.sendMessage);

// ==========================
// 💬 Retrieving Conversations
// ==========================

// GET /api/messages/conversations - Recent conversations
router.get('/conversations', messageController.getRecentConversations);

// GET /api/messages/user/:userId - Messages with a specific user
router.get('/user/:userId', messageController.getMessages); // 👈 Changed from "/:userId"

// ==========================
// 📥 Reading Messages
// ==========================

// PATCH /api/messages/:id/read - Mark one message as read
router.patch('/:id/read', messageController.markAsRead);

// PATCH /api/messages/read-all/:fromUserId - Mark all from one user as read
router.patch('/read-all/:fromUserId', messageController.markAllFromUserAsRead);

// ==========================
// 🔔 Unread Message Count
// ==========================

// GET /api/messages/unread/count - Get unread message count
router.get('/unread/count', messageController.getUnreadCount);

module.exports = router;
