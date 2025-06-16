const express = require('express');
const router = express.Router();


const { authMiddleware } = require('../middleware/authMiddleware');
const { getAllUsers, getUserById, updateUserById, deleteUserById, getSavedJobs, saveJob } = require('../controllers/userController');
const { isAdmin } = require('../middleware/isAdmin');

// @route   GET /api/users/ -> Admin only
router.get('/', authMiddleware, isAdmin, getAllUsers);

// @route   GET /api/users/:id -> User details
router.get('/:id', authMiddleware, getUserById);

// @route   PUT /api/users/:id -> Update user profile
router.put('/:id', authMiddleware, updateUserById);

// @route   DELETE /api/users/:id -> Delete user (admin or owner)
router.delete('/:id', authMiddleware, deleteUserById);

// @route   GET /api/users/:id/saved -> Get saved jobs of user
router.get('/:id/saved', authMiddleware, getSavedJobs);

// @route   POST /api/users/:id/save/:jobId -> Save a job
router.post('/:id/save/:jobId', authMiddleware, saveJob);

module.exports = router;
