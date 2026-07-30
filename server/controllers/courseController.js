const { validationResult } = require('express-validator');
const CourseModel = require('../models/courseModel');

// GET /api/courses  (public list, with search/filter/pagination)
const getCourses = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 9 } = req.query;
    const { courses, total } = await CourseModel.findAll({ search, category, level, page, limit });

    return res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (error) {
    console.error('getCourses error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch courses.' });
  }
};

// GET /api/courses/categories
const getCategories = async (req, res) => {
  try {
    const categories = await CourseModel.getCategories();
    return res.status(200).json({ success: true, data: ['All', ...categories] });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch categories.' });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    let enrollment = null;
    if (req.user) {
      enrollment = await CourseModel.getEnrollment(req.user.id, course.id);
    }

    return res.status(200).json({ success: true, data: { ...course, enrollment } });
  } catch (error) {
    console.error('getCourseById error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch course.' });
  }
};

// GET /api/courses/my-recent  (authenticated) — returns student's enrolled courses
const getMyRecentCourses = async (req, res) => {
  try {
    const rows = await CourseModel.getRecentForUser(req.user.id, 10);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('getMyRecentCourses error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch your courses.' });
  }
};

// POST /api/courses/:id/continue  (enroll if needed, bump progress)
const continueCourse = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    await CourseModel.enroll(req.user.id, course.id);

    const enrollment = await CourseModel.getEnrollment(req.user.id, course.id);
    const nextProgress = Math.min((enrollment?.progress_percent || 0) + 10, 100);
    await CourseModel.updateProgress(req.user.id, course.id, nextProgress);

    return res.status(200).json({ success: true, message: 'Progress updated.', progressPercent: nextProgress });
  } catch (error) {
    console.error('continueCourse error:', error);
    return res.status(500).json({ success: false, message: 'Could not update course progress.' });
  }
};

// POST /api/courses  (admin only)
const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, category, level, instructorName, durationHours, thumbnailUrl } = req.body;
    const id = await CourseModel.create({
      title,
      description,
      category,
      level: level || 'Beginner',
      instructorName: instructorName || null,
      durationHours: durationHours || 0,
      thumbnailUrl: thumbnailUrl || null,
      createdBy: req.user.id,
    });

    const course = await CourseModel.findById(id);
    return res.status(201).json({ success: true, message: 'Course created.', data: course });
  } catch (error) {
    console.error('createCourse error:', error);
    return res.status(500).json({ success: false, message: 'Could not create course.' });
  }
};

// PUT /api/courses/:id  (admin only)
const updateCourse = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const fieldMap = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      level: req.body.level,
      instructor_name: req.body.instructorName,
      duration_hours: req.body.durationHours,
      thumbnail_url: req.body.thumbnailUrl,
      is_published: req.body.isPublished,
    };
    const fields = Object.fromEntries(Object.entries(fieldMap).filter(([, v]) => v !== undefined));

    await CourseModel.update(req.params.id, fields);
    const updated = await CourseModel.findById(req.params.id);
    return res.status(200).json({ success: true, message: 'Course updated.', data: updated });
  } catch (error) {
    console.error('updateCourse error:', error);
    return res.status(500).json({ success: false, message: 'Could not update course.' });
  }
};

// DELETE /api/courses/:id  (admin only)
const deleteCourse = async (req, res) => {
  try {
    const deleted = await CourseModel.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    return res.status(200).json({ success: true, message: 'Course deleted.' });
  } catch (error) {
    console.error('deleteCourse error:', error);
    return res.status(500).json({ success: false, message: 'Could not delete course.' });
  }
};

module.exports = {
  getCourses,
  getCategories,
  getCourseById,
  getMyRecentCourses,
  continueCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
