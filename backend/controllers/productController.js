const db = require('../config/db');

const getAllProducts = async (req, res) => {
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

  try {
    const [results] = await db.execute(sql, params);
    res.json(results);
  } catch (err) {
    console.error('getAllProducts error:', err.message);
    return res.status(500).json({
      message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
        ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
        : 'Database error',
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
};

const createProduct = async (req, res) => {
  const { name, price, description, image, video_url, category, stock } = req.body;
  const isAdmin = req.user && req.user.is_admin;
  const userId = req.user ? req.user.id : null;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  const status = isAdmin ? 'approved' : 'pending';

  try {
    const [result] = await db.execute(
      'INSERT INTO products (name, price, description, image, video_url, category, stock, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, price, description, image, video_url, category, stock || 0, status, isAdmin ? null : userId]
    );

    const [results] = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(results[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating product' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image, video_url, category, stock } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE products SET name = ?, price = ?, description = ?, image = ?, video_url = ?, category = ?, stock = ? WHERE id = ?',
      [name, price, description, image, video_url, category, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [results] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating product' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting product' });
  }
};

const searchProducts = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query required' });
  }

  const searchTerm = `%${q}%`;
  const sql = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY created_at DESC LIMIT 20';

  try {
    const [results] = await db.execute(sql, [searchTerm, searchTerm, searchTerm]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
};

const getPendingProducts = async (req, res) => {
  const sql = "SELECT p.*, u.name as creator_name, u.email as creator_email FROM products p LEFT JOIN users u ON p.created_by = u.id WHERE p.status = 'pending' ORDER BY p.created_at DESC";

  try {
    const [results] = await db.execute(sql);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
};

const approveProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("UPDATE products SET status = 'approved' WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Đã duyệt sản phẩm' });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
};

const getCategories = async (req, res) => {
  const sql = "SELECT DISTINCT category FROM products WHERE (status = 'approved' OR status IS NULL) ORDER BY category";

  try {
    const [results] = await db.execute(sql);
    res.json(results.map(r => r.category));
  } catch (err) {
    console.error('getCategories error:', err.message);
    return res.status(500).json({
      message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
        ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
        : 'Database error',
    });
  }
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
