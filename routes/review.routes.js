const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/Review');
const { verifyToken, authorization } = require('../config/jwt');

// Routes
router.post('/Review/', verifyToken, authorization('user'), reviewController.createReview);
router.get('/Review/', verifyToken, authorization('user'), reviewController.getAllReviews);
router.get('/Review/:id', verifyToken, authorization('user'), reviewController.getReviewById);
router.put('/Review/:id', verifyToken, authorization('user'), reviewController.updateReview);
router.delete('/Review/:id', verifyToken, authorization('user'), reviewController.deleteReview);

module.exports = router;
