const { body } = require('express-validator');

const projectValidator = [
    body('title').trim().notEmpty().withMessage('Project title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('githubLink')
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('GitHub link must be a valid URL.'),
    body('liveDemoLink')
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('Live demo link must be a valid URL.'),
    body('technologiesUsed')
        .optional()
        .isString()
        .withMessage('Technologies must be a comma-separated string.'),
    body('coverImageUrl')
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('Cover image must be a valid URL.'),
];

module.exports = { projectValidator };
