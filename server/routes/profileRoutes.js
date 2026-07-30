const express = require('express');
const router = express.Router();

const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { updateProfileValidator, changePasswordValidator } = require('../middleware/validators/profileValidators');

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfileValidator, updateProfile);
router.put('/password', changePasswordValidator, changePassword);

module.exports = router;
