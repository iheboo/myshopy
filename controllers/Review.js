const { Review } = require('../models');

// Create a new review
const createReview = async (req, res) => {
  try {
    // const token =req.cookies.userToken
    // if (!token) {
    //   // console.log(req.cookies.userToken,'ggggggggggggg')
    //   return res.status(401).json({ message: 'Access denied. No token provided.' });
    // }
    const { content, like } = req.body;
    const userId = req.user.id; // Assuming user information is attached to the request

    const newReview = await Review.create({ content, like, userId });

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating review.' });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews.' });
  }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findByPk(reviewId);

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: 'Review not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching review.' });
  }
};

// Update a review by ID
const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id; // Assuming user information is attached to the request

  try {
    const [updatedRowsCount, updatedReview] = await Review.update(req.body, {
      where: { id: reviewId, userId },
      returning: true,
    });

    if (updatedRowsCount > 0) {
      res.status(200).json(updatedReview[0]);
    } else {
      res.status(404).json({ message: 'Review not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating review.' });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id; // Assuming user information is attached to the request

  try {
    const deletedRowsCount = await Review.destroy({ where: { id: reviewId, userId } });

    if (deletedRowsCount > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Review not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting review.' });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
