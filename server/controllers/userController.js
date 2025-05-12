// controllers/userController.js
const User = require('../models/user');

// controllers/userController.js

exports.getMe = async (req, res) => {
  // console.log('this the current user Id',req.user._id); // Log the user ID
  try {
    const user = await User.findById(req.user._id).select('profile skillsOffered skillsWanted name premiumTokenBalance ');
    // console.log('User Logined:', user); // Log the user object

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    // console.log('User found:', user); // Log the user object
    // console.log('User found:', user); // Log the user object
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user data',
    });
  }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getSkillMatches = async (req, res) => {
  console.log('Fetching skill matches for user:', req.user.id);

  try {
    // ✅ Fetch the current user with profile info
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'Current user not found',
      });
    }

    const currentUserId = currentUser._id;

    // ✅ Extract skills from profile
    const userSkillsOffered = currentUser.profile.skillsOffered || [];
    const userSkillsWanted = currentUser.profile.skillsWanted || [];

    console.log('User Offers:', userSkillsOffered);
    console.log('User Wants:', userSkillsWanted);

    // ✅ Find users who offer what this user wants AND want what this user offers
    const matchedUsers = await User.find({
      _id: { $ne: currentUserId }, // exclude self
      'profile.skillsOffered': { $in: userSkillsWanted },
      'profile.skillsWanted': { $in: userSkillsOffered },
    });
    console.log('Matched Users:', matchedUsers);
    res.status(200).json({
      status: 'success',
      results: matchedUsers.length,
      data: { matchedUsers },
    });

  } catch (err) {
    console.error('Error in getSkillMatches:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Error finding matches',
      error: err.message,
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('profile');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Error fetching users',
      error: error.message,
    });
  }
};


// @desc    Get user's transaction history
// @route   GET /api/users/transactions
// @access  Private
exports.getTransactionHistory = async (req, res) => {
  console.log('Fetching transaction history for user:', req.user.id); // Log the user ID
  console.log(req.body); // Log the request body
  try {
    const user = await User.findById(req.user.id).select('transactions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sort transactions by most recent
    const sortedTransactions = user.transactions.sort((a, b) => b.date - a.date);

    res.status(200).json({ transactions: sortedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//// TESTING DATA

