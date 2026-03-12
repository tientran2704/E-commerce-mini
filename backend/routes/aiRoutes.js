const express = require('express');
const router = express.Router();
const { chat, recommendProducts, trackProductView } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

router.post('/chat', chat);
router.post('/recommend', authenticateToken, recommendProducts);
router.post('/track-view', authenticateToken, trackProductView);

module.exports = router;
