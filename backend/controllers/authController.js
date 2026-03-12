const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const checkEmail = 'SELECT id FROM users WHERE email = ?';
    db.query(checkEmail, [email], async (err, results) => {
      if (err) {
        console.error('Register checkEmail error:', err.message);
        return res.status(500).json({
          message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
            ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
            : 'Database error',
        });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Register insert error:', err.message);
          return res.status(500).json({
            message: err.code === 'ER_DUP_ENTRY' ? 'Email đã được đăng ký' : 'Error creating user',
          });
        }

        const token = jwt.sign(
          { id: result.insertId, email, name, is_admin: false },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { id: result.insertId, name, email, is_admin: false }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({
          message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
            ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
            : 'Database error',
        });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = (req, res) => {
  const sql = 'SELECT id, name, email, is_admin, created_at FROM users WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
};

const getAllUsers = (req, res) => {
  const sql = 'SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

const updateUserRole = (req, res) => {
  const { id } = req.params;
  const { is_admin } = req.body;

  const sql = 'UPDATE users SET is_admin = ? WHERE id = ?';
  db.query(sql, [is_admin, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'User role updated successfully' });
  });
};

module.exports = { register, login, getMe, getAllUsers, updateUserRole };
