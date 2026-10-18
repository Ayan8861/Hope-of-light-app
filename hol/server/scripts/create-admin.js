// Create (or promote) an admin:  npm run create-admin -- you@example.com "StrongPassword" "Your Name"
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db');

(async () => {
  const [email, password, name = 'Admin'] = process.argv.slice(2);
  if (!email || !password || password.length < 8) {
    console.error('Usage: npm run create-admin -- <email> <password (8+ chars)> [name]');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
  if (rows.length) {
    await db.query(`UPDATE users SET role='admin', password_hash=? WHERE id=?`, [hash, rows[0].id]);
    console.log(`Existing user ${email} promoted to admin (password updated).`);
  } else {
    await db.query(`INSERT INTO users (name, email, phone, password_hash, role) VALUES (?,?,?,?, 'admin')`, [name, email.toLowerCase(), '0000000000', hash]);
    console.log(`Admin ${email} created.`);
  }
  await db.end();
})().catch(e => { console.error(e.message); process.exit(1); });
