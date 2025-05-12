const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const tokenController = require('../controllers/tokenController');

router.post('/transfer', authController.protect, tokenController.initiateTokenTransfer);
router.get('/balance', authController.protect, tokenController.getTokenBalance);
router.post('/cashout', authController.protect, tokenController.cashOutTokens);
router.post('/buy-token', authController.protect, tokenController.buyPremiumTokens);

module.exports = router;



