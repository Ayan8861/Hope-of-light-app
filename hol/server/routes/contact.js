const router = require('express').Router();
const db = require('../db');
const { make, fail } = require('../lib/validate');

router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {}, v = make();
    const name = v.str(b, 'name', { min: 2, max: 100, label: 'Name' });
    const email = v.email(b);
    const subject = v.str(b, 'subject', { min: 3, max: 150, label: 'Subject' });
    const body = v.str(b, 'message', { min: 10, max: 3000, label: 'Message' });
    if (!v.ok) return fail(res, v.errs);
    await db.query('INSERT INTO messages (name, email, subject, body) VALUES (?,?,?,?)', [name, email, subject, body]);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
