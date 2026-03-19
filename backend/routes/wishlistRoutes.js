const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } = require('../controllers/wishlistController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getWishlist);
router.post('/', authenticateToken, addToWishlist);
router.delete('/:productId', authenticateToken, removeFromWishlist);
router.get('/check/:productId', authenticateToken, checkWishlist);

module.exports = router;
