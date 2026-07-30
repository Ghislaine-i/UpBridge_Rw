const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator } = require('../middleware/validators/authValidators');

// POST /api/register
router.post('/register', registerValidator, register);

// POST /api/login
router.post('/login', loginValidator, login);

// GET /api/me  (protected)
router.get('/me', protect, getMe);

module.exports = router;
