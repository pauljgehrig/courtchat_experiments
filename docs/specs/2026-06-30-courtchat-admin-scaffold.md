# CourtChat Admin Platform — UI Scaffold (Hand-off Artifact)

**Date:** 2026-06-30
**Status:** Building
**Source of truth:** [courtchat_knowledgebase / 07-admin-panel-prd.md](https://github.com/pauljgehrig/courtchat_knowledgebase/blob/main/docs/knowledgebase/07-admin-panel-prd.md)

## Purpose

A lightweight, self-contained prototype that sketches the CourtChat admin platform in
broad strokes with dummy data, so engineering has a clear picture of the intended
**functionality, organization, and behavior**. This is a communication artifact — not a
seed for production code. Optimized for: zero build/tooling to view, and easy iteration.

## Approach

Static multi-view prototype at `courtchat-admin/`:

- **`index.html`** — app shell (sidebar + top bar) and all 7 views, switched via hash
  routing (`#/review`, `#/users/u-204`, …). Opens from `file://` or GitHub Pages.
- **`data.js`** — all dummy data in one plain object (global, no modules). Iterating on
  content = edit here. `<script>` tag, not `type=module`, so it runs from `file://`.
- **`app.js`** — tiny hash router + render functions per view.
- **`styles.css`** — CourtChat brand tokens as CSS vars (#6938DF purple, Neue Haas /
  Inter), dashboard layout primitives, simple CSS bar charts (no charting lib).

## Information architecture

**Shell**
- Left sidebar, two groups:
  - *Operational console* (internal · may show PII): Review queue, User view, Message types, Pipeline health
  - *Analytics* (exportable, PII-free render): Onboarding funnel, Engagement & retention, Outcomes by court
- Top bar: date-range, court (Cuyahoga CP / Garfield Heights), A/B cohort
  (intervention/control) filters; "data as of" stamp; Export button (analytics only);
  Internal/PII badge (operational only).

**Views** (PRD section → route)
- 3a Review & approve queue → `#/review`
- 3b User-level view → `#/users/:id`  ← drill-down landing target
- 3c Message-type performance → `#/messages`
- 3d Pipeline & delivery health → `#/pipeline`
- 4a Onboarding funnel → `#/funnel`
- 4b Engagement & retention → `#/retention`
- 4c Outcomes & cost savings by court → `#/outcomes`

## The drill-down model (kept interactive)

Every aggregate metric is a front door to the records behind it, in three real levels:
1. **Aggregate** — headline number on an analytics view.
2. **Instance list** — click → the record set behind it (inherits court/cohort/date filters).
3. **Entity** — click a row → its operational view (`#/users/:id`).

Example wired path: Outcomes "FTA 4%" → instance list of users with warrants → user 3b detail.
Other interactions (forms, approve/reject, charts) are dummy/static — drawn to show
layout and behavior, not functional.

## Out of scope

Real data, real auth, production components, court logins/multi-tenant, charting libs,
responsive polish, build tooling.
