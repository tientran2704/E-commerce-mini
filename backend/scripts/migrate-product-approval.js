/**
 * Thêm cột duyệt sản phẩm (status, created_by) vào bảng products nếu chưa có.
 * Chạy: node scripts/migrate-product-approval.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_ecommerce',
  });

  try {
    try {
      await connection.query(`ALTER TABLE products ADD COLUMN status ENUM('pending', 'approved') DEFAULT 'approved'`);
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
    }
    try {
      await connection.query(`ALTER TABLE products ADD COLUMN created_by INT NULL`);
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
    }
    console.log('Migration thành công: đã thêm cột status, created_by vào products.');
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
