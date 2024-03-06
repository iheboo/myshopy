const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const { authorization,verifyToken } = require('../config/jwt');

// Public routes (accessible without token)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
// Logout route
router.post('/logout', verifyToken, userController.logoutUser);


// Get user credit statistics for the admin dashboard
router.get('/admin/user-credit/statistics', verifyToken, authorization('admin'), userController.getUserCreditStatistics);


// Protected routes (require token and authorization)
router.use(verifyToken);

module.exports = router;
