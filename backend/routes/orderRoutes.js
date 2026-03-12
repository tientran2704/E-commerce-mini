const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus,
  getOrderById
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, createOrder);
router.get('/user/:userId', authenticateToken, getUserOrders);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);

router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.put('/:id', authenticateToken, requireAdmin, updateOrderStatus);

module.exports = router;
