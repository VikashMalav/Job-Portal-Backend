const express = require('express');
const router = express.Router();
const {
  getMyJobs,
  postNewJob,
  updateJob,
  deleteJob,
  getJobApplications,
  getDashboardStatsForEmployer
} = require('../controllers/employerController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { isEmployerOrAdmin } = require('../middleware/authAdminEmployer');

// @route   GET /api/employer/dashboard-stats?employerId=...
router.get('/dashboard-stats', authMiddleware, isEmployerOrAdmin, getDashboardStatsForEmployer);

// @route   GET /api/employer/jobs -> Employer's posted jobs
router.get('/jobs', authMiddleware, isEmployerOrAdmin, getMyJobs);

// @route   POST /api/employer/jobs -> Post a new job
router.post('/jobs', authMiddleware, isEmployerOrAdmin, postNewJob);

// @route   PUT /api/employer/jobs/:id -> Update job
router.put('/jobs/:id', authMiddleware, isEmployerOrAdmin, updateJob);

// @route   DELETE /api/employer/jobs/:id -> Delete job
router.delete('/jobs/:id', authMiddleware, isEmployerOrAdmin, deleteJob);

// @route   GET /api/employer/applications/:jobId -> View applicants for job
router.get('/applications/:jobId', authMiddleware, isEmployerOrAdmin, getJobApplications);

module.exports = router;
