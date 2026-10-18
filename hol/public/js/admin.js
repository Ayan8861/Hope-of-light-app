/* Admin panel */
const ST = { pending: ['warn', 'Awaiting payment'], submitted: ['warn', 'Needs review'], verified: ['ok', 'Verified'], rejected: ['bad', 'Rejected'], approved: ['ok', 'Approved'] };
const stag = s => `<span class="tag ${ST[s][0]}">${ST[s][1]}</span>`;
let TAB = 'overview';

const views = {
  async overview() {
    const o = await api('/admin/overview'); const max = Math.max(1, ...o.monthly.map(m => m.total));
    $('#kpis').innerHTML = [[inr(o.raised), 'Verified raised'], [o.toReview, 'Donations to review'], [o.donors, 'Donors'], [o.members, 'Members'], [o.pendingVolunteers, 'Pending volunteers'], [o.unread, 'Unread messages']]
      .map(([b, s]) => `<div class="kpi"><b>${b}</b><span>${s}</span></div>`).join('');
    return `<div class="grid g2"><div class="panel"><h3>Verified donations — last 6 months</h3>${o.monthly.length ? `<div class="bars">${o.monthly.map(m => `<div class="bar"><b>${inr(m.total)}</b><i style="height:${Math.max(4, m.total / max * 100)}%"></i><span>${esc(m.label)}</span></div>`).join('')}</div>` : '<p class="empty">No verified donations yet.</p>'}</div>
      <div class="panel"><h3>By program</h3>${o.byProject.map(p => `<div style="margin-bottom:1rem"><div class="pmeta"><b style="color:var(--ink)">${esc(p.title)}</b><span>${inr(p.raised)}</span></div><div class="progress"><i style="width:${p.goal_amount > 0 ? Math.min(100, p.raised / p.goal_amount * 100) : 0}%"></i></div></div>`).join('') || '<p class="empty">No programs.</p>'}</div></div>`;
  },
  async donations() {
    const { donations } = await api('/admin/donations');
    return `<p><a class="btn btn-line btn-sm" href="/api/admin/donations.csv">Export CSV</a></p><div class="table-wrap"><table><thead><tr><th>Date</th><th>Ref</th><th>Donor</th><th>Cause</th><th>Amount</th><th>UTR</th><th>Status</th><th></th></tr></thead><tbody>${donations.map(d =>
      `<tr><td>${fmtDate(d.created_at)}</td><td>${esc(d.ref)}</td><td>${esc(d.donor_name)}<br><span class="muted">${esc(d.donor_email)}</span></td><td>${esc(d.project || 'General')}</td><td><b>${inr(d.amount)}</b></td><td>${esc(d.utr || '—')}</td><td>${stag(d.status)}</td>
      <td>${d.status === 'submitted' ? `<button class="btn btn-ok btn-sm" data-act="donations" data-id="${d.id}" data-s="verified">Verify</button><button class="btn btn-bad btn-sm" data-act="donations" data-id="${d.id}" data-s="rejected">Reject</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="8" class="empty">No donations yet.</td></tr>'}</tbody></table></div>
      <p class="muted" style="margin-top:.8rem">Match each UTR against your UPI app's transaction history before verifying. Only verified gifts count toward public totals.</p>`;
  },
  async volunteers() {
    const { applications } = await api('/admin/volunteers');
    return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Volunteer</th><th>Contact</th><th>Program</th><th>Status</th><th></th></tr></thead><tbody>${applications.map(a =>
      `<tr><td>${fmtDate(a.created_at)}</td><td>${esc(a.name)}<br><span class="muted">${esc(a.interest || '')}</span></td><td>${esc(a.email)}<br>${esc(a.phone)}</td><td>${esc(a.project || 'Anywhere')}</td><td>${stag(a.status)}</td>
      <td>${a.status === 'pending' ? `<button class="btn btn-ok btn-sm" data-act="volunteers" data-id="${a.id}" data-s="approved">Approve</button><button class="btn btn-bad btn-sm" data-act="volunteers" data-id="${a.id}" data-s="rejected">Reject</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">No applications yet.</td></tr>'}</tbody></table></div>`;
  },
  async messages() {
    const { messages } = await api('/admin/messages');
    return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>From</th><th>Subject</th><th>Message</th><th></th></tr></thead><tbody>${messages.map(m =>
      `<tr><td>${fmtDate(m.created_at)}</td><td>${esc(m.name)}<br><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></td><td>${m.is_read ? '' : '<span class="tag warn">New</span> '}${esc(m.subject)}</td><td>${esc(m.body)}</td>
      <td>${m.is_read ? '' : `<button class="btn btn-line btn-sm" data-act="messages" data-id="${m.id}" data-s="read">Mark read</button>`}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">No messages.</td></tr>'}</tbody></table></div>`;
  },
  async projects() {
    const { projects } = await api('/admin/projects');
    return `<div class="table-wrap"><table><thead><tr><th>Program</th><th>Raised</th><th>Goal (INR)</th><th>Visible</th><th></th></tr></thead><tbody>${projects.map(p =>
      `<tr><td><b>${esc(p.title)}</b></td><td>${inr(p.raised)}</td><td><input class="input" style="max-width:150px" type="number" min="0" value="${p.goal_amount}" id="goal${p.id}"></td>
      <td><input type="checkbox" id="act${p.id}" ${p.active ? 'checked' : ''}></td><td><button class="btn btn-blue btn-sm" data-save="${p.id}">Save</button></td></tr>`).join('')}</tbody></table></div>`;
  }
};

async function show(k) {
  TAB = k; $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === k));
  $('#tabBody').innerHTML = '<div class="panel empty">Loading…</div>';
  try { $('#tabBody').innerHTML = await views[k](); } catch (e) { $('#tabBody').innerHTML = `<div class="panel empty">${esc(e.message)}</div>`; }
  if (k !== 'overview') api('/admin/overview').then(o => { $('#kpis').innerHTML = [[inr(o.raised), 'Verified raised'], [o.toReview, 'Donations to review'], [o.donors, 'Donors'], [o.members, 'Members'], [o.pendingVolunteers, 'Pending volunteers'], [o.unread, 'Unread messages']].map(([b, s]) => `<div class="kpi"><b>${b}</b><span>${s}</span></div>`).join(''); }).catch(() => {});
}

document.addEventListener('hol:ready', () => {
  $$('#tabs button').forEach(b => b.onclick = () => show(b.dataset.tab));
  $('#tabBody').addEventListener('click', async e => {
    const a = e.target.closest('[data-act]'), s = e.target.closest('[data-save]');
    try {
      if (a) { await api(`/admin/${a.dataset.act}/${a.dataset.id}`, { method: 'PATCH', body: { status: a.dataset.s } }); toast('Updated'); show(TAB); }
      if (s) { const id = s.dataset.save; await api(`/admin/projects/${id}`, { method: 'PATCH', body: { goal_amount: Number($('#goal' + id).value), active: $('#act' + id).checked } }); toast('Saved'); show(TAB); }
    } catch (err) { toast(err.message); }
  });
  show('overview');
});
