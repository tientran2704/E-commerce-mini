const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts,
  getCategories,
  getPendingProducts,
  approveProduct,
} = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/pending', authenticateToken, requireAdmin, getPendingProducts);
router.get('/:id', getProductById);

router.post('/', authenticateToken, createProduct);
router.put('/:id/approve', authenticateToken, requireAdmin, approveProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

module.exports = router;
