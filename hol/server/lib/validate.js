// Tiny validation helpers. Each returns a cleaned value, or records a message in `errs`.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?\d{10,15}$/;

function make() {
  const errs = {};
  const v = {
    errs,
    str(o, k, { min = 1, max = 200, label = k, required = true } = {}) {
      const s = String(o[k] ?? '').trim();
      if (!s && !required) return null;
      if (s.length < min) errs[k] = `${label} is required.`;
      else if (s.length > max) errs[k] = `${label} is too long.`;
      return s;
    },
    email(o, k = 'email') {
      const s = String(o[k] ?? '').trim().toLowerCase();
      if (!EMAIL.test(s) || s.length > 190) errs[k] = 'Enter a valid email address.';
      return s;
    },
    phone(o, k = 'phone') {
      const s = String(o[k] ?? '').replace(/[\s-]/g, '');
      if (!PHONE.test(s)) errs[k] = 'Enter a valid phone number (10–15 digits).';
      return s;
    },
    num(o, k, { min, max, label = k }) {
      const n = Number(o[k]);
      if (!Number.isFinite(n) || n < min || n > max) errs[k] = `${label} must be between ${min} and ${max}.`;
      return n;
    },
    get ok() { return Object.keys(errs).length === 0; }
  };
  return v;
}

const fail = (res, errs) => res.status(400).json({ error: 'Please check the form.', fields: errs });
module.exports = { make, fail };
