const { validationResult } = require('express-validator');
const MentorModel = require('../models/mentorModel');

const formatMentor = (row) => ({
  id: row.id,
  userId: row.user_id,
  fullName: row.full_name,
  email: row.email,
  avatarUrl: row.avatar_url,
  headline: row.headline,
  bio: row.bio,
  location: row.location,
  phone: row.phone,
  expertise: row.expertise,
  company: row.company,
  yearsExperience: row.years_experience,
  linkedinUrl: row.linkedin_url,
  availabilityStatus: row.availability_status,
  rating: Number(row.rating),
  sessionsCompleted: row.sessions_completed,
});

const getMentors = async (req, res) => {
  try {
    const { search, expertise } = req.query;
    const rows = await MentorModel.findAll({ search, expertise });
    return res.status(200).json({ success: true, data: rows.map(formatMentor) });
  } catch (error) {
    console.error('getMentors error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch mentors.' });
  }
};

const getExpertiseList = async (req, res) => {
  try {
    const list = await MentorModel.getExpertiseList();
    return res.status(200).json({ success: true, data: ['All', ...list] });
  } catch (error) {
    console.error('getExpertiseList error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch expertise list.' });
  }
};

const getMentorById = async (req, res) => {
  try {
    const mentor = await MentorModel.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found.' });
    }
    return res.status(200).json({ success: true, data: formatMentor(mentor) });
  } catch (error) {
    console.error('getMentorById error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch mentor.' });
  }
};

module.exports = { getMentors, getExpertiseList, getMentorById };
