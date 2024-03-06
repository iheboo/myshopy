const express = require('express');
const router = express.Router();
const userController = require('../controllers/Admin');
const { verifyToken, authorization } = require('../config/jwt');

// Create a new user (accessible without authentication)
router.post('/', verifyToken, authorization('admin'), userController.createUser);

// Get all users (admin dashboard - requires 'admin' role)
router.get('/all', verifyToken, authorization('admin'), userController.getAllUsers);

// Get a single user by ID (admin dashboard - requires 'admin' role)
router.get('/:id', verifyToken, authorization('admin'), userController.getUserById);

// Update a user by ID (user - requires 'user' role)
router.put('/user/:id', verifyToken, authorization('user'), userController.updateUser);
// Update a user by ID (user - requires 'admin' role)
router.put('/:id', verifyToken, authorization('admin'), userController.updateUser);

// Delete a user by ID (admin dashboard - requires 'admin' role)
router.delete('/Delete/admin/:id', verifyToken, authorization('admin'), userController.deleteUser);

module.exports = router;
