const express = require('express');
const router = express.Router();
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companyController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { isEmployerOrAdmin } = require('../middleware/authAdminEmployer');

// @route   GET /api/companies/ -> List all companies
router.get('/', getAllCompanies);

// @route   GET /api/companies/:id -> Get company by ID
router.get('/:id', getCompanyById);

// @route   POST /api/companies/ -> Create new company (employer or admin only)
router.post('/', authMiddleware, isEmployerOrAdmin, createCompany);

// @route   PUT /api/companies/:id -> Update company
router.put('/:id', authMiddleware, isEmployerOrAdmin, updateCompany);

// @route   DELETE /api/companies/:id -> Delete company
router.delete('/:id', authMiddleware, isEmployerOrAdmin, deleteCompany);

module.exports = router;
