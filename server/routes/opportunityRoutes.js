const express = require('express');
const router = express.Router();

const {
    getOpportunities,
    getCategories,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { opportunityValidator } = require('../middleware/validators/opportunityValidators');

// Public
router.get('/', getOpportunities);
router.get('/categories', getCategories);
router.get('/:id', getOpportunityById);

// Admin only
router.post('/', protect, authorize('admin'), opportunityValidator, createOpportunity);
router.put('/:id', protect, authorize('admin'), updateOpportunity);
router.delete('/:id', protect, authorize('admin'), deleteOpportunity);

module.exports = router;
