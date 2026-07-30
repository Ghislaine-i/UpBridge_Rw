const { pool } = require('../config/db');

const OpportunityModel = {
    /** Paginated list of active opportunities with optional filters. */
    async findAll({ search, type, category, workMode, page = 1, limit = 9 } = {}) {
        let query = `SELECT * FROM opportunities WHERE is_active = TRUE`;
        let countQuery = `SELECT COUNT(*) AS total FROM opportunities WHERE is_active = TRUE`;
        const params = {};

        if (search) {
            const clause = ` AND (title LIKE :search OR company_name LIKE :search OR description LIKE :search)`;
            query += clause;
            countQuery += clause;
            params.search = `%${search}%`;
        }
        if (type && type !== 'all') {
            query += ` AND type = :type`;
            countQuery += ` AND type = :type`;
            params.type = type;
        }
        if (category && category !== 'All') {
            query += ` AND category = :category`;
            countQuery += ` AND category = :category`;
            params.category = category;
        }
        if (workMode && workMode !== 'all') {
            query += ` AND work_mode = :workMode`;
            countQuery += ` AND work_mode = :workMode`;
            params.workMode = workMode;
        }

        const offset = (Number(page) - 1) * Number(limit);
        query += ` ORDER BY created_at DESC LIMIT :limit OFFSET :offset`;

        const [rows] = await pool.query(query, { ...params, limit: Number(limit), offset });
        const [countRows] = await pool.query(countQuery, params);

        return { opportunities: rows, total: countRows[0].total };
    },

    /** Single opportunity by id. */
    async findById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM opportunities WHERE id = :id LIMIT 1`,
            { id }
        );
        return rows[0] || null;
    },

    /** Distinct categories for filter UI. */
    async getCategories() {
        const [rows] = await pool.query(
            `SELECT DISTINCT category FROM opportunities WHERE is_active = TRUE AND category IS NOT NULL ORDER BY category ASC`
        );
        return rows.map((r) => r.category);
    },

    /** Create a new opportunity. */
    async create(data) {
        const [result] = await pool.query(
            `INSERT INTO opportunities
         (title, company_name, company_logo_url, type, location, work_mode,
          description, requirements, salary_range, category, deadline, posted_by)
       VALUES
         (:title, :companyName, :companyLogoUrl, :type, :location, :workMode,
          :description, :requirements, :salaryRange, :category, :deadline, :postedBy)`,
            data
        );
        return result.insertId;
    },

    /** Update an opportunity. */
    async update(id, fields) {
        const allowed = [
            'title', 'company_name', 'company_logo_url', 'type', 'location',
            'work_mode', 'description', 'requirements', 'salary_range',
            'category', 'deadline', 'is_active',
        ];
        const updates = Object.keys(fields).filter((k) => allowed.includes(k));
        if (updates.length === 0) return false;

        const setClause = updates.map((k) => `${k} = :${k}`).join(', ');
        await pool.query(`UPDATE opportunities SET ${setClause} WHERE id = :id`, { ...fields, id });
        return true;
    },

    /** Soft-delete (deactivate) an opportunity. */
    async deactivate(id) {
        const [result] = await pool.query(
            `UPDATE opportunities SET is_active = FALSE WHERE id = :id`,
            { id }
        );
        return result.affectedRows > 0;
    },
};

module.exports = OpportunityModel;
