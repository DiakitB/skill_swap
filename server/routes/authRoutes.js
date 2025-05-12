// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/complete-profile', authController.completeProfile);
router.post('/logout', authController.logout);

module.exports = router;

// http://localhost:3000/api/auth/signup


// const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('authToken'); // Clear the token from storage
//       Alert.alert('Success', 'Logout successful');
//       navigation.navigate('Login'); // Redirect to login screen
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Something went wrong during logout');
//     }
//   };