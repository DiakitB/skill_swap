// controllers/skillsController.js
const User = require('../models/user'); // Adjust based on your structure

// Get all unique skills offered
// Get all unique skills offered along with user names
exports.getAvailableSkills = async (req, res) => {
    console.log("Fetching available skills...");
    try {
      // Fetch name, _id, and profile.skillsOffered for each user
      const users = await User.find({}, "name _id profile.skillsOffered");
      console.log("Users fetched:", users);
  
      const skillsWithUsers = users.flatMap(user =>
        user.profile.skillsOffered.map(skill => ({
          skill,
          userName: user.name,
          userId: user._id  // Include user ID here
        }))
      );
  
      res.json({ skills: skillsWithUsers });
    } catch (err) {
      console.error("Error fetching available skills:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
  

// Get users by skill
exports.getUsersBySkill = async (req, res) => {
  const skill = req.params.skill;
  try {
    const users = await User.find(
      { skillsOffered: skill },
      'username bio skillsOffered skillsWanted'
    );
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

