const { validationResult } = require('express-validator');
const MentorModel = require('../models/mentorModel');
const MentorshipSessionModel = require('../models/mentorshipSessionModel');

const formatSession = (row) => ({
  id: row.id,
  studentId: row.student_id,
  mentorId: row.mentor_id,
  topic: row.topic,
  scheduledAt: row.scheduled_at,
  durationMinutes: row.duration_minutes,
  status: row.status,
  meetingLink: row.meeting_link,
  notes: row.notes,
  mentorName: row.mentor_name,
  studentName: row.student_name,
  studentEmail: row.student_email,
  expertise: row.expertise,
  company: row.company,
  createdAt: row.created_at,
});

const getMySessions = async (req, res) => {
  try {
    let sessions;
    if (req.user.role === 'mentor') {
      sessions = await MentorshipSessionModel.findByMentorUserId(req.user.id);
    } else {
      sessions = await MentorshipSessionModel.findByStudent(req.user.id);
    }
    return res.status(200).json({ success: true, data: sessions.map(formatSession) });
  } catch (error) {
    console.error('getMySessions error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch sessions.' });
  }
};

const bookSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { mentorId, topic, scheduledAt, durationMinutes } = req.body;
    const mentor = await MentorModel.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found.' });
    }
    if (mentor.availability_status === 'unavailable') {
      return res.status(400).json({ success: false, message: 'This mentor is not available for sessions.' });
    }

    const id = await MentorshipSessionModel.create({
      studentId: req.user.id,
      mentorId,
      topic: topic || null,
      scheduledAt,
      durationMinutes,
    });

    const session = await MentorshipSessionModel.findById(id);
    return res.status(201).json({
      success: true,
      message: 'Session booked successfully.',
      data: formatSession({ ...session, mentor_name: mentor.full_name, expertise: mentor.expertise, company: mentor.company }),
    });
  } catch (error) {
    console.error('bookSession error:', error);
    return res.status(500).json({ success: false, message: 'Could not book session.' });
  }
};

const updateSessionStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const session = await MentorshipSessionModel.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const isMentor = req.user.role === 'mentor' && session.mentor_user_id === req.user.id;
    const isStudent = session.student_id === req.user.id;
    if (!isMentor && !isStudent && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You do not have permission to update this session.' });
    }

    await MentorshipSessionModel.updateStatus(req.params.id, req.body.status, req.body.meetingLink);
    const updated = await MentorshipSessionModel.findById(req.params.id);
    return res.status(200).json({ success: true, message: 'Session updated.', data: formatSession(updated) });
  } catch (error) {
    console.error('updateSessionStatus error:', error);
    return res.status(500).json({ success: false, message: 'Could not update session.' });
  }
};

module.exports = { getMySessions, bookSession, updateSessionStatus };
