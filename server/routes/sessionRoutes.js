const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const protect = require('../routes/authRoutes')


router.post('/confirm-session', protect, sessionController.confirmSession);
router.post('/book', protect, sessionController.bookSession);

module.exports = router;
