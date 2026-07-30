const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const UserModel = require('../models/userModel');

const SALT_ROUNDS = 10;

// GET /api/profile
const getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('getProfile error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch profile.' });
    }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { fullName, headline, bio, phone, location, avatarUrl } = req.body;

        // Map camelCase fields to DB snake_case column names
        const fields = {};
        if (fullName !== undefined) fields.full_name = fullName;
        if (headline !== undefined) fields.headline = headline;
        if (bio !== undefined) fields.bio = bio;
        if (phone !== undefined) fields.phone = phone;
        if (location !== undefined) fields.location = location;
        if (avatarUrl !== undefined) fields.avatar_url = avatarUrl;

        await UserModel.updateProfile(req.user.id, fields);
        const updated = await UserModel.findById(req.user.id);

        return res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updated });
    } catch (error) {
        console.error('updateProfile error:', error);
        return res.status(500).json({ success: false, message: 'Could not update profile.' });
    }
};

// PUT /api/profile/password
const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;

        // Fetch full user row (including password_hash)
        const [rows] = await require('../config/db').pool.query(
            `SELECT * FROM users WHERE id = :id LIMIT 1`,
            { id: req.user.id }
        );
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }

        const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await require('../config/db').pool.query(
            `UPDATE users SET password_hash = :hash WHERE id = :id`,
            { hash: newHash, id: req.user.id }
        );

        return res.status(200).json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        console.error('changePassword error:', error);
        return res.status(500).json({ success: false, message: 'Could not change password.' });
    }
};

module.exports = { getProfile, updateProfile, changePassword };
