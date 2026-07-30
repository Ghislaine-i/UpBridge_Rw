const { validationResult } = require('express-validator');
const OpportunityModel = require('../models/opportunityModel');

// GET /api/opportunities  (public — all students can browse)
const getOpportunities = async (req, res) => {
    try {
        const { search, type, category, workMode, page = 1, limit = 9 } = req.query;
        const { opportunities, total } = await OpportunityModel.findAll({
            search, type, category, workMode, page, limit,
        });

        return res.status(200).json({
            success: true,
            data: opportunities,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)) || 1,
            },
        });
    } catch (error) {
        console.error('getOpportunities error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch opportunities.' });
    }
};

// GET /api/opportunities/categories
const getCategories = async (req, res) => {
    try {
        const categories = await OpportunityModel.getCategories();
        return res.status(200).json({ success: true, data: ['All', ...categories] });
    } catch (error) {
        console.error('getCategories error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch categories.' });
    }
};

// GET /api/opportunities/:id  (public)
const getOpportunityById = async (req, res) => {
    try {
        const opportunity = await OpportunityModel.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ success: false, message: 'Opportunity not found.' });
        }
        return res.status(200).json({ success: true, data: opportunity });
    } catch (error) {
        console.error('getOpportunityById error:', error);
        return res.status(500).json({ success: false, message: 'Could not fetch opportunity.' });
    }
};

// POST /api/opportunities  (admin only)
const createOpportunity = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const {
            title, companyName, companyLogoUrl, type, location,
            workMode, description, requirements, salaryRange, category, deadline,
        } = req.body;

        const id = await OpportunityModel.create({
            title,
            companyName,
            companyLogoUrl: companyLogoUrl || null,
            type: type || 'job',
            location: location || null,
            workMode: workMode || 'onsite',
            description,
            requirements: requirements || null,
            salaryRange: salaryRange || null,
            category: category || null,
            deadline: deadline || null,
            postedBy: req.user.id,
        });

        const opportunity = await OpportunityModel.findById(id);
        return res.status(201).json({ success: true, message: 'Opportunity posted.', data: opportunity });
    } catch (error) {
        console.error('createOpportunity error:', error);
        return res.status(500).json({ success: false, message: 'Could not create opportunity.' });
    }
};

// PUT /api/opportunities/:id  (admin only)
const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await OpportunityModel.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ success: false, message: 'Opportunity not found.' });
        }

        const fieldMap = {
            title: req.body.title,
            company_name: req.body.companyName,
            company_logo_url: req.body.companyLogoUrl,
            type: req.body.type,
            location: req.body.location,
            work_mode: req.body.workMode,
            description: req.body.description,
            requirements: req.body.requirements,
            salary_range: req.body.salaryRange,
            category: req.body.category,
            deadline: req.body.deadline,
            is_active: req.body.isActive,
        };
        const fields = Object.fromEntries(Object.entries(fieldMap).filter(([, v]) => v !== undefined));

        await OpportunityModel.update(req.params.id, fields);
        const updated = await OpportunityModel.findById(req.params.id);
        return res.status(200).json({ success: true, message: 'Opportunity updated.', data: updated });
    } catch (error) {
        console.error('updateOpportunity error:', error);
        return res.status(500).json({ success: false, message: 'Could not update opportunity.' });
    }
};

// DELETE /api/opportunities/:id  (admin only — soft delete)
const deleteOpportunity = async (req, res) => {
    try {
        const deactivated = await OpportunityModel.deactivate(req.params.id);
        if (!deactivated) {
            return res.status(404).json({ success: false, message: 'Opportunity not found.' });
        }
        return res.status(200).json({ success: true, message: 'Opportunity removed.' });
    } catch (error) {
        console.error('deleteOpportunity error:', error);
        return res.status(500).json({ success: false, message: 'Could not remove opportunity.' });
    }
};

module.exports = {
    getOpportunities,
    getCategories,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
};
