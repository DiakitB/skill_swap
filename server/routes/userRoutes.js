// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authController= require('../controllers/authController');
const router = express.Router();

router.get('/me', authController.protect, userController.getMe);
router.get('/skill-matches', authController.protect, userController.getSkillMatches);
router.get('/transactions', authController.protect, userController.getTransactionHistory);


module.exports = router;


// http://localhost:3000/api/user/skill-matches





