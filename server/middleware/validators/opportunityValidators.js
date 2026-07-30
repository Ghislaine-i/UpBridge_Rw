const { body } = require('express-validator');

const opportunityValidator = [
    body('title').trim().notEmpty().withMessage('Job title is required.'),
    body('companyName').trim().notEmpty().withMessage('Company name is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('type')
        .optional()
        .isIn(['internship', 'job'])
        .withMessage('Type must be internship or job.'),
    body('workMode')
        .optional()
        .isIn(['onsite', 'remote', 'hybrid'])
        .withMessage('Work mode must be onsite, remote, or hybrid.'),
    body('deadline')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Deadline must be a valid date (YYYY-MM-DD).'),
    body('companyLogoUrl')
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('Company logo must be a valid URL.'),
];

module.exports = { opportunityValidator };
