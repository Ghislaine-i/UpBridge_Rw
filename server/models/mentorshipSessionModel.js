const { pool } = require('../config/db');

const MentorshipSessionModel = {
  async findByStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT s.*, u.full_name AS mentor_name, m.expertise, m.company
       FROM mentorship_sessions s
       JOIN mentors m ON m.id = s.mentor_id
       JOIN users u ON u.id = m.user_id
       WHERE s.student_id = :studentId
       ORDER BY s.scheduled_at DESC`,
      { studentId }
    );
    return rows;
  },

  async findByMentorUserId(mentorUserId) {
    const [rows] = await pool.query(
      `SELECT s.*, u.full_name AS student_name, u.email AS student_email
       FROM mentorship_sessions s
       JOIN mentors m ON m.id = s.mentor_id
       JOIN users u ON u.id = s.student_id
       WHERE m.user_id = :mentorUserId
       ORDER BY s.scheduled_at DESC`,
      { mentorUserId }
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, m.user_id AS mentor_user_id
       FROM mentorship_sessions s
       JOIN mentors m ON m.id = s.mentor_id
       WHERE s.id = :id LIMIT 1`,
      { id }
    );
    return rows[0] || null;
  },

  async create({ studentId, mentorId, topic, scheduledAt, durationMinutes }) {
    const [result] = await pool.query(
      `INSERT INTO mentorship_sessions (student_id, mentor_id, topic, scheduled_at, duration_minutes)
       VALUES (:studentId, :mentorId, :topic, :scheduledAt, :durationMinutes)`,
      { studentId, mentorId, topic, scheduledAt, durationMinutes: durationMinutes || 30 }
    );
    return result.insertId;
  },

  async updateStatus(id, status, meetingLink) {
    const fields = { status, id };
    let query = `UPDATE mentorship_sessions SET status = :status`;
    if (meetingLink !== undefined) {
      query += `, meeting_link = :meetingLink`;
      fields.meetingLink = meetingLink;
    }
    query += ` WHERE id = :id`;
    await pool.query(query, fields);
  },
};

module.exports = MentorshipSessionModel;
