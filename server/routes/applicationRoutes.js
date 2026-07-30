const express = require('express');
const router = express.Router();

const {
    getMyApplications,
    applyToOpportunity,
    withdrawApplication,
    getAllApplications,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { applyValidator, statusValidator } = require('../middleware/validators/applicationValidators');

// All application routes require authentication
router.use(protect);

// Student routes
router.get('/', getMyApplications);
router.post('/', applyValidator, applyToOpportunity);
router.delete('/:id', withdrawApplication);

// Admin routes
router.get('/admin', authorize('admin'), getAllApplications);
router.patch('/:id/status', authorize('admin'), statusValidator, updateApplicationStatus);

module.exports = router;
