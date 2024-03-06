// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/Order');
const { verifyToken, authorization } = require('../config/jwt');

// Create a new order (user)
router.post('/create', verifyToken, authorization('user'), orderController.createOrder);

// Get all orders (user and admin)
router.get('/all', verifyToken, orderController.getOrders);

// Get a single order by ID (user and admin)
router.get('/:id', verifyToken, orderController.getOrderById);

// Update order status by ID (admin)
router.put('/update/:id', verifyToken, authorization('admin'), orderController.updateOrderStatus);

// Delete order by ID (admin)
router.delete('/delete/:id', verifyToken, authorization('admin'), orderController.deleteOrder);
// Get the total count of all orders
router.get('/admin/order/count', verifyToken, authorization('admin'), orderController.getOrderCount);

// Get monthly income based on specified criteria
router.get('/admin/order/monthly-income', verifyToken, authorization('admin'), orderController.getMonthlyIncome);

// Get order statistics for the current month
router.get('/admin/order/statistics', verifyToken, authorization('admin'), orderController.getOrderStatistics);

module.exports = router;
