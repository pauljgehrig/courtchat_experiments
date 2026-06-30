/* ============================================================
   CourtChat Admin — app shell + hash router + view renderers.
   No framework. Renders strings into #content on hashchange.
   ============================================================ */

const D = window.DATA;

/* ---------- helpers ---------- */
const pct = (n, d = 0) => (n * 100).toFixed(d) + "%";
const num = (n) => n.toLocaleString("en-US");
const money = (n) => "$" + n.toLocaleString("en-US");
const go = (hash) => { location.hash = hash; };
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function statusBadge(status) {
  const map = {
    delivered: "success", received: "info", failed: "danger",
    ok: "success", warning: "warning", danger: "danger", info: "info",
    pending: "gray", approved: "success", rejected: "danger",
  };
  return `<span class="badge ${map[status] || "gray"}"><span class="dot"></span>${esc(status)}</span>`;
}

function bars(rows, { max, drill } = {}) {
  const top = max || Math.max(...rows.map((r) => r.value));
  return `<div class="bars">${rows.map((r) => `
    <div class="bar-row ${r.onclick ? "clickable" : ""}" ${r.onclick ? `onclick="${r.onclick}"` : ""}>
      <div class="blabel">${esc(r.label)}</div>
      <div class="bar-track"><div class="bar-fill ${r.alt ? "alt" : ""}" style="width:${Math.max(2, (r.value / top) * 100)}%"></div></div>
      <div class="bval">${r.display != null ? r.display : r.value}</div>
    </div>`).join("")}</div>`;
}

