const router = require('express').Router();
const db = require('../db');

router.get('/config', (_req, res) => res.json({ upiId: process.env.UPI_ID || '8805330565@ybl', orgName: 'Hope of Light' }));

// Active programs with live funding progress (verified donations only)
router.get('/projects', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.slug, p.title, p.summary, p.goal_amount,
              COALESCE(SUM(CASE WHEN d.status='verified' THEN d.amount END), 0) AS raised,
              COUNT(CASE WHEN d.status='verified' THEN 1 END) AS donors
       FROM projects p LEFT JOIN donations d ON d.project_id = p.id
       WHERE p.active = 1 GROUP BY p.id ORDER BY p.sort_order, p.id`);
    res.json({ projects: rows });
  } catch (e) { next(e); }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [[d]] = await db.query(`SELECT COALESCE(SUM(amount),0) AS raised, COUNT(DISTINCT donor_email) AS donors FROM donations WHERE status='verified'`);
    const [[v]] = await db.query(`SELECT COUNT(DISTINCT user_id) AS volunteers FROM volunteer_applications WHERE status='approved'`);
    const [[p]] = await db.query(`SELECT COUNT(*) AS projects FROM projects WHERE active=1`);
    res.json({ raised: d.raised, donors: d.donors, volunteers: v.volunteers, projects: p.projects });
  } catch (e) { next(e); }
});

// Public supporters wall: first names only, anonymous gifts masked
router.get('/recent', async (_req, res, next) => {
  try {
    const [rows] = await db.query(`SELECT donor_name, amount, anonymous FROM donations WHERE status='verified' ORDER BY verified_at DESC, id DESC LIMIT 8`);
    res.json({ donations: rows.map(r => ({ name: r.anonymous ? 'Anonymous' : r.donor_name.split(' ')[0], amount: r.amount })) });
  } catch (e) { next(e); }
});

module.exports = router;
