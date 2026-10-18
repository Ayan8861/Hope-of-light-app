const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../lib/auth');

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    let projectId = null;
    if (b.project_id) {
      const [p] = await db.query('SELECT id FROM projects WHERE id = ? AND active = 1', [Number(b.project_id)]);
      if (!p.length) return res.status(400).json({ error: 'That program is not available.' });
      projectId = p[0].id;
    }
    const [dup] = await db.query(
      `SELECT id FROM volunteer_applications WHERE user_id = ? AND project_id <=> ? AND status IN ('pending','approved')`, [req.user.id, projectId]);
    if (dup.length) return res.status(409).json({ error: 'You have already applied for this program.' });
    const message = String(b.message || '').trim().slice(0, 500) || null;
    await db.query('INSERT INTO volunteer_applications (user_id, project_id, message) VALUES (?,?,?)', [req.user.id, projectId, message]);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT a.status, a.created_at, p.title AS project FROM volunteer_applications a
       LEFT JOIN projects p ON p.id = a.project_id WHERE a.user_id = ? ORDER BY a.id DESC`, [req.user.id]);
    res.json({ applications: rows });
  } catch (e) { next(e); }
});

module.exports = router;
