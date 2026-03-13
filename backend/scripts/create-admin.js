/**
 * Tạo tài khoản Admin. Chạy: npm run create-admin (trong thư mục backend)
 * Cách dùng: node scripts/create-admin.js <email> <password> [name]
 * Ví dụ: node scripts/create-admin.js admin@example.com Admin@123 "Admin User"
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin';

async function main() {
  if (!email || !password) {
    console.log('Cách dùng: node scripts/create-admin.js <email> <password> [name]');
    console.log('Ví dụ: node scripts/create-admin.js admin@example.com Admin@123 "Admin User"');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('Mật khẩu phải có ít nhất 6 ký tự.');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_ecommerce',
  });

  try {
    const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing.length > 0) {
      await connection.execute('UPDATE users SET password = ?, is_admin = 1, name = ? WHERE email = ?', [
        hashedPassword,
        name,
        email,
      ]);
      console.log('Đã cập nhật tài khoản thành Admin:', email);
    } else {
      await connection.execute(
        'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, 1)',
        [name, email, hashedPassword]
      );
      console.log('Đã tạo tài khoản Admin:', email);
    }
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
