const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateUserRole } = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.put('/users/:id/role', authenticateToken, requireAdmin, updateUserRole);

module.exports = router;
