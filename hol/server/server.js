require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { attach } = require('./lib/auth');

const app = express();
app.set('trust proxy', 1); // correct client IPs behind Render/Railway/Nginx

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      // UPI deep links (upi://) are plain <a> navigations and are not restricted by CSP.
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  }
}));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(attach);
app.get('/healthz', (_req, res) => res.type('text').send('ok')); // for hosting health checks / keep-alive pings

const limiter = (max, minutes) => rateLimit({ windowMs: minutes * 60 * 1000, max, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a little while.' } });

app.use('/api/auth/login', limiter(10, 15));
app.use('/api/auth/register', limiter(10, 60));
app.use('/api/contact', limiter(5, 60));
app.use('/api/donations', limiter(30, 60));
app.use('/api', limiter(300, 15));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/public', require('./routes/public'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/volunteer', require('./routes/volunteer'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// Frontend (plain HTML/CSS/JS) served from ../public
app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'], maxAge: '1h' }));
app.use((_req, res) => res.status(404).sendFile(path.join(__dirname, '..', 'public', 'index.html')));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Hope of Light running at http://localhost:${port}`));
