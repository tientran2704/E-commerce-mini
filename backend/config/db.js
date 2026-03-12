require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Use promise wrapper for consistent API (pool.query still works like connection.query)
const db = pool;

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    console.error('Make sure MySQL is running and run: npm run init-db');
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

module.exports = db;
