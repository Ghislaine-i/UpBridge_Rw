const express = require('express');
const router = express.Router();
const { getMentors, getExpertiseList, getMentorById } = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMentors);
router.get('/expertise', protect, getExpertiseList);
router.get('/:id', protect, getMentorById);

module.exports = router;
