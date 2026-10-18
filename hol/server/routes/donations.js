const router = require('express').Router();
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../lib/auth');
const { make, fail } = require('../lib/validate');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newRef() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rnd = [...crypto.randomBytes(6)].map(b => ALPHABET[b % ALPHABET.length]).join('');
  return `HOL-${d}-${rnd}`;
}

// Step 1: record the pledge, return a UPI deep link
router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {}, v = make();
    const amount = v.num(b, 'amount', { min: 1, max: 500000, label: 'Amount' });
    const name = v.str(b, 'name', { min: 2, max: 100, label: 'Name' });
    const email = v.email(b), phone = v.phone(b);
    const message = v.str(b, 'message', { max: 300, required: false });
    if (!v.ok) return fail(res, v.errs);

    let projectId = null;
    if (b.project_id) {
      const [p] = await db.query('SELECT id FROM projects WHERE id = ? AND active = 1', [Number(b.project_id)]);
      if (!p.length) return res.status(400).json({ error: 'That program is not available.' });
      projectId = p[0].id;
    }
    const ref = newRef();
    const amt = Math.round(amount * 100) / 100;
    await db.query(
      `INSERT INTO donations (ref, user_id, project_id, donor_name, donor_email, donor_phone, amount, message, anonymous)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [ref, req.user ? req.user.id : null, projectId, name, email, phone, amt, message, b.anonymous ? 1 : 0]);

    const upi = process.env.UPI_ID || '8805330565@ybl';
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent('Hope of Light')}&am=${amt.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Donation ' + ref)}&tr=${ref}`;
    res.status(201).json({ ref, amount: amt, upiUrl });
  } catch (e) { next(e); }
});

// Step 2: donor says they've paid and supplies the UPI transaction id
router.post('/:ref/confirm', async (req, res, next) => {
  try {
    const utr = String((req.body || {}).utr || '').trim();
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    if (!/^\d{12}$/.test(utr)) return res.status(400).json({ error: 'Check the transaction ID.', fields: { utr: 'Enter the 12-digit UPI transaction ID.' } });

    const [rows] = await db.query('SELECT id, status, donor_email FROM donations WHERE ref = ?', [req.params.ref]);
    const d = rows[0];
    if (!d || d.donor_email !== email) return res.status(404).json({ error: 'Donation not found.' });
    if (d.status !== 'pending') return res.status(409).json({ error: 'This donation has already been submitted.' });

    try {
      await db.query(`UPDATE donations SET status='submitted', utr=?, submitted_at=NOW() WHERE id=? AND status='pending'`, [utr, d.id]);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'That transaction ID was already used.', fields: { utr: 'This transaction ID was already used.' } });
      throw e;
    }
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT d.ref, d.amount, d.status, d.created_at, p.title AS project
       FROM donations d LEFT JOIN projects p ON p.id = d.project_id
       WHERE d.user_id = ? OR d.donor_email = (SELECT email FROM users WHERE id = ?)
       ORDER BY d.id DESC LIMIT 100`, [req.user.id, req.user.id]);
    res.json({ donations: rows });
  } catch (e) { next(e); }
});

module.exports = router;
