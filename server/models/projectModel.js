const { pool } = require('../config/db');

const ProjectModel = {
    /** Return all projects for a given user, newest first. */
    async findByUser(userId) {
        const [rows] = await pool.query(
            `SELECT * FROM projects WHERE user_id = :userId ORDER BY created_at DESC`,
            { userId }
        );
        return rows;
    },

    /** Return a single project by id. */
    async findById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM projects WHERE id = :id LIMIT 1`,
            { id }
        );
        return rows[0] || null;
    },

    /** Create a new project and return its insertId. */
    async create({ userId, title, description, githubLink, liveDemoLink, technologiesUsed, coverImageUrl }) {
        const [result] = await pool.query(
            `INSERT INTO projects
         (user_id, title, description, github_link, live_demo_link, technologies_used, cover_image_url)
       VALUES
         (:userId, :title, :description, :githubLink, :liveDemoLink, :technologiesUsed, :coverImageUrl)`,
            { userId, title, description, githubLink, liveDemoLink, technologiesUsed, coverImageUrl }
        );
        return result.insertId;
    },

    /** Update allowed fields on a project row. */
    async update(id, fields) {
        const allowed = [
            'title', 'description', 'github_link', 'live_demo_link',
            'technologies_used', 'cover_image_url',
        ];
        const updates = Object.keys(fields).filter((k) => allowed.includes(k));
        if (updates.length === 0) return false;

        const setClause = updates.map((k) => `${k} = :${k}`).join(', ');
        await pool.query(
            `UPDATE projects SET ${setClause} WHERE id = :id`,
            { ...fields, id }
        );
        return true;
    },

    /** Delete a project by id, return true if a row was removed. */
    async deleteById(id) {
        const [result] = await pool.query(
            `DELETE FROM projects WHERE id = :id`,
            { id }
        );
        return result.affectedRows > 0;
    },
};

module.exports = ProjectModel;
