const { validationResult } = require('express-validator');
const ProjectModel = require('../models/projectModel');

// GET /api/portfolio  — returns the authenticated user's projects
const getMyProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.findByUser(req.user.id);
        return res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error('getMyProjects error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch your projects.' });
    }
};

// GET /api/portfolio/:id
const getProjectById = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        // Only owner or admin may view
        if (project.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You do not have permission to view this project.' });
        }

        return res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error('getProjectById error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch the project.' });
    }
};

// POST /api/portfolio
const createProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, description, githubLink, liveDemoLink, technologiesUsed, coverImageUrl } = req.body;

        const id = await ProjectModel.create({
            userId: req.user.id,
            title,
            description,
            githubLink: githubLink || null,
            liveDemoLink: liveDemoLink || null,
            technologiesUsed: technologiesUsed || null,
            coverImageUrl: coverImageUrl || null,
        });

        const project = await ProjectModel.findById(id);
        return res.status(201).json({ success: true, message: 'Project created.', data: project });
    } catch (error) {
        console.error('createProject error:', error);
        return res.status(500).json({ success: false, message: 'Could not create the project.' });
    }
};

// PUT /api/portfolio/:id
const updateProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const project = await ProjectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        if (project.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You do not have permission to edit this project.' });
        }

        const fieldMap = {
            title: req.body.title,
            description: req.body.description,
            github_link: req.body.githubLink,
            live_demo_link: req.body.liveDemoLink,
            technologies_used: req.body.technologiesUsed,
            cover_image_url: req.body.coverImageUrl,
        };
        const fields = Object.fromEntries(Object.entries(fieldMap).filter(([, v]) => v !== undefined));

        await ProjectModel.update(req.params.id, fields);
        const updated = await ProjectModel.findById(req.params.id);
        return res.status(200).json({ success: true, message: 'Project updated.', data: updated });
    } catch (error) {
        console.error('updateProject error:', error);
        return res.status(500).json({ success: false, message: 'Could not update the project.' });
    }
};

// DELETE /api/portfolio/:id
const deleteProject = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        if (project.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You do not have permission to delete this project.' });
        }

        await ProjectModel.deleteById(req.params.id);
        return res.status(200).json({ success: true, message: 'Project deleted.' });
    } catch (error) {
        console.error('deleteProject error:', error);
        return res.status(500).json({ success: false, message: 'Could not delete the project.' });
    }
};

module.exports = { getMyProjects, getProjectById, createProject, updateProject, deleteProject };
