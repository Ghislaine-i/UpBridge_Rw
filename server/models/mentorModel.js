const { pool } = require('../config/db');

const MentorModel = {
  async findAll({ search, expertise } = {}) {
    let query = `
      SELECT m.*, u.full_name, u.email, u.avatar_url, u.headline, u.bio, u.location
      FROM mentors m
      JOIN users u ON u.id = m.user_id
      WHERE u.is_active = TRUE`;
    const params = {};

    if (search) {
      query += ` AND (u.full_name LIKE :search OR m.expertise LIKE :search OR m.company LIKE :search)`;
      params.search = `%${search}%`;
    }
    if (expertise && expertise !== 'All') {
      query += ` AND m.expertise LIKE :expertise`;
      params.expertise = `%${expertise}%`;
    }

    query += ` ORDER BY m.rating DESC, m.sessions_completed DESC`;
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.*, u.full_name, u.email, u.avatar_url, u.headline, u.bio, u.location, u.phone
       FROM mentors m
       JOIN users u ON u.id = m.user_id
       WHERE m.id = :id LIMIT 1`,
      { id }
    );
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM mentors WHERE user_id = :userId LIMIT 1`,
      { userId }
    );
    return rows[0] || null;
  },

  async create({ userId, expertise, company, yearsExperience, linkedinUrl }) {
    const [result] = await pool.query(
      `INSERT INTO mentors (user_id, expertise, company, years_experience, linkedin_url)
       VALUES (:userId, :expertise, :company, :yearsExperience, :linkedinUrl)`,
      {
        userId,
        expertise,
        company: company || null,
        yearsExperience: yearsExperience || 0,
        linkedinUrl: linkedinUrl || null,
      }
    );
    return result.insertId;
  },

  async getExpertiseList() {
    const [rows] = await pool.query(
      `SELECT DISTINCT expertise FROM mentors ORDER BY expertise ASC`
    );
    return rows.map((r) => r.expertise);
  },
};

module.exports = MentorModel;
