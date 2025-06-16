const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  searchJobs
} = require('../controllers/jobController');

// @route   GET /api/jobs/search?q=... -> Search jobs by keyword, location, etc.
router.get('/search', searchJobs);

// @route   GET /api/jobs/ -> Get all jobs
router.get('/', getAllJobs);

// @route   GET /api/jobs/:id -> Get job by ID
router.get('/:id', getJobById);


module.exports = router;
