/**
 * Khởi tạo database và các bảng. Chạy: npm run init-db (trong thư mục backend)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});

const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');

connection.connect((err) => {
  if (err) {
    console.error('Không kết nối được MySQL:', err.message);
    console.error('Kiểm tra: MySQL đã chạy chưa? .env có đúng DB_HOST, DB_USER, DB_PASSWORD?');
    process.exit(1);
  }
  console.log('Đang kết nối MySQL...');

  const sql = fs.readFileSync(schemaPath, 'utf8');

  connection.query(sql, (err) => {
    if (err) {
      console.error('Lỗi khi chạy schema:', err.message);
      connection.end();
      process.exit(1);
    }
    console.log('Database ai_ecommerce và các bảng đã được tạo thành công.');
    connection.end();
    process.exit(0);
  });
});
