/* Hope of Light — page logic (runs after app.js boot) */
const IMG = { education: 'education.jpg', healthcare: 'healthcare.jpg', community: 'community.jpg', 'women-empowerment': 'women.jpg' };
const DETAIL = {
  education: { lead: 'Our "Education for All" program focuses on breaking the cycle of poverty through knowledge, bringing quality education to children in remote and underserved areas.',
    items: [['book', 'School Construction', 'Building safe, modern learning environments.'], ['users', 'Teacher Training', 'Equipping local educators with advanced teaching skills.'], ['cap', 'Scholarships', 'Financial aid for talented students who lack resources.'], ['bulb', 'Curriculum Development', 'Engaging curricula tailored to local needs.']],
    impact: 'Goal: lift literacy and reach thousands of children every year across rural India and beyond.' },
  healthcare: { lead: 'Our "Healthcare Access" program brings essential medical services to those who need them most.',
    items: [['pulse', 'Mobile Medical Clinics', 'Equipped clinics for urban slums and remote villages.'], ['shield', 'Vaccination Drives', 'Regular campaigns to prevent common diseases.'], ['heart', 'Maternal & Child Health', 'Prenatal, safe-delivery and postnatal support.'], ['bulb', 'Health Education', 'Hygiene, nutrition and disease-prevention knowledge.']],
    impact: 'Goal: serve thousands of patients every month and reduce infant mortality in our operating areas.' },
  community: { lead: 'Our "Community Development" initiatives help local populations build resilient, self-sufficient communities.',
    items: [['leaf', 'Agriculture Training', 'Modern farming techniques to boost food security and income.'], ['pulse', 'Clean Water Initiatives', 'Wells, filtration systems and sanitation education.'], ['tool', 'Infrastructure Projects', 'Community buildings, roads and energy solutions.'], ['users', 'Local Leadership', 'Training leaders to drive their community\'s progress.']],
    impact: 'Goal: support thousands of families every year with sustainable livelihoods.' },
  'women-empowerment': { lead: 'Our "Women Empowerment" program helps women achieve economic independence and leadership roles in their communities.',
    items: [['coin', 'Microfinance Programs', 'Small loans and financial-literacy training for new businesses.'], ['tool', 'Skill Workshops', 'Tailoring, crafts, digital literacy and entrepreneurship.'], ['users', 'Leadership Training', 'Confidence and skills to advocate for themselves.'], ['heart', 'Health & Rights Education', 'Health, reproductive rights and legal protections.']],
    impact: 'Goal: empower over a thousand women each year to earn their own livelihoods.' }
};
const pct = p => (p.goal_amount > 0 ? Math.min(100, Math.round(p.raised / p.goal_amount * 100)) : 0);
const bar = p => p.goal_amount > 0 ? `<div class="progress"><i data-w="${pct(p)}" style="width:0"></i></div><div class="pmeta"><span><b>${inr(p.raised)}</b> raised</span><span>${pct(p)}% of ${inr(p.goal_amount)}</span></div>` : '';
const animateBars = () => requestAnimationFrame(() => $$('.progress i[data-w]').forEach(i => i.style.width = i.dataset.w + '%'));

