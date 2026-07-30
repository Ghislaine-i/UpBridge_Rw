const { body } = require('express-validator');

const updateProfileValidator = [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty.'),
    body('headline').optional().trim().isLength({ max: 255 }).withMessage('Headline is too long.'),
    body('bio').optional().trim().isLength({ max: 2000 }).withMessage('Bio is too long.'),
    body('phone').optional().trim().isLength({ max: 30 }).withMessage('Phone number is too long.'),
    body('location').optional().trim().isLength({ max: 150 }).withMessage('Location is too long.'),
    body('avatarUrl')
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('Avatar URL must be a valid URL.'),
];

const changePasswordValidator = [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters.'),
];

module.exports = { updateProfileValidator, changePasswordValidator };
