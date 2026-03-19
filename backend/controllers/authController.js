const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [rows] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

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
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({
      message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
        ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
        : err.code === 'ER_DUP_ENTRY' ? 'Email đã được đăng ký' : 'Error creating user',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
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
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({
      message: err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE'
        ? 'Database chưa được tạo. Chạy: npm run init-db trong thư mục backend'
        : 'Database error',
    });
  }
};

const getMe = async (req, res) => {
  try {
    const [results] = await db.execute(
      'SELECT id, name, email, is_admin, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [results] = await db.execute(
      'SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_admin } = req.body;
    await db.execute('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin, id]);
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

module.exports = { register, login, getMe, getAllUsers, updateUserRole };
