/* Member dashboard */
const TAGS = { pending: ['warn', 'Awaiting payment'], submitted: ['warn', 'Under review'], verified: ['ok', 'Verified'], rejected: ['bad', 'Rejected'], approved: ['ok', 'Approved'] };
const tag = s => `<span class="tag ${TAGS[s][0]}">${TAGS[s][1]}</span>`;

document.addEventListener('hol:ready', async () => {
  $('#hello').textContent = `Hello, ${ME.name.split(' ')[0]} 👋`;
  const [d, v] = await Promise.all([api('/donations/mine'), api('/volunteer/mine')]);
  const total = d.donations.filter(x => x.status === 'verified').reduce((s, x) => s + x.amount, 0);
  $('#myKpis').innerHTML = `<div class="kpi"><b>${inr(total)}</b><span>Verified giving</span></div><div class="kpi"><b>${d.donations.length}</b><span>Donations made</span></div><div class="kpi"><b>${v.applications.length}</b><span>Volunteer applications</span></div>`;
  const views = {
    don: () => d.donations.length ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Reference</th><th>Cause</th><th>Amount</th><th>Status</th></tr></thead><tbody>${d.donations.map(x =>
      `<tr><td>${fmtDate(x.created_at)}</td><td>${esc(x.ref)}</td><td>${esc(x.project || 'General fund')}</td><td><b>${inr(x.amount)}</b></td><td>${tag(x.status)}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="panel empty">No donations yet. <button class="btn btn-amber btn-sm" data-donate>Make your first gift</button></div>',
    vol: () => v.applications.length ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Program</th><th>Status</th></tr></thead><tbody>${v.applications.map(x =>
      `<tr><td>${fmtDate(x.created_at)}</td><td>${esc(x.project || 'Anywhere I\'m needed')}</td><td>${tag(x.status)}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="panel empty">You haven\'t applied yet. <a class="btn btn-blue btn-sm" href="/projects.html">Browse programs</a></div>'
  };
  const show = k => { $('#tabBody').innerHTML = views[k](); $$('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === k)); };
  $$('.tabs button').forEach(b => b.onclick = () => show(b.dataset.tab));
  show('don');
});
