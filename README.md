# courtchat_experiments

Throwaway prototypes and explorations for CourtChat. Communication artifacts for
engineering and stakeholders — **not** production code.

## courtchat-admin

A lightweight, self-contained UI scaffold of the **CourtChat admin platform**, sketched
in broad strokes with dummy data so engineering has a clear picture of the intended
functionality, organization, and behavior.

Built directly from the [Admin Panel PRD](https://github.com/pauljgehrig/courtchat_knowledgebase/blob/main/docs/knowledgebase/07-admin-panel-prd.md).

### View it

No build step. Either:

- Open `courtchat-admin/index.html` directly in a browser, **or**
- Serve the folder and open it: `cd courtchat-admin && python3 -m http.server 8080` → http://localhost:8080

### What's in it

The two-mode admin panel, all 7 views, navigable via the left sidebar:

**Operational console** (internal · may show PII)
- **Review queue** (3a) — next pending notification, extracted fields, GPT confidence + raw `gptResult`, backlog, sub-0.85 drop list
- **User view** (3b) — one participant's message timeline, engagement, cohort, case context *(the drill-down landing target)*
- **Message types** (3c) — per-category sent / delivered / failed / response rate
- **Pipeline health** (3d) — Twilio errors, GPT drops, scraper status, `SEND_NOTIFICATIONS` flag

**Analytics** (exportable · PII-free render)
- **Onboarding funnel** (4a) — step-by-step drop-off
- **Engagement & retention** (4b) — engagement rate vs. target, score distribution, trends, CSAT
- **Outcomes by court** (4c) — appearance rate, warrants, cost savings by court system

### The drill-down model (the interactive part)

Every aggregate metric is a front door to the records behind it, in three real levels.
Try it: **Outcomes → "Warrants 12"** → instance list of users with FTA warrants →
click a row → that user's view (3b). Other interactions (forms, approve/reject, some
metric clicks) are dummy and either inert or show an explainer.

### Editing

- **Content / dummy data** → `courtchat-admin/data.js` (one plain object, organized by view)
- **Layout / views** → `courtchat-admin/app.js` (one render function per view)
- **Styling / brand tokens** → `courtchat-admin/styles.css`

### Spec

[`docs/specs/2026-06-30-courtchat-admin-scaffold.md`](docs/specs/2026-06-30-courtchat-admin-scaffold.md)