function sparkline(values, color = "var(--purple)") {
  const w = 260, h = 44, pad = 3;
  const max = Math.max(...values), min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function pageHead(title, desc, prdRef) {
  return `<div class="page-head">
    <h1>${esc(title)} ${prdRef ? `<span class="target-pill">PRD ${prdRef}</span>` : ""}</h1>
    ${desc ? `<div class="desc">${desc}</div>` : ""}
  </div>`;
}

function breadcrumb(parts) {
  return `<div class="breadcrumb">${parts.map((p, i) =>
    (i ? `<span class="sep">/</span>` : "") +
    (p.hash ? `<a onclick="go('${p.hash}')">${esc(p.label)}</a>` : esc(p.label))
  ).join("")}</div>`;
}

/* ---------- navigation ---------- */
const NAV = [
  { group: "Operational console", note: "Internal · may show PII", items: [
    { id: "review", icon: "✓", label: "Review queue", hash: "#/review" },
    { id: "users", icon: "◑", label: "User view", hash: "#/users/u-204" },
    { id: "messages", icon: "✉", label: "Message types", hash: "#/messages" },
    { id: "pipeline", icon: "❤", label: "Pipeline health", hash: "#/pipeline" },
  ]},
  { group: "Analytics", note: "Exportable · PII-free", items: [
    { id: "funnel", icon: "▤", label: "Onboarding funnel", hash: "#/funnel" },
    { id: "retention", icon: "↻", label: "Engagement & retention", hash: "#/retention" },
    { id: "outcomes", icon: "★", label: "Outcomes by court", hash: "#/outcomes" },
  ]},
];

const ANALYTICS_VIEWS = new Set(["funnel", "retention", "outcomes"]);

function renderSidebar(activeId) {
  const groups = NAV.map((g) => `
    <div class="nav-group">
      <div class="nav-label">${g.group}</div>
      ${g.items.map((it) => `
        <a class="nav-link ${it.id === activeId ? "active" : ""}" onclick="go('${it.hash}')">
          <span class="ico">${it.icon}</span><span>${it.label}</span>
        </a>`).join("")}
    </div>`).join("");
  document.getElementById("sidebar").innerHTML = `
    <div class="brand">
      <div class="brand-mark">C</div>
      <div><div class="brand-name">CourtChat</div><div class="brand-sub">Admin · unBail Labs</div></div>
    </div>
    ${groups}
    <div class="nav-foot">Prototype · dummy data<br>Source: admin-panel-prd</div>`;
}

function renderTopbar(activeId) {
  const f = D.filters;
  const isAnalytics = ANALYTICS_VIEWS.has(activeId);
  document.getElementById("topbar").innerHTML = `
    <span class="filter"><span class="k">Dates</span> ${f.dateRange} <span class="caret">▾</span></span>
    <span class="filter"><span class="k">Court</span> ${f.court} <span class="caret">▾</span></span>
    <span class="filter"><span class="k">Cohort</span> ${f.cohort} <span class="caret">▾</span></span>
    <span class="spacer"></span>
    <span class="asof">Data as of ${f.asOf}</span>
    ${isAnalytics
      ? `<button class="btn sm">⤓ Export CSV</button><button class="btn sm primary">⎙ Export deck</button>`
      : `<span class="pii-badge">● Internal · may show PII</span>`}`;
}

/* ============================================================
   VIEWS
   ============================================================ */

/* ---- 3a Review & approve queue ---- */
function viewReview() {
  const c = D.review.current;
  const confLow = c.confidence < 0.85;
  return pageHead("Review &amp; approve queue",
    "The next pending case-update notification, with extracted fields, rendered preview, and GPT reasoning. Approving is the unit counted by every downstream metric.", "3a") + `
    <div class="row" style="align-items:flex-start">
      <div class="stack" style="flex:1.4">
        <div class="card">
          <div class="card-head">
            <h3>Next pending · ${c.category}</h3>
            <span class="badge gray">${c.case}</span>
            <span class="spacer"></span>
            <span class="sub">Defendant</span>
            <a class="badge" onclick="go('#/users/${c.userId}')" style="cursor:pointer">${esc(c.defendant)} →</a>
          </div>
          <div class="card-pad">
            <div class="confidence mb8">
              <span class="sub" style="font-size:12px;color:var(--muted)">GPT confidence</span>
              <div class="conf-track"><div class="conf-fill ${confLow ? "low" : ""}" style="width:${c.confidence * 100}%"></div></div>
              <strong>${pct(c.confidence)}</strong>
              <span class="proto-flag">· ${esc(c.event)}</span>
            </div>
            <div class="kv mt8">
              ${c.fields.map((f) => `<div class="k">${esc(f.label)}</div><div>${esc(f.value)}</div>`).join("")}
            </div>
            <div class="divider"></div>
            <div class="sub" style="font-size:12px;color:var(--muted);margin-bottom:6px">Rendered message preview</div>
            <div class="tl-bubble tl-out" style="max-width:none">${esc(c.preview)}</div>
            <div class="row mt20">
              <button class="btn success">✓ Approve &amp; queue</button>
              <button class="btn">Reject</button>
              <button class="btn ghost">Skip</button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h3>Raw <span class="mono" style="font-size:12px">gptResult</span></h3><span class="sub">two-pass · ${esc(c.gptResult.model)}</span></div>
          <div class="card-pad">
            <div class="proto-flag mb8">Original docket entry</div>
            <div class="code-block">${esc(c.original)}</div>
            <div class="proto-flag mb8 mt14">Pipeline output</div>
            <div class="code-block">${esc(JSON.stringify(c.gptResult, null, 2))}</div>
          </div>
        </div>
      </div>

      <div class="stack" style="flex:1">
        <div class="card">
          <div class="card-head"><h3>Backlog</h3><span class="badge">${D.review.backlogCount} pending</span></div>
          <table class="tbl">
            <thead><tr><th>Case</th><th>Category</th><th>Court</th><th class="num">Age</th></tr></thead>
            <tbody>${D.review.backlog.map((b) => `
              <tr><td class="mono">${b.case}</td><td>${b.category}</td><td>${b.court}</td><td class="num">${b.age}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-head">
            <h3>Sub-0.85 confidence drops</h3>
            <span class="badge warning">${D.review.drops.length} new</span>
          </div>
          <div class="card-pad"><div class="section-note mb8">Net-new: today these are silently discarded. Persisting them (<span class="mono">status='dropped'</span>) makes them reviewable.</div></div>
          <table class="tbl">
            <thead><tr><th>Case</th><th>Guess</th><th class="num">Conf</th></tr></thead>
            <tbody>${D.review.drops.map((d) => `
              <tr><td class="mono">${d.case}</td><td>${d.subject}</td><td class="num">${pct(d.conf)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

/* ---- 3b User-level view (drill-down target) ---- */
function viewUser(id) {
  const u = D.users[id] || D.users["u-204"];
  const crumb = breadcrumb([{ label: "User view" }, { label: u.name }]);
  return crumb + pageHead(u.name,
    "The whole story of one participant — message history, engagement, cohort, and case context. Where every analytics drill-down lands.", "3b") + `
    <div class="row" style="align-items:flex-start">
      <div class="stack" style="flex:1.5">
        <div class="card">
          <div class="card-head"><h3>Message timeline</h3><span class="sub">outbound notifications interleaved with inbound replies</span></div>
          <div class="card-pad">
            <div class="timeline">
              ${u.timeline.map((t) => `
                <div class="tl-item">
                  <div class="tl-time">${esc(t.time)}</div>
                  <div>
                    <div class="tl-bubble ${t.dir === "out" ? "tl-out" : "tl-in"}">${esc(t.text)}</div>
                    <div class="tl-meta">${t.dir === "out" ? "↑ " + esc(t.category) : "↓ reply"} · ${statusBadge(t.status)}</div>
                  </div>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="stack" style="flex:1">
        <div class="grid c2">
          <div class="card kpi"><div class="label">Engagement score</div><div class="value">${pct(u.engagementScore)}</div><div class="meta">rolls up to retention</div></div>
          <div class="card kpi"><div class="label">Triggers to 1st</div><div class="value">${u.triggersToFirst}</div><div class="meta">target 2.5</div></div>
        </div>
        <div class="card card-pad">
          <div class="kv">
            <div class="k">Phone</div><div class="mono">${esc(u.phone)}</div>
            <div class="k">A/B cohort</div><div><span class="badge ${u.cohort.includes("Intervention") ? "" : "gray"}">${esc(u.cohort)}</span></div>
            <div class="k">Court</div><div>${esc(u.court)}</div>
            <div class="k">Opted out</div><div>${u.optedOut ? '<span class="badge danger">⚠ opted out (STOP)</span>' : '<span class="badge success">subscribed</span>'}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Case context</h3></div>
          <div class="card-pad">
            <div class="kv">
              <div class="k">Case</div><div class="mono">${esc(u.case.id)}</div>
              <div class="k">Status</div><div><span class="badge gray">${esc(u.case.status)}</span></div>
              <div class="k">Type</div><div>${esc(u.case.type)}</div>
              <div class="k">Next event</div><div>${esc(u.case.nextEvent)}</div>
              <div class="k">Warrant / FTA</div><div>${u.case.warrant ? '<span class="badge danger">⚠ warrant issued</span>' : '<span class="badge success">none</span>'}</div>
            </div>
            <div class="divider"></div>
            <div class="sub" style="font-size:12px;color:var(--muted);margin-bottom:6px">Charges</div>
            <ul class="list-reset">${u.charges.map((c) => `<li class="badge gray" style="margin:2px 4px 2px 0">${esc(c)}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </div>`;
}

/* ---- 3c Message-type performance ---- */
function viewMessages() {
  return pageHead("Message-type performance",
    "How each message category performs — which types earn replies and which fatigue users. The direct input to tuning the message library.", "3c") + `
    <div class="card">
      <div class="card-head"><h3>By category</h3><span class="sub">filterable by court &amp; cohort (intervention vs. control)</span></div>
      <table class="tbl">
        <thead><tr>
          <th>Category</th><th class="num">Sent</th><th class="num">Delivered</th>
          <th class="num">Failed</th><th class="num">Response rate</th><th class="num">Opt-out after</th>
        </tr></thead>
        <tbody>${D.messageTypes.map((m) => `
          <tr>
            <td class="strong">${esc(m.category)}</td>
            <td class="num">${num(m.sent)}</td>
            <td class="num">${num(m.delivered)}</td>
            <td class="num">${m.failed}</td>
            <td class="num"><strong>${pct(m.responseRate)}</strong></td>
            <td class="num">${pct(m.optOutAfter, 1)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="card mt14">
      <div class="card-head"><h3>Response rate by category</h3></div>
      <div class="card-pad">${bars(D.messageTypes.map((m) => ({ label: m.category.split(" (")[0], value: Math.round(m.responseRate * 100), display: pct(m.responseRate) })))}</div>
    </div>
    <div class="section-note mt14">Net-new dependency: <strong>reply attribution</strong> — persist each inbound reply linked to the most recent notification on that number, so a reply can be tied to a category.</div>`;
}

/* ---- 3d Pipeline & delivery health ---- */
function viewPipeline() {
  const p = D.pipeline;
  const tile = (r) => `
    <div class="card kpi">
      <div class="label">${esc(r.label)} ${r.code && r.code !== "—" ? `<span class="mono">${r.code}</span>` : ""}</div>
      <div class="value">${r.count}</div>
      <div class="meta"><span class="trend ${r.trend.startsWith("+") ? "down" : "up"}">${r.trend} vs prev</span> · ${statusBadge(r.level)}</div>
    </div>`;
  return pageHead("Pipeline &amp; delivery health",
    "The debugging cockpit for silent failure modes — Twilio errors, GPT drops, scraper breaks, and send-safety. Makes failures observable before they corrupt metrics or strand a user.", "3d") + `
    <div class="card card-pad mb8" style="display:flex;align-items:center;gap:14px;background:${p.sendFlag.value ? "var(--success-tint)" : "var(--danger-tint)"}">
      <span class="badge ${p.sendFlag.value ? "success" : "danger"}"><span class="dot"></span>SEND_NOTIFICATIONS = ${p.sendFlag.value}</span>
      <span class="sub">Last successful send: <strong>${esc(p.sendFlag.lastSuccessfulSend)}</strong></span>
    </div>

    <h3 class="mt20 mb8" style="font-size:14px">Twilio delivery</h3>
    <div class="grid c3">${p.twilio.map(tile).join("")}</div>

    <h3 class="mt20 mb8" style="font-size:14px">GPT pipeline</h3>
    <div class="grid c3">${p.gpt.map(tile).join("")}
      <div class="card kpi" style="cursor:pointer" onclick="go('#/review')"><div class="label">↳ review the drops</div><div class="value drill">3a</div><div class="meta">open review queue →</div></div>
    </div>

    <h3 class="mt20 mb8" style="font-size:14px">Scraper jobs</h3>
    <div class="card">
      <table class="tbl">
        <thead><tr><th>Job</th><th>Status</th><th>Last run</th><th>Note</th></tr></thead>
        <tbody>${p.scraper.map((s) => `
          <tr><td class="strong">${esc(s.job)}</td><td>${statusBadge(s.status)}</td><td>${esc(s.lastRun)}</td><td class="sub">${esc(s.note)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

/* ---- 4a Onboarding funnel ---- */
function viewFunnel() {
  const f = D.funnel;
  const top = f.steps[0].count;
  return pageHead("Onboarding funnel",
    "Acquisition &amp; activation — the path from search to first interaction, with drop-off at each step. Click any step to drill into the users who dropped.", "4a") + `
    <div class="grid c4 mb8">
      <div class="card kpi"><div class="label">Qualified completion</div><div class="value">${pct(f.qualifiedCompletion)}</div><div class="meta"><span class="target-pill">target 75%</span></div></div>
      <div class="card kpi"><div class="label">Case-search error rate</div><div class="value drill" onclick="alert('Drill-down → list of errored / out-of-scope searches (prototype)')">${pct(f.caseSearchErrorRate)}</div><div class="meta">click to drill</div></div>
      <div class="card kpi"><div class="label">Reverse-search errors</div><div class="value">${f.reverseSearchErrors}</div><div class="meta">out-of-scope queries</div></div>
      <div class="card kpi"><div class="label">Triggers to 1st interaction</div><div class="value">${f.triggersToFirst}</div><div class="meta"><span class="target-pill">target 2.5</span></div></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>Funnel</h3><span class="sub">click a step → the users who dropped there (→ 3b)</span></div>
      <div class="card-pad">
        <div class="funnel">
          ${f.steps.map((s, i) => `
            ${i ? `<div class="funnel-arrow">▼ ${s.dropPct != null ? `<span style="color:var(--danger)">${pct(s.dropPct)} drop</span>` : ""}</div>` : ""}
            <div class="funnel-step" onclick="drillFunnel('${esc(s.name)}')" style="--w:${(s.count / top) * 100}%">
              <div class="fname">${esc(s.name)}</div>
              <div class="fcount">${num(s.count)}</div>
              <div class="fdrop">${i === 0 ? '<span class="proto-flag">entry</span>' : ""}</div>
            </div>`).join("")}
        </div>
      </div>
    </div>
    <div class="section-note mt14">Net-new: a <strong>qualified</strong> marker on each signup start, to separate qualified from unqualified drop-off (open question 4).</div>`;
}

/* ---- 4b Engagement & retention ---- */
function viewRetention() {
  const r = D.retention;
  const maxBucket = Math.max(...r.scoreDistribution.map((b) => b.users));
  return pageHead("Engagement &amp; retention",
    "The key product lever — retention over time, with cohort and court breakouts. This is where intervention-vs-control impact shows up in aggregate.", "4b") + `
    <div class="grid c4 mb8">
      <div class="card kpi">
        <div class="label">Avg engagement rate</div>
        <div class="value drill" onclick="drillEngagement()">${pct(r.avgEngagementRate)}</div>
        <div class="meta"><span class="target-pill">target ${pct(r.target)}</span> · click to drill</div>
      </div>
      <div class="card kpi"><div class="label">CSAT</div><div class="value">${pct(r.csat)}</div><div class="meta"><span class="target-pill">target 85%</span></div></div>
      <div class="card kpi"><div class="label">Q&amp;A engagement</div><div class="value">${r.qAndAEngagement}</div><div class="meta">questions submitted</div></div>
      <div class="card kpi"><div class="label">Prompt engagement</div><div class="value" style="font-size:18px;padding-top:8px">${esc(r.promptEngagement)}</div><div class="meta">aggregate</div></div>
    </div>
    <div class="row">
      <div class="card" style="flex:1">
        <div class="card-head"><h3>Engagement rate trend</h3><span class="sub">last 8 weeks</span></div>
        <div class="card-pad">${sparkline(r.engagementTrend)}<div class="proto-flag mt8">approaching the 30% target</div></div>
      </div>
      <div class="card" style="flex:1">
        <div class="card-head"><h3>Opt-out trend</h3><span class="sub">% per week</span></div>
        <div class="card-pad">${sparkline(r.optOutTrend, "var(--danger)")}<div class="proto-flag mt8">click in production → users who opted out (→ 3b)</div></div>
      </div>
    </div>
    <div class="card mt14">
      <div class="card-head"><h3>Engagement-score distribution</h3><span class="sub">click a bucket → the users in it (→ 3b)</span></div>
      <div class="card-pad">${bars(r.scoreDistribution.map((b) => ({ label: b.bucket, value: b.users, display: num(b.users), onclick: `drillBucket('${b.bucket}')` })), { max: maxBucket })}</div>
    </div>`;
}

/* ---- 4c Outcomes & cost savings ---- */
function viewOutcomes() {
  const o = D.outcomes;
  const totalRealized = o.byCourt.reduce((s, c) => s + c.savingsRealized, 0);
  const totalProjected = o.byCourt.reduce((s, c) => s + c.savingsProjected, 0);
  return pageHead("Outcomes &amp; cost savings by court",
    "The court-facing centerpiece — mission metrics segmented by court system, built to drop into a court deck. Every number is one click from the people behind it.", "4c") + `
    <div class="grid c4 mb8">
      <div class="card kpi">
        <div class="label">Appearance rate (1 − FTA)</div>
        <div class="value">${pct(o.overall.appearanceRate)}</div>
        <div class="meta"><span class="trend up">▲ vs ${pct(1 - D.outcomes.baseline.ftaRate)} baseline</span> · <span class="target-pill">target 90%</span></div>
      </div>
      <div class="card kpi">
        <div class="label">Warrants issued (FTA)</div>
        <div class="value drill" onclick="go('#/outcomes/fta')">${o.overall.warrants}</div>
        <div class="meta">FTA ${pct(o.overall.ftaRate)} · click to drill →</div>
      </div>
      <div class="card kpi"><div class="label">Cases served</div><div class="value">${num(o.overall.casesServed)}</div><div class="meta">${o.overall.activePerDay} active / day</div></div>
      <div class="card kpi"><div class="label">Cost savings (realized)</div><div class="value">${money(totalRealized)}</div><div class="meta">+ ${money(totalProjected)} projected</div></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>By court system</h3><span class="sub">$1,500 / felony FTA · $850 / misdemeanor FTA averted</span></div>
      <table class="tbl">
        <thead><tr>
          <th>Court</th><th class="num">Appearance rate</th><th class="num">Warrants</th>
          <th class="num">Cases served</th><th class="num">Savings (realized)</th><th class="num">Savings (projected)</th>
        </tr></thead>
        <tbody>${o.byCourt.map((c) => `
          <tr>
            <td class="strong">${esc(c.court)}</td>
            <td class="num">${pct(c.appearanceRate)}</td>
            <td class="num drillable" onclick="go('#/outcomes/fta')">${c.warrants}</td>
            <td class="num">${num(c.casesServed)}</td>
            <td class="num">${money(c.savingsRealized)}</td>
            <td class="num sub">${money(c.savingsProjected)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="section-note mt14"><strong>Drill-down:</strong> appearance rate / warrants → the list of users who failed to appear → their user view (3b). Export strips this click-through for any PII-free court deck.</div>`;
}

/* ---- Instance list: FTA users (level 2 of drill-down) ---- */
function viewFtaList() {
  const o = D.outcomes;
  return breadcrumb([{ label: "Outcomes", hash: "#/outcomes" }, { label: "Users with FTA warrants" }]) +
    pageHead("Users who failed to appear",
      `The ${o.ftaUsers.length} records behind <strong>“Warrants ${o.overall.warrants}”</strong>. Inherits the dashboard’s court / cohort / date filters. Click a row → that user’s view.`) + `
    <div class="card">
      <div class="card-head"><h3>Instance list</h3><span class="badge gray">inherits filters: ${D.filters.dateRange} · ${D.filters.court} · ${D.filters.cohort}</span></div>
      <table class="tbl">
        <thead><tr><th>Name</th><th>Court</th><th>Case</th><th>Type</th><th>Warrant date</th><th>Cohort</th><th></th></tr></thead>
        <tbody>${o.ftaUsers.map((u) => `
          <tr class="clickable" onclick="go('#/users/${u.userId}')">
            <td class="strong">${esc(u.name)}</td>
            <td>${esc(u.court)}</td>
            <td class="mono">${esc(u.case)}</td>
            <td>${esc(u.type)}</td>
            <td>${esc(u.warrantDate)}</td>
            <td><span class="badge ${u.cohort.includes("Intervention") ? "" : "gray"}">${esc(u.cohort)}</span></td>
            <td class="sub">→</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="section-note mt14">This is level 2 of the <strong>drill-down model</strong>: aggregate → <em>instance list</em> → entity. Internal-only; stripped from exports because it exposes PII.</div>`;
}

/* ---- drill-down stubs that route or explain ---- */
function drillFunnel(step) { alert(`Drill-down (prototype):\n\n“${step}” → the list of users who dropped at this step → each one’s user view (3b).`); }
function drillEngagement() { alert("Drill-down (prototype):\n\nAvg engagement rate → the active users in this average → each user's view (3b)."); }
function drillBucket(b) { alert(`Drill-down (prototype):\n\nScore bucket ${b} → the users in this bucket → each user's view (3b).`); }

/* ============================================================
   ROUTER
   ============================================================ */
function router() {
  const hash = location.hash || "#/review";
  const parts = hash.replace(/^#\//, "").split("/");
  const root = parts[0];

  let activeId = root, html = "";
  switch (root) {
    case "review": html = viewReview(); activeId = "review"; break;
    case "users": html = viewUser(parts[1]); activeId = "users"; break;
    case "messages": html = viewMessages(); activeId = "messages"; break;
    case "pipeline": html = viewPipeline(); activeId = "pipeline"; break;
    case "funnel": html = viewFunnel(); activeId = "funnel"; break;
    case "retention": html = viewRetention(); activeId = "retention"; break;
    case "outcomes":
      if (parts[1] === "fta") { html = viewFtaList(); } else { html = viewOutcomes(); }
      activeId = "outcomes"; break;
    default: html = viewReview(); activeId = "review";
  }

  renderSidebar(activeId);
  renderTopbar(activeId);
  document.getElementById("content").innerHTML = html;
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => { if (!location.hash) location.hash = "#/review"; router(); });
