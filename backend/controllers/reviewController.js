const db = require('../config/db');

const getReviewsByProduct = (req, res) => {
  const { productId } = req.params;
  const { status = 'approved' } = req.query;

  const sql = `
    SELECT r.*, u.name as user_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.product_id = ? AND r.status = ?
    ORDER BY r.created_at DESC
  `;
  
  db.query(sql, [productId, status], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

const getAverageRating = (req, res) => {
  const { productId } = req.params;

  const sql = `
    SELECT 
      AVG(rating) as average_rating, 
      COUNT(*) as total_reviews 
    FROM reviews 
    WHERE product_id = ? AND status = 'approved'
  `;
  
  db.query(sql, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    const { average_rating, total_reviews } = results[0];
    res.json({
      average_rating: average_rating ? parseFloat(average_rating).toFixed(1) : 0,
      total_reviews: total_reviews || 0
    });
  });
};

const createReview = (req, res) => {
  const { product_id, rating, comment } = req.body;
  const user_id = req.user.id;

  if (!product_id || !rating) {
    return res.status(400).json({ message: 'Product ID and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  // Check if user already reviewed this product
  const checkSql = 'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?';
  db.query(checkSql, [product_id, user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const sql = 'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(sql, [product_id, user_id, rating, comment || null], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating review' });
      }

      const selectSql = `
        SELECT r.*, u.name as user_name 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.id = ?
      `;
      db.query(selectSql, [result.insertId], (err2, reviewResults) => {
        if (err2) {
          return res.status(500).json({ message: 'Error fetching review' });
        }
        res.status(201).json(reviewResults[0]);
      });
    });
  });
};

const updateReview = (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const user_id = req.user.id;

  // Check if review belongs to user
  const checkSql = 'SELECT * FROM reviews WHERE id = ? AND user_id = ?';
  db.query(checkSql, [id, user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const sql = 'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?';
    db.query(sql, [rating, comment, id], (err2, result) => {
      if (err2) {
        return res.status(500).json({ message: 'Error updating review' });
      }

      const selectSql = `
        SELECT r.*, u.name as user_name 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.id = ?
      `;
      db.query(selectSql, [id], (err3, reviewResults) => {
        if (err3) {
          return res.status(500).json({ message: 'Error fetching review' });
        }
        res.json(reviewResults[0]);
      });
    });
  });
};

const deleteReview = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const isAdmin = req.user.is_admin;

  // User can delete their own review, or admin can delete any review
  const sql = isAdmin 
    ? 'DELETE FROM reviews WHERE id = ?'
    : 'DELETE FROM reviews WHERE id = ? AND user_id = ?';
  
  const params = isAdmin ? [id] : [id, user_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    res.json({ message: 'Review deleted successfully' });
  });
};

// Admin: Get all reviews
const getAllReviews = (req, res) => {
  const { status } = req.query;
  
  let sql = `
    SELECT r.*, u.name as user_name, p.name as product_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id
  `;
  
  const params = [];
  if (status) {
    sql += ' WHERE r.status = ?';
    params.push(status);
  }
  
  sql += ' ORDER BY r.created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

// Admin: Update review status
const updateReviewStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sql = 'UPDATE reviews SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review status updated' });
  });
};

module.exports = {
  getReviewsByProduct,
  getAverageRating,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
};
