# CourtChat Admin Scaffold — Status & Next Steps

_Last updated: 2026-06-30_

Pick-up notes for the `courtchat-admin` prototype. Read this first when resuming.

## What this is

A lightweight, **static, no-build** UI scaffold of the CourtChat admin platform —
sketched in broad strokes with dummy data so engineering has a clear picture of the
intended functionality, organization, and behavior. **Communication artifact, not
production code.** Built from the
[Admin Panel PRD](https://github.com/pauljgehrig/courtchat_knowledgebase/blob/main/docs/knowledgebase/07-admin-panel-prd.md).

## Locked decisions

- **Static multi-view prototype**, no framework/build, runs from `file://` or Pages.
- **Not** seeding production code → deliberately not built on the shadcn design-system registry.
- Single self-contained artifact; **easy to iterate** (data separate from layout).
- Drill-down model kept genuinely interactive; everything else is dummy/static.

## Current state — DONE

- All **7 PRD views** built and navigable: review queue (3a), user view (3b),
  message types (3c), pipeline health (3d), funnel (4a), retention (4b), outcomes (4c).
- App shell: sidebar (two modes), top-bar filters, "data as of" stamp, Export buttons
  (analytics only), Internal/PII badge (operational only).
- **Live drill-down path:** Outcomes → "Warrants 12" → FTA-user instance list → user view (3b).
- Net-new data dependencies flagged inline as dashed notes.
- Pushed to `main`; **GitHub Pages live** at
  <https://pauljgehrig.github.io/courtchat_experiments/>

## Files

| File | Purpose |
|---|---|
| `courtchat-admin/index.html` | Shell markup; loads data.js + app.js |
| `courtchat-admin/data.js` | **All dummy data** (one object, per-view sections) — edit here for content |
| `courtchat-admin/app.js` | Hash router + one render function per view |
| `courtchat-admin/styles.css` | Brand tokens (#6938DF) + dashboard layout + CSS bar charts |
| `docs/specs/2026-06-30-courtchat-admin-scaffold.md` | Design spec |
| `index.html` (root) | Redirect into `courtchat-admin/` for Pages |

## NEXT STEPS (not yet done)

1. **Figma export — DEFERRED (Paul to address later).** Decided to hold off.
   When resuming, the open questions were:
   - Where it lands: Paul's `whoami` shows edit/"Full" rights only in the **CMS
     enterprise** org; personal team is a View seat. Prefer a personal draft for an
     unBail artifact, or a specific team Paul names.
   - Recommended approach: start with the **drill-down pair (4c Outcomes + 3b User)**
     in a new file to validate the visual translation, then expand to the other 5.
   - Caveats to restate: it's a one-way snapshot (no sync with the HTML); no CourtChat
     Figma library exists, so frames would mirror the HTML from raw tokens, not
     reusable components; it's slow/token-heavy per view.
   - Figma MCP is connected and working (verified via `whoami`).

2. **Flesh out stub drill-downs (optional).** These currently pop an explainer `alert()`
   instead of routing, because their level-2 instance lists aren't in `data.js` yet:
   - Funnel step → users who dropped (`drillFunnel`)
   - Engagement rate → active users in the average (`drillEngagement`)
   - Score bucket → users in bucket (`drillBucket`)
   - Opt-out trend / case-search error rate
   To make live: add instance-list data to `data.js` and add routes/views like the
   existing `viewFtaList()` + `#/outcomes/fta` pattern.

3. **Possible polish (only if asked):** empty/loading states, responsive layout,
   per-court filter actually filtering the dummy data, more dummy users.
