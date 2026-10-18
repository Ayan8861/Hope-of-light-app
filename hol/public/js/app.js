/* Hope of Light — shared frontend core */
const SITE = {
  email: 'info@hopeoflight.org',
  phone: '',                       // add a public phone number here to show it in the footer/contact page
  address: '202/A, Deccan Gymkhana, Pune, Maharashtra 411004',
  hours: 'Mon – Fri: 9:00 AM – 5:00 PM',
  social: { facebook: 'https://www.facebook.com/share/1A1jSQwSMH/', instagram: 'https://www.instagram.com/ayanbagnikar/?utm_source=ig_web_button_share_sheet', twitter: 'https://x.com/ayanbagnikar', linkedin: 'https://www.linkedin.com/in/ayan-bagnikar-b49931370?utm_source=share_via&utm_content=profile&utm_medium=member_android' }  // paste profile URLs to show icons
};

const P = {
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 7L2 7"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  hand: '<path d="M11 17a2 2 0 0 0 4 0v-3l3-1a2 2 0 0 0 1-3l-2-3a2 2 0 0 0-3-.5L12 8"/><path d="M3 11l5-5 4 4-5 5z"/>',
  coin: '<circle cx="12" cy="12" r="10"/><path d="M9 8h6M9 12h6M10 8c4 0 4 5 0 5l4 4"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  ig: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2z"/><path d="M17.5 6.5h.01"/>',
  tw: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
  in: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'
};
const icon = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = n => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ICON_PROJECT = { education: 'cap', healthcare: 'pulse', community: 'leaf', 'women-empowerment': 'users' };

async function api(path, opts = {}) {
  const res = await fetch('/api' + path, {
    method: opts.method || 'GET',
    headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'same-origin'
  });
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) { const e = new Error(data.error || 'Something went wrong'); e.status = res.status; e.fields = data.fields; throw e; }
  return data;
}

function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

function fieldErrors(form, fields = {}) {
  $$('.field', form).forEach(f => f.classList.remove('err'));
  Object.entries(fields).forEach(([k, m]) => {
    const el = form.elements[k]; const f = el && el.closest('.field');
    if (f) { f.classList.add('err'); const msg = $('.msg', f); if (msg) msg.textContent = m; }
  });
}
function showAlert(el, type, text) { el.className = `alert show ${type}`; el.textContent = text; }

/* ---------- Layout ---------- */
let ME = null;
const NAV = [['index.html', 'Home', 'home'], ['about.html', 'About', 'about'], ['projects.html', 'Projects', 'projects'], ['contact.html', 'Contact', 'contact']];

function renderHeader() {
  const page = document.body.dataset.page;
  const links = NAV.map(([h, t, k]) => `<li><a class="link ${page === k ? 'active' : ''}" href="/${h}">${t}</a></li>`).join('');
  const auth = ME
    ? `<div class="user-chip"><button type="button" id="userBtn">${esc(ME.name.split(' ')[0])} ▾</button>
        <div class="user-menu"><a href="/account.html">My dashboard</a>${ME.role === 'admin' ? '<a href="/admin.html">Admin panel</a>' : ''}<button type="button" id="logoutBtn">Log out</button></div></div>`
    : `<a class="btn btn-line btn-sm hide-m" href="/login.html">Log in</a><a class="btn btn-line btn-sm hide-m" href="/register.html">Join us</a>`;
  $('#app-header').innerHTML = `<header class="site-header"><div class="wrap nav">
    <a class="logo" href="/index.html">${icon('sun')}<span>Hope of <b>Light</b></span></a>
    <ul class="nav-links" id="navLinks">${links}${ME ? '' : '<li class="m-only"><a class="link" href="/login.html">Log in</a></li><li class="m-only"><a class="link" href="/register.html">Join us</a></li>'}</ul>
    <div class="nav-right">${auth}<button class="btn btn-amber btn-sm" data-donate>${icon('heart')} Donate</button>
    <button class="burger" id="burger" aria-label="Menu">${icon('menu')}</button></div></div></header>`;
  $('#burger').onclick = () => $('#navLinks').classList.toggle('open');
  const ub = $('#userBtn'); if (ub) ub.onclick = e => { e.stopPropagation(); ub.parentElement.classList.toggle('open'); };
  document.addEventListener('click', () => $('.user-chip')?.classList.remove('open'));
  const lo = $('#logoutBtn'); if (lo) lo.onclick = async () => { await api('/auth/logout', { method: 'POST' }); location.href = '/index.html'; };
}

