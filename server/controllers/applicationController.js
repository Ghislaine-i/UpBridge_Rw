const { validationResult } = require('express-validator');
const ApplicationModel = require('../models/applicationModel');
const OpportunityModel = require('../models/opportunityModel');

// GET /api/applications  — student's own applications
const getMyApplications = async (req, res) => {
    try {
        const applications = await ApplicationModel.findByUser(req.user.id);
        return res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error('getMyApplications error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch your applications.' });
    }
};

// POST /api/applications  — student submits an application
const applyToOpportunity = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { opportunityId, coverNote, resumeUrl } = req.body;

        // Verify the opportunity exists and is active
        const opportunity = await OpportunityModel.findById(opportunityId);
        if (!opportunity || !opportunity.is_active) {
            return res.status(404).json({ success: false, message: 'This opportunity is not available.' });
        }

        // Prevent duplicate applications
        const existing = await ApplicationModel.findByUserAndOpportunity(req.user.id, opportunityId);
        if (existing) {
            return res.status(409).json({ success: false, message: 'You have already applied to this opportunity.' });
        }

        const id = await ApplicationModel.create({
            userId: req.user.id,
            opportunityId,
            coverNote: coverNote || null,
            resumeUrl: resumeUrl || null,
        });

        const application = await ApplicationModel.findById(id);
        return res.status(201).json({ success: true, message: 'Application submitted successfully.', data: application });
    } catch (error) {
        console.error('applyToOpportunity error:', error);
        return res.status(500).json({ success: false, message: 'Could not submit your application.' });
    }
};

// DELETE /api/applications/:id  — student withdraws application
const withdrawApplication = async (req, res) => {
    try {
        const application = await ApplicationModel.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }

        if (application.user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You do not have permission to withdraw this application.' });
        }

        // Cannot withdraw an accepted/rejected application
        if (['accepted', 'rejected'].includes(application.status)) {
            return res.status(400).json({ success: false, message: `You cannot withdraw an application that has been ${application.status}.` });
        }

        await ApplicationModel.deleteById(req.params.id);
        return res.status(200).json({ success: true, message: 'Application withdrawn.' });
    } catch (error) {
        console.error('withdrawApplication error:', error);
        return res.status(500).json({ success: false, message: 'Could not withdraw your application.' });
    }
};

// GET /api/applications/admin  — admin sees all applications
const getAllApplications = async (req, res) => {
    try {
        const { status, opportunityId } = req.query;
        const applications = await ApplicationModel.findAll({ status, opportunityId });
        return res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error('getAllApplications error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch applications.' });
    }
};

// PATCH /api/applications/:id/status  — admin updates status
const updateApplicationStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const application = await ApplicationModel.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }

        await ApplicationModel.updateStatus(req.params.id, req.body.status);
        const updated = await ApplicationModel.findById(req.params.id);
        return res.status(200).json({ success: true, message: 'Application status updated.', data: updated });
    } catch (error) {
        console.error('updateApplicationStatus error:', error);
        return res.status(500).json({ success: false, message: 'Could not update application status.' });
    }
};

module.exports = {
    getMyApplications,
    applyToOpportunity,
    withdrawApplication,
    getAllApplications,
    updateApplicationStatus,
};
