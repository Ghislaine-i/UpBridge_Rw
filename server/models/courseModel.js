const { pool } = require('../config/db');

const CourseModel = {
  async findAll({ search, category, level, page = 1, limit = 9 } = {}) {
    let query = `SELECT * FROM courses WHERE is_published = TRUE`;
    let countQuery = `SELECT COUNT(*) AS total FROM courses WHERE is_published = TRUE`;
    const params = {};

    if (search) {
      query += ` AND (title LIKE :search OR description LIKE :search)`;
      countQuery += ` AND (title LIKE :search OR description LIKE :search)`;
      params.search = `%${search}%`;
    }
    if (category && category !== 'All') {
      query += ` AND category = :category`;
      countQuery += ` AND category = :category`;
      params.category = category;
    }
    if (level) {
      query += ` AND level = :level`;
      countQuery += ` AND level = :level`;
      params.level = level;
    }

    const offset = (Number(page) - 1) * Number(limit);
    query += ` ORDER BY created_at DESC LIMIT :limit OFFSET :offset`;

    const [rows] = await pool.query(query, { ...params, limit: Number(limit), offset });
    const [countRows] = await pool.query(countQuery, params);

    return { courses: rows, total: countRows[0].total };
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM courses WHERE id = :id LIMIT 1`, { id });
    return rows[0] || null;
  },

  async getCategories() {
    const [rows] = await pool.query(
      `SELECT DISTINCT category FROM courses WHERE is_published = TRUE ORDER BY category ASC`
    );
    return rows.map((r) => r.category);
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO courses (title, description, category, level, instructor_name, duration_hours, thumbnail_url, created_by)
       VALUES (:title, :description, :category, :level, :instructorName, :durationHours, :thumbnailUrl, :createdBy)`,
      data
    );
    return result.insertId;
  },

  async update(id, fields) {
    const allowed = [
      'title', 'description', 'category', 'level', 'instructor_name',
      'duration_hours', 'thumbnail_url', 'is_published',
    ];
    const updates = Object.keys(fields).filter((key) => allowed.includes(key));
    if (updates.length === 0) return false;

    const setClause = updates.map((key) => `${key} = :${key}`).join(', ');
    await pool.query(`UPDATE courses SET ${setClause} WHERE id = :id`, { ...fields, id });
    return true;
  },

  async deleteById(id) {
    const [result] = await pool.query(`DELETE FROM courses WHERE id = :id`, { id });
    return result.affectedRows > 0;
  },

  // ---- Enrollment / progress ----
  async getEnrollment(userId, courseId) {
    const [rows] = await pool.query(
      `SELECT * FROM course_enrollments WHERE user_id = :userId AND course_id = :courseId LIMIT 1`,
      { userId, courseId }
    );
    return rows[0] || null;
  },

  async enroll(userId, courseId) {
    const existing = await this.getEnrollment(userId, courseId);
    if (existing) return existing.id;

    const [result] = await pool.query(
      `INSERT INTO course_enrollments (user_id, course_id, progress_percent) VALUES (:userId, :courseId, 0)`,
      { userId, courseId }
    );
    await pool.query(`UPDATE courses SET students_enrolled = students_enrolled + 1 WHERE id = :courseId`, { courseId });
    return result.insertId;
  },

  async updateProgress(userId, courseId, progressPercent) {
    const completedAt = progressPercent >= 100 ? new Date() : null;
    await pool.query(
      `UPDATE course_enrollments
       SET progress_percent = :progressPercent, last_accessed = NOW(), completed_at = :completedAt
       WHERE user_id = :userId AND course_id = :courseId`,
      { progressPercent, completedAt, userId, courseId }
    );
  },

  async getRecentForUser(userId, limit = 3) {
    const [rows] = await pool.query(
      `SELECT c.*, ce.progress_percent, ce.last_accessed
       FROM course_enrollments ce
       JOIN courses c ON c.id = ce.course_id
       WHERE ce.user_id = :userId
       ORDER BY ce.last_accessed DESC
       LIMIT :limit`,
      { userId, limit: Number(limit) }
    );
    return rows;
  },
};

module.exports = CourseModel;
