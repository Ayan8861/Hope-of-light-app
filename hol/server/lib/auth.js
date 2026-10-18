const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
if (!SECRET || SECRET.length < 24) {
  throw new Error('JWT_SECRET is missing or too short. Set a long random value in server/.env');
}
const COOKIE = 'hol_token';
const DAY = 24 * 60 * 60 * 1000;

const cookieOpts = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * DAY
});

function login(res, user) {
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE, token, cookieOpts());
}
const logout = res => res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });

// Reads the cookie (if any) and sets req.user = { id, role }
function attach(req, _res, next) {
  const t = req.cookies && req.cookies[COOKIE];
  if (t) { try { req.user = jwt.verify(t, SECRET); } catch { /* ignore bad/expired token */ } }
  next();
}
const requireAuth = (req, res, next) => req.user ? next() : res.status(401).json({ error: 'Please log in first.' });
const requireAdmin = (req, res, next) =>
  !req.user ? res.status(401).json({ error: 'Please log in first.' })
  : req.user.role !== 'admin' ? res.status(403).json({ error: 'Admins only.' }) : next();

module.exports = { login, logout, attach, requireAuth, requireAdmin };
