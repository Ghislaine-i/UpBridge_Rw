const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getMySessions, bookSession, updateSessionStatus } = require('../controllers/mentorshipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-sessions', protect, getMySessions);

router.post(
    '/book',
    protect,
    [
        body('mentorId').isInt().withMessage('Valid Mentor ID is required'),
        body('scheduledAt').isISO8601().withMessage('Valid date/time is required'),
    ],
    bookSession
);

router.put(
    '/:id/status',
    protect,
    [
        body('status').isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status'),
        body('meetingLink').optional().isURL().withMessage('Must be a valid URL'),
    ],
    updateSessionStatus
);

module.exports = router;
