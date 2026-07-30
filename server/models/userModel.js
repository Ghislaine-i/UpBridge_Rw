const { pool } = require('../config/db');

const UserModel = {
  async create({ fullName, email, passwordHash, role = 'student' }) {
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role) VALUES (:fullName, :email, :passwordHash, :role)`,
      { fullName, email, passwordHash, role }
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = :email LIMIT 1`, { email });
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, role, avatar_url, headline, bio, phone, location, is_active, created_at
       FROM users WHERE id = :id LIMIT 1`,
      { id }
    );
    return rows[0] || null;
  },

  async updateProfile(id, fields) {
    const allowed = ['full_name', 'headline', 'bio', 'phone', 'location', 'avatar_url'];
    const updates = Object.keys(fields).filter((key) => allowed.includes(key));
    if (updates.length === 0) return false;

    const setClause = updates.map((key) => `${key} = :${key}`).join(', ');
    await pool.query(`UPDATE users SET ${setClause} WHERE id = :id`, { ...fields, id });
    return true;
  },

  async findAll({ role, search } = {}) {
    let query = `SELECT id, full_name, email, role, is_active, created_at FROM users WHERE 1=1`;
    const params = {};
    if (role) {
      query += ` AND role = :role`;
      params.role = role;
    }
    if (search) {
      query += ` AND (full_name LIKE :search OR email LIKE :search)`;
      params.search = `%${search}%`;
    }
    query += ` ORDER BY created_at DESC`;
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async deleteById(id) {
    const [result] = await pool.query(`DELETE FROM users WHERE id = :id`, { id });
    return result.affectedRows > 0;
  },

  async setActive(id, isActive) {
    await pool.query(`UPDATE users SET is_active = :isActive WHERE id = :id`, { id, isActive });
  },
};

module.exports = UserModel;
