const { body } = require('express-validator');

const applyValidator = [
    body('opportunityId')
        .notEmpty()
        .isInt({ gt: 0 })
        .withMessage('A valid opportunity ID is required.'),
    body('coverNote')
        .optional()
        .isString()
        .isLength({ max: 1000 })
        .withMessage('Cover note must be at most 1000 characters.'),
    body('resumeUrl')
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('Resume URL must be a valid URL.'),
];

const statusValidator = [
    body('status')
        .isIn(['submitted', 'under_review', 'shortlisted', 'rejected', 'accepted'])
        .withMessage('Invalid status value.'),
];

module.exports = { applyValidator, statusValidator };
