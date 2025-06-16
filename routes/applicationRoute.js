const express = require('express');
const applicationRoute = express.Router();
const {
  applyToJob,
  getUserApplications,
  getApplicationsByJob
} = require('../controllers/applicationController');

const { authMiddleware } = require('../middleware/authMiddleware');

// @route   POST /api/apply/:jobId -> Apply to a job
applicationRoute.post('/apply/:jobId', authMiddleware, applyToJob);

// @route   GET /api/applications/user/:userId -> Get user's job applications
applicationRoute.get('/applications/user/:userId', authMiddleware, getUserApplications);

// @route   GET /api/applications/job/:jobId -> Employer/Admin: get applicants
applicationRoute.get('/applications/job/:jobId', authMiddleware, getApplicationsByJob);

module.exports = applicationRoute;