function renderFooter() {
  const soc = [['facebook', 'fb'], ['instagram', 'ig'], ['twitter', 'tw'], ['linkedin', 'in']]
    .filter(([k]) => SITE.social[k]).map(([k, i]) => `<a href="${esc(SITE.social[k])}" target="_blank" rel="noopener" aria-label="${k}">${icon(i)}</a>`).join('');
  $('#app-footer').innerHTML = `<footer class="footer"><div class="wrap">
    <div class="fgrid">
      <div><a class="logo" href="/index.html" style="color:#fff">${icon('sun')}<span>Hope of <b>Light</b></span></a>
        <p style="margin-top:1rem">Empowering communities through education, healthcare and sustainable development — creating lasting change, one life at a time.</p>
        ${soc ? `<div class="social">${soc}</div>` : ''}</div>
      <div><h4>Explore</h4><ul><li><a href="/about.html">About us</a></li><li><a href="/projects.html">Our projects</a></li><li><a href="/contact.html">Contact</a></li></ul></div>
      <div><h4>Get involved</h4><ul><li><a href="#" data-donate>Donate</a></li><li><a href="/register.html">Become a volunteer</a></li><li><a href="/login.html">Member login</a></li></ul></div>
      <div><h4>Reach us</h4><ul><li>${esc(SITE.address)}</li><li><a href="mailto:${SITE.email}">${SITE.email}</a></li>${SITE.phone ? `<li>${esc(SITE.phone)}</li>` : ''}</ul></div>
    </div>
    <div class="fbottom"><span>© ${new Date().getFullYear()} Hope of Light. All rights reserved.</span><span>Made with care in Pune, India</span></div></div></footer>`;
}

/* ---------- Donate modal ---------- */
const DON = { cfg: null, projects: [], ref: null, email: '' };

async function ensureDonateData() {
  if (!DON.cfg) {
    const [cfg, pr] = await Promise.all([api('/public/config'), api('/public/projects')]);
    DON.cfg = cfg; DON.projects = pr.projects;
  }
}

function donateModal() {
  if ($('#donateModal')) return;
  const m = document.createElement('div');
  m.className = 'modal'; m.id = 'donateModal';
  m.innerHTML = '<div class="modal-box" role="dialog" aria-modal="true" aria-label="Donate"><button class="modal-x" type="button" aria-label="Close">' + icon('x') + '</button><div id="donateBody"></div></div>';
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) closeDonate(); });
  $('.modal-x', m).onclick = closeDonate;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDonate(); });
}
const closeDonate = () => $('#donateModal')?.classList.remove('open');
const steps = n => `<div class="steps">${[1, 2, 3].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>`;

async function openDonate(projectId) {
  donateModal();
  try { await ensureDonateData(); } catch { return toast('Could not load donation form. Please try again.'); }
  const opts = '<option value="">General fund — where it\'s needed most</option>' +
    DON.projects.map(p => `<option value="${p.id}" ${p.id == projectId ? 'selected' : ''}>${esc(p.title)}</option>`).join('');
  $('#donateBody').innerHTML = `${steps(1)}<h3>Make a donation</h3><p class="muted">Every rupee goes toward lighting up a community.</p>
  <form id="donForm" novalidate>
    <div class="field"><label>Amount (INR)</label>
      <div class="chips">${[500, 1000, 2500, 5000].map(a => `<button type="button" class="chip" data-amt="${a}">${inr(a)}</button>`).join('')}</div>
      <input class="input" name="amount" type="number" min="1" placeholder="Or enter your own amount"><div class="msg"></div></div>
    <div class="field"><label>Support</label><select class="input" name="project_id">${opts}</select></div>
    <div class="row2"><div class="field"><label>Full name</label><input class="input" name="name" value="${esc(ME?.name || '')}"><div class="msg"></div></div>
    <div class="field"><label>Mobile number</label><input class="input" name="phone" type="tel" value="${esc(ME?.phone || '')}" placeholder="10-digit number"><div class="msg"></div></div></div>
    <div class="field"><label>Email</label><input class="input" name="email" type="email" value="${esc(ME?.email || '')}"><div class="msg"></div></div>
    <div class="field"><label>Message (optional)</label><input class="input" name="message" maxlength="300" placeholder="Words of encouragement"></div>
    <label class="check"><input type="checkbox" name="anonymous"> Keep my name off the public supporters list</label>
    <div class="alert" id="donAlert"></div>
    <button class="btn btn-amber btn-block" type="submit">Continue to payment ${icon('arrow')}</button></form>`;
  const form = $('#donForm');
  $$('.chip', form).forEach(c => c.onclick = () => { form.elements.amount.value = c.dataset.amt; $$('.chip', form).forEach(x => x.classList.toggle('on', x === c)); });
  form.onsubmit = async e => {
    e.preventDefault();
    const f = form.elements, btn = $('button[type=submit]', form);
    btn.disabled = true;
    try {
      const r = await api('/donations', { method: 'POST', body: {
        amount: Number(f.amount.value), project_id: f.project_id.value ? Number(f.project_id.value) : null,
        name: f.name.value, email: f.email.value, phone: f.phone.value, message: f.message.value, anonymous: f.anonymous.checked } });
      DON.ref = r.ref; DON.email = f.email.value; payStep(r);
    } catch (err) { fieldErrors(form, err.fields); showAlert($('#donAlert'), 'bad', err.fields ? 'Please fix the highlighted fields.' : err.message); btn.disabled = false; }
  };
  $('#donateModal').classList.add('open');
}

