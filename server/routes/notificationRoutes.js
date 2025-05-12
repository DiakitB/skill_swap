const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { protect } = require('../controllers/authController');
const { getNotifications, getUnreadCount, markAllAsRead } = require('../controllers/notificationController');

// Get all notifications for logged-in user
router.get('/', protect, getNotifications); 
router.get('/unread-count', protect, getUnreadCount);
router.patch('/mark-all-read', protect, markAllAsRead);

module.exports = router;
