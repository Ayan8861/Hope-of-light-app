const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { login, logout } = require('../lib/auth');
const { make, fail } = require('../lib/validate');

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12); // keeps login timing similar for unknown emails
const publicUser = u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role });

router.post('/register', async (req, res, next) => {
  try {
    const b = req.body || {}, v = make();
    const name = v.str(b, 'name', { min: 2, max: 100, label: 'Name' });
    const email = v.email(b);
    const phone = v.phone(b);
    const interest = v.str(b, 'interest', { max: 100, required: false });
    const password = String(b.password || '');
    if (password.length < 8 || password.length > 100) v.errs.password = 'Password must be 8–100 characters.';
    if (!v.ok) return fail(res, v.errs);

    const [dup] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (dup.length) return res.status(409).json({ error: 'An account with this email already exists.', fields: { email: 'Already registered.' } });

    const hash = await bcrypt.hash(password, 12);
    const [r] = await db.query('INSERT INTO users (name, email, phone, password_hash, interest) VALUES (?,?,?,?,?)', [name, email, phone, hash, interest]);
    const user = { id: r.insertId, name, email, phone, role: 'member' };
    login(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    const password = String((req.body || {}).password || '');
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !ok) return res.status(401).json({ error: 'Incorrect email or password.' });
    login(res, user);
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/logout', (_req, res) => { logout(res); res.json({ ok: true }); });

router.get('/me', async (req, res, next) => {
  try {
    if (!req.user) return res.json({ user: null });
    const [rows] = await db.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: rows[0] || null });
  } catch (e) { next(e); }
});

module.exports = router;
