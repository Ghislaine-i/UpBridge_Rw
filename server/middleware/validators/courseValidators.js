const { body } = require('express-validator');

const courseValidator = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level.'),
  body('durationHours').optional().isFloat({ min: 0 }).withMessage('Duration must be a positive number.'),
];

module.exports = { courseValidator };
