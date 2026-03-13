const db = require('../config/db');

const getAllProducts = (req, res) => {
  const { category, search, limit, offset } = req.query;

  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  sql += " AND (status = 'approved' OR status IS NULL)";

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY created_at DESC';

  if (limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  if (offset) {
    sql += ' OFFSET ?';
    params.push(parseInt(offset));
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('getAllProducts error:', err.message);
      return res.status(500).json({
        message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
          ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
          : 'Database error',
      });
    }
    res.json(results);
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results[0]);
  });
};

const createProduct = (req, res) => {
  const { name, price, description, image, category, stock } = req.body;
  const isAdmin = req.user && req.user.is_admin;
  const userId = req.user ? req.user.id : null;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  const status = isAdmin ? 'approved' : 'pending';
  const sql = 'INSERT INTO products (name, price, description, image, category, stock, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, price, description, image, category, stock || 0, status, isAdmin ? null : userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating product' });
    }

    const sql2 = 'SELECT * FROM products WHERE id = ?';
    db.query(sql2, [result.insertId], (err2, results) => {
      if (err2) {
        return res.status(500).json({ message: 'Error fetching created product' });
      }
      res.status(201).json(results[0]);
    });
  });
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, description, image, category, stock } = req.body;

  const sql = 'UPDATE products SET name = ?, price = ?, description = ?, image = ?, category = ?, stock = ? WHERE id = ?';
  db.query(sql, [name, price, description, image, category, stock, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating product' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const sql2 = 'SELECT * FROM products WHERE id = ?';
    db.query(sql2, [id], (err2, results) => {
      if (err2) {
        return res.status(500).json({ message: 'Error fetching updated product' });
      }
      res.json(results[0]);
    });
  });
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting product' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  });
};

const searchProducts = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query required' });
  }

  const sql = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY created_at DESC LIMIT 20';
  const searchTerm = `%${q}%`;
  db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

const getPendingProducts = (req, res) => {
  const sql = "SELECT p.*, u.name as creator_name, u.email as creator_email FROM products p LEFT JOIN users u ON p.created_by = u.id WHERE p.status = 'pending' ORDER BY p.created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

const approveProduct = (req, res) => {
  const { id } = req.params;
  db.query("UPDATE products SET status = 'approved' WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Đã duyệt sản phẩm' });
  });
};

const getCategories = (req, res) => {
  const sql = "SELECT DISTINCT category FROM products WHERE (status = 'approved' OR status IS NULL) ORDER BY category";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('getCategories error:', err.message);
      return res.status(500).json({
        message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
          ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
          : 'Database error',
      });
    }
    res.json(results.map(r => r.category));
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getCategories,
  getPendingProducts,
  approveProduct,
};
