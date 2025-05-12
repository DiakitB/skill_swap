// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require('../models/user'); // Ensure this path is correct

exports.signup = async (req, res) => {

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "There is an account associated with this email.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );
    
    // Send the response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser._id,
      token,
    });
    // console.log(token)
    // console.log(newUser)
  } catch (error) {
    // console.error("Error during signup:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during signup. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  // console.log('Request Body:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: "User not found" });
    }
    // console.log('User Found:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log('Password Match:', isMatch);
    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // console.log('Generated Token:', token);

    res.status(200).json({ token, userId: user._id });
    console.log('Login successful:', { token, userId: user._id });
    // console.log('Response Sent:', { token, userId: user._id });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
   console.log('Logout request received');
   console.log('Request Headers:', req.headers);
  try {
    // Invalidate the token (if using a token blacklist or similar mechanism)
    res.status(200).json({ message: "Logout successful" });
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.protect = async (req, res, next) => {
  let token;

  // 1) Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //  console.log('Token:', token);
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.',
    });
  }

  try {
    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  console.log('Decoded Token:', decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.userId); // Use decoded.userId\
    // console.log('Current User:', currentUser);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4) Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token or user not authorized',
    });
  }
};


exports.completeProfile = async (req, res) => {
  
  try {
    // console.log('Incoming Data:', req.body); // Log the incoming data

    const {
      userId,
      name,
      skillsOffered,
      skillsWanted,
      socialLinks,
      profilePicture,
      geolocation,
      availability,
    } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (name && typeof name !== 'string') {
      return res.status(400).json({ message: "Invalid name format" });
    }

    if (skillsOffered && !Array.isArray(skillsOffered) && typeof skillsOffered !== 'string') {
      return res.status(400).json({ message: "Invalid skillsOffered format" });
    }

    if (skillsWanted && !Array.isArray(skillsWanted) && typeof skillsWanted !== 'string') {
      return res.status(400).json({ message: "Invalid skillsWanted format" });
    }

    if (availability && typeof availability !== 'string') {
      return res.status(400).json({ message: "Invalid availability format" });
    }

    if (socialLinks) {
      const { facebook, twitter, linkedin } = socialLinks;
      if (
        (facebook && typeof facebook !== 'string') ||
        (twitter && typeof twitter !== 'string') ||
        (linkedin && typeof linkedin !== 'string')
      ) {
        return res.status(400).json({ message: "Invalid socialLinks format" });
      }
    }

    if (geolocation) {
      const { latitude, longitude } = geolocation;
      if (
        (latitude && typeof latitude !== 'number') ||
        (longitude && typeof longitude !== 'number')
      ) {
        return res.status(400).json({ message: "Invalid geolocation format" });
      }
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name.trim();
    if (skillsOffered) {
      user.profile.skillsOffered = Array.isArray(skillsOffered)
        ? skillsOffered.map((skill) => skill.trim())
        : skillsOffered.split(',').map((skill) => skill.trim());
    }
    if (skillsWanted) {
      user.profile.skillsWanted = Array.isArray(skillsWanted)
        ? skillsWanted.map((skill) => skill.trim())
        : skillsWanted.split(',').map((skill) => skill.trim());
    }
    if (socialLinks) {
      user.profile.socialLinks = {
        ...user.profile.socialLinks,
        facebook: socialLinks.facebook?.trim() || user.profile.socialLinks.facebook,
        twitter: socialLinks.twitter?.trim() || user.profile.socialLinks.twitter,
        linkedin: socialLinks.linkedin?.trim() || user.profile.socialLinks.linkedin,
      };
    }
    if (profilePicture) user.profilePicture = profilePicture;

    // Update geolocation if provided
    if (geolocation && geolocation.latitude && geolocation.longitude) {
      user.profile.geolocation = {
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
      };
    }

    // Update availability if provided
    if (availability) {
      user.profile.availability = availability.trim();
    }

    // Mark profile as complete
    user.isProfileComplete = true;

    // Log the updated user object before saving
    // console.log('Updated User Object:', user);

    // Save the updated user
    // console.log('Saving User Object:', user); // Log the user object before saving
    const updatedUser = await user.save();
    // Log the updated user object after saving
    //  console.log('Saved User Object:', updatedUser);

    // Respond with the updated user
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in completeProfile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile" });
  }
};


