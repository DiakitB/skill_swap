// routes/skills.js
const express = require('express');
const router = express.Router();
const killController = require('../controllers/skillController')

// Route to get all unique skills offered
router.get('/available-skills', killController.getAvailableSkills);

// Route to get users by skill
router.get('/users-by-skill/:skill', killController.getUsersBySkill);

module.exports = router;