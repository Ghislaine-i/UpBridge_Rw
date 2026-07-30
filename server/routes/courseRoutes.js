const express = require('express');
const router = express.Router();

const {
  getCourses,
  getCategories,
  getCourseById,
  getMyRecentCourses,
  continueCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const { courseValidator } = require('../middleware/validators/courseValidators');

// Public
router.get('/', getCourses);
router.get('/categories', getCategories);

// Student (authenticated) – must come BEFORE '/:id' so 'my-recent' is not treated as an id
router.get('/my-recent', protect, getMyRecentCourses);
router.get('/:id', optionalAuth, getCourseById);

// Student (authenticated)
router.post('/:id/continue', protect, continueCourse);

// Admin only
router.post('/', protect, authorize('admin'), courseValidator, createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;
