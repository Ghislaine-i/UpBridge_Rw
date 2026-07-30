const express = require('express');
const router = express.Router();

const {
    getMyProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');
const { projectValidator } = require('../middleware/validators/projectValidators');

// All portfolio routes require authentication
router.use(protect);

router.get('/', getMyProjects);
router.get('/:id', getProjectById);
router.post('/', projectValidator, createProject);
router.put('/:id', projectValidator, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
