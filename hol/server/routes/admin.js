const router = require('express').Router();
const db = require('../db');
const { requireAdmin } = require('../lib/auth');

router.use(requireAdmin);

router.get('/overview', async (_req, res, next) => {
  try {
    const [[a]] = await db.query(`SELECT COALESCE(SUM(CASE WHEN status='verified' THEN amount END),0) AS raised,
        SUM(status='submitted') AS toReview, COUNT(DISTINCT CASE WHEN status='verified' THEN donor_email END) AS donors FROM donations`);
    const [[u]] = await db.query(`SELECT COUNT(*) AS members FROM users WHERE role='member'`);
    const [[vo]] = await db.query(`SELECT COUNT(*) AS n FROM volunteer_applications WHERE status='pending'`);
    const [[m]] = await db.query(`SELECT COUNT(*) AS n FROM messages WHERE is_read=0`);
    const [monthly] = await db.query(
      `SELECT DATE_FORMAT(verified_at,'%Y-%m') AS ym, DATE_FORMAT(verified_at,'%b') AS label, SUM(amount) AS total
       FROM donations WHERE status='verified' AND verified_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY ym, label ORDER BY ym`);
    const [byProject] = await db.query(
      `SELECT p.title, p.goal_amount, COALESCE(SUM(CASE WHEN d.status='verified' THEN d.amount END),0) AS raised
       FROM projects p LEFT JOIN donations d ON d.project_id = p.id GROUP BY p.id ORDER BY p.sort_order`);
    res.json({ raised: a.raised, toReview: Number(a.toReview || 0), donors: a.donors, members: u.members,
      pendingVolunteers: vo.n, unread: m.n, monthly, byProject });
  } catch (e) { next(e); }
});

const DON_SQL = `SELECT d.id, d.ref, d.donor_name, d.donor_email, d.donor_phone, d.amount, d.utr, d.status, d.created_at, d.message, p.title AS project
  FROM donations d LEFT JOIN projects p ON p.id = d.project_id ORDER BY FIELD(d.status,'submitted','pending','verified','rejected'), d.id DESC LIMIT 500`;

router.get('/donations', async (_req, res, next) => {
  try { const [rows] = await db.query(DON_SQL); res.json({ donations: rows }); } catch (e) { next(e); }
});

// CSV export — cells starting with = + - @ are prefixed to block spreadsheet formula injection
router.get('/donations.csv', async (_req, res, next) => {
  try {
    const [rows] = await db.query(DON_SQL);
    const cell = x => { let s = String(x ?? ''); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
    const head = ['Date', 'Reference', 'Name', 'Email', 'Phone', 'Program', 'Amount', 'UTR', 'Status'];
    const lines = rows.map(d => [new Date(d.created_at).toISOString().slice(0, 10), d.ref, d.donor_name, d.donor_email, d.donor_phone, d.project || 'General fund', d.amount, d.utr, d.status].map(cell).join(','));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="donations.csv"');
    res.send('\ufeff' + [head.map(cell).join(','), ...lines].join('\n'));
  } catch (e) { next(e); }
});

router.patch('/donations/:id', async (req, res, next) => {
  try {
    const s = (req.body || {}).status;
    if (!['verified', 'rejected'].includes(s)) return res.status(400).json({ error: 'Invalid status.' });
    const [r] = await db.query(`UPDATE donations SET status=?, verified_at=NOW() WHERE id=? AND status='submitted'`, [s, Number(req.params.id)]);
    if (!r.affectedRows) return res.status(409).json({ error: 'Only donations awaiting review can be changed.' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/volunteers', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.status, a.created_at, u.name, u.email, u.phone, u.interest, p.title AS project
       FROM volunteer_applications a JOIN users u ON u.id = a.user_id LEFT JOIN projects p ON p.id = a.project_id
       ORDER BY FIELD(a.status,'pending','approved','rejected'), a.id DESC LIMIT 500`);
    res.json({ applications: rows });
  } catch (e) { next(e); }
});

router.patch('/volunteers/:id', async (req, res, next) => {
  try {
    const s = (req.body || {}).status;
    if (!['approved', 'rejected'].includes(s)) return res.status(400).json({ error: 'Invalid status.' });
    await db.query('UPDATE volunteer_applications SET status=? WHERE id=?', [s, Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/messages', async (_req, res, next) => {
  try { const [rows] = await db.query('SELECT * FROM messages ORDER BY is_read, id DESC LIMIT 300'); res.json({ messages: rows }); } catch (e) { next(e); }
});
router.patch('/messages/:id', async (req, res, next) => {
  try { await db.query('UPDATE messages SET is_read=1 WHERE id=?', [Number(req.params.id)]); res.json({ ok: true }); } catch (e) { next(e); }
});

router.get('/projects', async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.title, p.goal_amount, p.active, COALESCE(SUM(CASE WHEN d.status='verified' THEN d.amount END),0) AS raised
       FROM projects p LEFT JOIN donations d ON d.project_id = p.id GROUP BY p.id ORDER BY p.sort_order`);
    res.json({ projects: rows });
  } catch (e) { next(e); }
});
router.patch('/projects/:id', async (req, res, next) => {
  try {
    const goal = Number((req.body || {}).goal_amount);
    if (!Number.isFinite(goal) || goal < 0 || goal > 1e9) return res.status(400).json({ error: 'Enter a valid goal.' });
    await db.query('UPDATE projects SET goal_amount=?, active=? WHERE id=?', [goal, (req.body || {}).active ? 1 : 0, Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