const PAGES = {
  async home() {
    const [s, pr, rc] = await Promise.all([api('/public/stats'), api('/public/projects'), api('/public/recent')]);
    const vals = [[s.raised, true], [s.donors, false], [s.volunteers, false], [s.projects, false]];
    $$('.stat b').forEach((el, i) => countUp(el, vals[i][0], vals[i][1]));
    $('#homeProjects').innerHTML = pr.projects.map(p => `<article class="card reveal"><img src="/images/${IMG[p.slug] || 'mission.jpg'}" alt="${esc(p.title)}" loading="lazy">
      <div class="card-body"><h3>${esc(p.title)}</h3><p class="muted">${esc(p.summary)}</p>${bar(p)}
      <div class="push"><a class="btn btn-blue btn-sm" href="/projects.html#${esc(p.slug)}">Learn more</a><button class="btn btn-amber btn-sm" data-donate data-project="${p.id}">Donate</button></div></div></article>`).join('');
    reveal(); animateBars();
    $('#wall').innerHTML = rc.donations.length
      ? rc.donations.map(d => `<span>${icon('heart')} <b>${esc(d.name)}</b> gave ${inr(d.amount)}</span>`).join('')
      : '<span>Be the first to light the way — your name could be here.</span>';
  },

  async projects() {
    const { projects } = await api('/public/projects');
    $('#projList').innerHTML = projects.map(p => {
      const d = DETAIL[p.slug] || { lead: p.summary, items: [], impact: '' };
      return `<article class="proj reveal" id="${esc(p.slug)}"><img src="/images/${IMG[p.slug] || 'mission.jpg'}" alt="${esc(p.title)}" loading="lazy">
      <div class="proj-body"><span class="tag">${icon(ICON_PROJECT[p.slug] || 'heart')} Program</span><h3 style="margin-top:.6rem">${esc(p.title)}</h3>
      <p class="muted">${esc(d.lead)}</p>
      <ul>${d.items.map(([i, t, x]) => `<li>${icon(i)}<span><b>${t}:</b> ${x}</span></li>`).join('')}</ul>
      ${d.impact ? `<div class="impact">${d.impact}</div>` : ''}${bar(p)}
      <div class="push" style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem"><button class="btn btn-amber" data-donate data-project="${p.id}">${icon('heart')} Donate</button>
      <button class="btn btn-line" data-volunteer="${p.id}">Volunteer</button></div></div></article>`;
    }).join('');
    reveal(); animateBars();
    if (location.hash) $(location.hash)?.scrollIntoView();
    $('#projList').addEventListener('click', async e => {
      const b = e.target.closest('[data-volunteer]'); if (!b) return;
      if (!ME) { location.href = '/login.html?next=projects'; return; }
      try { await api('/volunteer', { method: 'POST', body: { project_id: Number(b.dataset.volunteer), message: '' } }); toast('Application sent — we\'ll be in touch!'); b.disabled = true; b.textContent = 'Applied ✓'; }
      catch (err) { toast(err.message); }
    });
  },

  contact() {
    const form = $('#contactForm'), al = $('#contactAlert');
    form.onsubmit = async e => {
      e.preventDefault(); const f = form.elements; const btn = $('button[type=submit]', form); btn.disabled = true;
      try {
        await api('/contact', { method: 'POST', body: { name: f.name.value, email: f.email.value, subject: f.subject.value, message: f.message.value } });
        fieldErrors(form, {}); showAlert(al, 'ok', 'Thank you! Your message has been sent. We\'ll get back to you soon.'); form.reset();
      } catch (err) { fieldErrors(form, err.fields); showAlert(al, 'bad', err.fields ? 'Please fix the highlighted fields.' : err.message); }
      btn.disabled = false;
    };
    $('#contactInfo').innerHTML = [
      ['pin', 'Our address', SITE.address], ['mail', 'Email', `<a href="mailto:${SITE.email}">${SITE.email}</a>`],
      ...(SITE.phone ? [['phone', 'Phone', esc(SITE.phone)]] : []), ['clock', 'Hours', SITE.hours]
    ].map(([i, h, t]) => `<div class="contact-item"><div class="ico">${icon(i)}</div><div><h4>${h}</h4><p>${t}</p></div></div>`).join('');
  },

  register() {
    const form = $('#regForm'), al = $('#regAlert');
    form.onsubmit = async e => {
      e.preventDefault(); const f = form.elements; const btn = $('button[type=submit]', form);
      if (f.password.value !== f.confirm.value) { fieldErrors(form, { confirm: 'Passwords do not match.' }); return; }
      btn.disabled = true;
      try {
        await api('/auth/register', { method: 'POST', body: { name: f.name.value, email: f.email.value, phone: f.phone.value, password: f.password.value, interest: f.interest.value } });
        showAlert(al, 'ok', 'Welcome to the family! Redirecting…'); setTimeout(() => location.href = '/account.html', 900);
      } catch (err) { fieldErrors(form, err.fields); showAlert(al, 'bad', err.fields ? 'Please fix the highlighted fields.' : err.message); btn.disabled = false; }
    };
  },

  login() {
    const form = $('#loginForm'), al = $('#loginAlert');
    if (ME) { location.href = '/account.html'; return; }
    form.onsubmit = async e => {
      e.preventDefault(); const f = form.elements; const btn = $('button[type=submit]', form); btn.disabled = true;
      try {
        const { user } = await api('/auth/login', { method: 'POST', body: { email: f.email.value, password: f.password.value } });
        const next = new URLSearchParams(location.search).get('next');
        location.href = user.role === 'admin' ? '/admin.html' : (next === 'projects' ? '/projects.html' : '/account.html');
      } catch (err) { fieldErrors(form, err.fields); showAlert(al, 'bad', err.message); btn.disabled = false; }
    };
  }
};

document.addEventListener('hol:ready', () => {
  const fn = PAGES[document.body.dataset.page];
  if (fn) Promise.resolve(fn()).catch(err => { console.error(err); toast('Could not load some content. Is the server running?'); });
});
