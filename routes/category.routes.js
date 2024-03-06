const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/Category');
const { verifyToken, authorization } = require('../config/jwt');

// Create a new category (admin only)
router.post('/categories', verifyToken, authorization('admin'), categoryController.createCategory);

// Get all categories
router.get('/categories', categoryController.getAllCategories);

// Get a single category by ID
router.get('/categories/:id', categoryController.getCategoryById);

// Update a category by ID (admin only)
router.put('/categories/:id', verifyToken, authorization('admin'), categoryController.updateCategory);

// Delete a category by ID (admin only)
router.delete('/categories/:id', verifyToken, authorization('admin'), categoryController.deleteCategory);

module.exports = router;
