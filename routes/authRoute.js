const express = require('express');
// const { createUser, userList, deleteUser, updateUser } = require('../controllers/userController');
// const { signUp, login, authCheck, logout } = require('../controllers/authController');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const authRoute = express.Router();

// router.get('/all-user', authMiddleware ,userList);
// router.get('/check-Auth',authMiddleware,authCheck)
// router.get ('/logout',authMiddleware,logout)

// router.post('/register',signUp);
// router.post('/login',login);
// router.post('/create', authMiddleware, createUser);

// router.delete('/delete/:id', authMiddleware,deleteUser)
// router.put('/update/:id', authMiddleware,updateUser)

//this below routes for job-portal

// const express = require('express');
// const router = express.Router();




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

module.exports = authRoute;
