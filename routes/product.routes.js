const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const { verifyToken, authorization } = require('../config/jwt');

// Create a new product (admin only)
router.post('/products', verifyToken, authorization('admin'), productController.createProduct);

// Get all products
router.get('/products', productController.getAllProducts);

// Get a single product by ID
router.get('/products/:id', productController.getProductById);

// Update a product by ID (admin only)
router.put('/products/:id', verifyToken, authorization('admin'), productController.updateProduct);

// Delete a product by ID (admin only)
router.delete('/products/:id', verifyToken, authorization('admin'), productController.deleteProduct);

// Upload or fetch product photo (accessible to all users)
router.post('/products/:pid/photo', verifyToken, productController.productPhotoController);

module.exports = router;
