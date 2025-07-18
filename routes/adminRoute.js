const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllJobs,
  getAllApplications,
  deleteUserByAdmin,
  deleteJobByAdmin,
  getDashboardStats
} = require('../controllers/adminController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/isAdmin');

// @route   GET /api/admin/users
router.get('/users', authMiddleware, isAdmin, getAllUsers);

// @route   GET /api/admin/jobs
router.get('/jobs', authMiddleware, isAdmin, getAllJobs);

// @route   GET /api/admin/applications
router.get('/applications', authMiddleware, isAdmin, getAllApplications);

// @route   DELETE /api/admin/user/:id
router.delete('/user/:id', authMiddleware, isAdmin, deleteUserByAdmin);

// @route   DELETE /api/admin/job/:id
router.delete('/job/:id', authMiddleware, isAdmin, deleteJobByAdmin);

// @route   GET /api/admin/dashboard-stats
router.get('/dashboard-stats', authMiddleware, isAdmin, getDashboardStats);

module.exports = router;
