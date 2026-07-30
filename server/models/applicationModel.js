const { pool } = require('../config/db');

const ApplicationModel = {
    /** Get all applications for a student, with opportunity details. */
    async findByUser(userId) {
        const [rows] = await pool.query(
            `SELECT a.*, o.title AS opportunity_title, o.company_name, o.type, o.location, o.work_mode
       FROM applications a
       JOIN opportunities o ON o.id = a.opportunity_id
       WHERE a.user_id = :userId
       ORDER BY a.applied_at DESC`,
            { userId }
        );
        return rows;
    },

    /** Check if a student already applied to an opportunity. */
    async findByUserAndOpportunity(userId, opportunityId) {
        const [rows] = await pool.query(
            `SELECT * FROM applications WHERE user_id = :userId AND opportunity_id = :opportunityId LIMIT 1`,
            { userId, opportunityId }
        );
        return rows[0] || null;
    },

    /** Single application by id. */
    async findById(id) {
        const [rows] = await pool.query(
            `SELECT a.*, o.title AS opportunity_title, o.company_name, o.type
       FROM applications a
       JOIN opportunities o ON o.id = a.opportunity_id
       WHERE a.id = :id LIMIT 1`,
            { id }
        );
        return rows[0] || null;
    },

    /** Create a new application. */
    async create({ userId, opportunityId, coverNote, resumeUrl }) {
        const [result] = await pool.query(
            `INSERT INTO applications (user_id, opportunity_id, cover_note, resume_url)
       VALUES (:userId, :opportunityId, :coverNote, :resumeUrl)`,
            { userId, opportunityId, coverNote, resumeUrl }
        );
        return result.insertId;
    },

    /** Admin: list all applications (optionally filtered by status or opportunity). */
    async findAll({ status, opportunityId } = {}) {
        let query = `
      SELECT a.*, u.full_name AS student_name, u.email AS student_email,
             o.title AS opportunity_title, o.company_name
      FROM applications a
      JOIN users u ON u.id = a.user_id
      JOIN opportunities o ON o.id = a.opportunity_id
      WHERE 1=1`;
        const params = {};

        if (status) {
            query += ` AND a.status = :status`;
            params.status = status;
        }
        if (opportunityId) {
            query += ` AND a.opportunity_id = :opportunityId`;
            params.opportunityId = opportunityId;
        }

        query += ` ORDER BY a.applied_at DESC`;
        const [rows] = await pool.query(query, params);
        return rows;
    },

    /** Update the status of an application (admin only). */
    async updateStatus(id, status) {
        const [result] = await pool.query(
            `UPDATE applications SET status = :status WHERE id = :id`,
            { id, status }
        );
        return result.affectedRows > 0;
    },

    /** Withdraw an application (student only). */
    async deleteById(id) {
        const [result] = await pool.query(
            `DELETE FROM applications WHERE id = :id`,
            { id }
        );
        return result.affectedRows > 0;
    },
};

module.exports = ApplicationModel;