function payStep(r) {
  $('#donateBody').innerHTML = `${steps(2)}<h3>Complete your UPI payment</h3>
  <div class="pay-ref"><span class="muted">Your reference</span><br><b>${esc(r.ref)}</b><br><span class="muted">Amount: <b style="font-family:var(--sans)">${inr(r.amount)}</b></span></div>
  <a class="btn btn-blue btn-block" href="${esc(r.upiUrl)}">Open my UPI app (GPay, PhonePe, Paytm…)</a>
  <p class="muted center" style="margin:.8rem 0">On a computer? Scan the QR or pay to the UPI ID below, and enter ${inr(r.amount)}.</p>
  <div class="center"><img src="/images/upi-qr.png" alt="UPI QR code" style="width:150px;margin:0 auto .6rem;border-radius:10px">
  <button type="button" class="upi-id" id="copyUpi">${esc(DON.cfg.upiId)} ${icon('copy')}</button></div>
  <hr style="border:0;border-top:1px solid var(--line);margin:1.4rem 0">
  <form id="utrForm" novalidate><div class="field"><label>After paying, enter the 12-digit UPI transaction ID (UTR)</label>
  <input class="input" name="utr" inputmode="numeric" maxlength="12" placeholder="e.g. 412345678901"><div class="msg"></div></div>
  <div class="alert" id="utrAlert"></div><button class="btn btn-amber btn-block" type="submit">I've paid — submit</button></form>`;
  $('#copyUpi').onclick = () => { navigator.clipboard?.writeText(DON.cfg.upiId); toast('UPI ID copied'); };
  $('#utrForm').onsubmit = async e => {
    e.preventDefault(); const form = e.target;
    try {
      await api(`/donations/${DON.ref}/confirm`, { method: 'POST', body: { utr: form.elements.utr.value.trim(), email: DON.email } });
      doneStep();
    } catch (err) { fieldErrors(form, err.fields); if (!err.fields) showAlert($('#utrAlert'), 'bad', err.message); }
  };
}

function doneStep() {
  $('#donateBody').innerHTML = `${steps(3)}<div class="center"><div class="success-ic">${icon('check')}</div><h3>Thank you for your generosity!</h3>
  <p class="muted">We've received your payment details for <b>${esc(DON.ref)}</b>. Our team will verify it shortly, and your gift will then appear in our totals.</p>
  <button class="btn btn-blue" type="button" id="doneBtn">Close</button></div>`;
  $('#doneBtn').onclick = closeDonate;
}

/* ---------- Boot ---------- */
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
}
function countUp(el, to, money) {
  const t0 = performance.now(), dur = 1400;
  const step = t => { const k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
    el.textContent = money ? inr(v) : v.toLocaleString('en-IN'); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

(async function boot() {
  try { ME = (await api('/auth/me')).user; } catch { ME = null; }
  if (document.body.dataset.guard === 'user' && !ME) { location.href = '/login.html'; return; }
  if (document.body.dataset.guard === 'admin' && (!ME || ME.role !== 'admin')) { location.href = ME ? '/account.html' : '/login.html'; return; }
  renderHeader(); renderFooter();
  $$('[data-icon]').forEach(el => { el.outerHTML = icon(el.dataset.icon, el.className); });
  document.addEventListener('click', e => { const d = e.target.closest('[data-donate]'); if (d) { e.preventDefault(); openDonate(d.dataset.project); } });
  reveal();
  document.dispatchEvent(new CustomEvent('hol:ready'));
})();
