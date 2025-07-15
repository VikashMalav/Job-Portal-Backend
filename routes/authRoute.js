const express = require('express');

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const authRoute = express.Router();


// @route   POST /api/auth/register
authRoute.post('/register', registerUser);

// @route   POST /api/auth/login
authRoute.post('/login', loginUser);

// @route   POST /api/auth/logout
authRoute.post('/logout', authMiddleware, logoutUser);

// @route   GET /api/auth/profile
authRoute.get('/profile', authMiddleware, getUserProfile);

// @route   PUT /api/auth/update-profile
authRoute.put('/update-profile', authMiddleware, updateUserProfile);

// @route   PUT /api/auth/change-password
authRoute.put('/change-password', authMiddleware, changePassword);
module.exports = authRoute;
