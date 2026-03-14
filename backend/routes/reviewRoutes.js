const express = require('express');
const router = express.Router();
const { 
  getReviewsByProduct,
  getAverageRating,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
} = require('../controllers/reviewController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', getReviewsByProduct);
router.get('/product/:productId/rating', getAverageRating);

// Protected routes (require login)
router.post('/', authenticateToken, createReview);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllReviews);
router.put('/:id/status', authenticateToken, requireAdmin, updateReviewStatus);

module.exports = router;
