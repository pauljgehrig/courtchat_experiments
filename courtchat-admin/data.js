/* ============================================================
   CourtChat Admin — DUMMY DATA
   Edit this file to change any content in the prototype.
   Plain global object (no modules) so it runs from file://.
   ============================================================ */

window.DATA = {
  // ---- Global filter state shown in the top bar ----
  filters: {
    dateRange: "Last 90 days",
    court: "All courts",
    cohort: "All cohorts",
    asOf: "Jun 30, 2026 · 6:00 AM ET",
  },

  courts: ["Cuyahoga CP", "Garfield Heights"],
  cohorts: ["Intervention (A)", "Control (B)"],

  // =========================================================
  // 3a — REVIEW & APPROVE QUEUE
  // =========================================================
  review: {
    backlogCount: 23,
    backlog: [
      { id: "n-5012", case: "CR-24-688104", court: "Cuyahoga CP", category: "7-day nudge", age: "4m", conf: 0.97 },
      { id: "n-5013", case: "CR-24-690233", court: "Cuyahoga CP", category: "Day-of nudge", age: "18m", conf: 0.91 },
      { id: "n-5014", case: "GH-24-001902", court: "Garfield Heights", category: "Bond update", age: "41m", conf: 0.88 },
      { id: "n-5015", case: "CR-24-671145", court: "Cuyahoga CP", category: "New charge", age: "1h", conf: 0.94 },
    ],
    // The next pending notification in the queue
    current: {
      id: "n-5012",
      case: "CR-24-688104",
      court: "Cuyahoga CP",
      defendant: "Marcus Bell",
      userId: "u-204",
      category: "7-day hearing nudge",
      confidence: 0.97,
      event: "Pretrial — Courtroom 18-C",
      fields: [
        { label: "Hearing date", value: "Jul 14, 2026" },
        { label: "Hearing time", value: "9:00 AM" },
        { label: "Location", value: "Justice Center, Courtroom 18-C" },
        { label: "Judge", value: "Hon. R. Alvarez" },
      ],
      preview: "Hi Marcus — this is a reminder from CourtChat. You have a pretrial hearing on Mon, Jul 14 at 9:00 AM in Courtroom 18-C at the Justice Center. Reply HELP with questions or STOP to opt out.",
      original: "07/14/2026 09:00 PRETRIAL HEARING ASSIGNED ROOM 18-C JUDGE ALVAREZ",
      gptResult: {
        subject: "hearing_scheduled",
        confidence: 0.97,
        extracted: { date: "2026-07-14", time: "09:00", room: "18-C", judge: "Alvarez" },
        pass: 2,
        model: "gpt-3.5-turbo-1106",
      },
    },
    // Sub-0.85 drops that are silently discarded today (net-new persistence)
    drops: [
      { id: "d-881", case: "CR-24-655310", court: "Cuyahoga CP", raw: "DEFENDANT APPEARED PARTIAL CONTINUANCE NOTED", subject: "continuance?", conf: 0.71 },
      { id: "d-882", case: "GH-24-001755", court: "Garfield Heights", raw: "MISC ENTRY SEE ATTACHED ORDER", subject: "unknown", conf: 0.42 },
      { id: "d-883", case: "CR-24-688104", court: "Cuyahoga CP", raw: "BOND MODIFICATION REQUEST FILED BY COUNSEL", subject: "bond_change?", conf: 0.66 },
    ],
  },

  // =========================================================
  // 3b — USER-LEVEL VIEW (drill-down landing target)
  // keyed by user id
  // =========================================================
  users: {
    "u-204": {
      id: "u-204",
      name: "Marcus Bell",
      phone: "+1 (216) ***-4471",
      cohort: "Intervention (A)",
      court: "Cuyahoga CP",
      engagementScore: 0.41,
      triggersToFirst: 2,
      optedOut: false,
      case: { id: "CR-24-688104", status: "CASE OPEN", type: "Felony (F3)", nextEvent: "Pretrial · Jul 14", warrant: false },
      charges: ["Drug possession (F5)", "Falsification (M1)"],
      timeline: [
        { dir: "out", time: "Jun 02 · 9:02a", category: "onboard-1", status: "delivered", text: "Welcome to CourtChat! We'll text reminders about your case CR-24-688104. Reply STOP to opt out." },
        { dir: "out", time: "Jun 02 · 9:02a", category: "onboard-2", status: "delivered", text: "Your next event is a pretrial on Jul 14. We'll remind you as it gets closer." },
        { dir: "in",  time: "Jun 02 · 9:14a", category: "reply", status: "received", text: "ok thanks" },
        { dir: "out", time: "Jun 10 · 8:00a", category: "Q&A prompt", status: "delivered", text: "Have questions about what a pretrial is? Reply and a legal specialist will help." },
        { dir: "in",  time: "Jun 10 · 8:22a", category: "reply", status: "received", text: "do i need to bring anything" },
        { dir: "out", time: "Jul 07 · 9:00a", category: "7-day nudge", status: "delivered", text: "Reminder: pretrial hearing Mon Jul 14, 9:00 AM, Courtroom 18-C." },
      ],
    },
    "u-118": {
      id: "u-118", name: "Tanya Reese", phone: "+1 (216) ***-7732", cohort: "Control (B)", court: "Cuyahoga CP",
      engagementScore: 0.12, triggersToFirst: 5, optedOut: false,
      case: { id: "CR-24-664120", status: "CASE OPEN", type: "Misdemeanor (M1)", nextEvent: "Missed · warrant", warrant: true },
      charges: ["Theft (M1)"],
      timeline: [
        { dir: "out", time: "May 19 · 10:01a", category: "onboard-1", status: "delivered", text: "Welcome to CourtChat!" },
        { dir: "out", time: "Jun 21 · 9:00a", category: "Day-of nudge", status: "delivered", text: "Your hearing is today at 1:30 PM, Courtroom 12-A." },
        { dir: "out", time: "Jun 24 · 9:00a", category: "feedback survey", status: "failed", text: "How did your hearing go? Reply 1-5." },
      ],
    },
    "u-339": {
      id: "u-339", name: "Devon Pierce", phone: "+1 (440) ***-9920", cohort: "Intervention (A)", court: "Garfield Heights",
      engagementScore: 0.58, triggersToFirst: 1, optedOut: true,
      case: { id: "GH-24-001902", status: "CASE OPEN", type: "Misdemeanor (M2)", nextEvent: "Arraignment · Jul 09", warrant: false },
      charges: ["Disorderly conduct (M2)"],
      timeline: [
        { dir: "out", time: "Jun 15 · 11:00a", category: "onboard-1", status: "delivered", text: "Welcome to CourtChat!" },
        { dir: "in",  time: "Jun 15 · 11:05a", category: "reply", status: "received", text: "got it" },
        { dir: "in",  time: "Jun 28 · 4:40p", category: "reply", status: "received", text: "STOP" },
        { dir: "out", time: "Jun 28 · 4:40p", category: "opt-out confirm", status: "delivered", text: "You've been unsubscribed. Reply START to resume." },
      ],
    },
  },

  // =========================================================
  // 3c — MESSAGE-TYPE PERFORMANCE
  // =========================================================
  messageTypes: [
    { category: "Onboarding (onboard-1/2)", sent: 1240, delivered: 1198, failed: 42, responseRate: 0.31, optOutAfter: 0.008 },
    { category: "7-day nudge", sent: 980, delivered: 944, failed: 36, responseRate: 0.22, optOutAfter: 0.011 },
    { category: "3-day nudge", sent: 962, delivered: 931, failed: 31, responseRate: 0.19, optOutAfter: 0.014 },
    { category: "Day-of nudge", sent: 940, delivered: 902, failed: 38, responseRate: 0.27, optOutAfter: 0.009 },
    { category: "SEP (procedural explainer)", sent: 610, delivered: 590, failed: 20, responseRate: 0.34, optOutAfter: 0.006 },
    { category: "Feedback survey", sent: 588, delivered: 561, failed: 27, responseRate: 0.41, optOutAfter: 0.021 },
    { category: "Q&A prompt", sent: 720, delivered: 700, failed: 20, responseRate: 0.46, optOutAfter: 0.005 },
  ],

  // =========================================================
  // 3d — PIPELINE & DELIVERY HEALTH
  // =========================================================
  pipeline: {
    sendFlag: { value: true, lastSuccessfulSend: "Jun 30, 2026 · 5:58 AM ET" },
    twilio: [
      { code: "30003", label: "Unreachable / bad number", count: 18, trend: "+4", level: "danger" },
      { code: "11200", label: "Network / server error", count: 6, trend: "-2", level: "warning" },
      { code: "—", label: "Suspected carrier filtering (delivered, no engagement)", count: 31, trend: "+9", level: "warning" },
    ],
    gpt: [
      { label: "Sub-0.85 drops (24h)", count: 12, trend: "+3", level: "warning" },
      { label: "Two-pass extraction failures (24h)", count: 2, trend: "0", level: "info" },
    ],
    scraper: [
      { job: "scrapeCases", status: "ok", lastRun: "5:45 AM", note: "412 cases checked" },
      { job: "updateCheck", status: "ok", lastRun: "5:58 AM", note: "diffed 38 open cases" },
      { job: "TOS acceptance (clearTos)", status: "warning", lastRun: "5:45 AM", note: "retried once, then accepted" },
      { job: "Docket freshness", status: "ok", lastRun: "—", note: "newest entry 9h old (within 24h lag)" },
    ],
  },

  // =========================================================
  // 4a — ONBOARDING FUNNEL
  // =========================================================
  funnel: {
    steps: [
      { name: "Sign-up started (find-case/1)", count: 2140, dropPct: null },
      { name: "Case found (find-case/2)", count: 1710, dropPct: 0.20 },
      { name: "T&Cs agreed (find-case/3)", count: 1496, dropPct: 0.13 },
      { name: "Confirmed / qualified (find-case/4)", count: 1404, dropPct: 0.06 },
      { name: "First interaction (inbound reply)", count: 612, dropPct: 0.56 },
    ],
    caseSearchErrorRate: 0.14,
    reverseSearchErrors: 96, // out-of-scope queries (wrong county, civil, etc.)
    qualifiedCompletion: 0.75,
    triggersToFirst: 2.5,
  },

  // =========================================================
  // 4b — ENGAGEMENT & RETENTION
  // =========================================================
  retention: {
    avgEngagementRate: 0.28,            // vs 30% target
    target: 0.30,
    csat: 0.85,
    optOutTrend: [0.9, 1.1, 1.0, 1.4, 1.2, 1.6, 1.5, 1.3], // % per week
    engagementTrend: [0.21, 0.23, 0.22, 0.25, 0.26, 0.27, 0.28, 0.28],
    scoreDistribution: [
      { bucket: "0.0–0.2", users: 410 },
      { bucket: "0.2–0.4", users: 366 },
      { bucket: "0.4–0.6", users: 288 },
      { bucket: "0.6–0.8", users: 174 },
      { bucket: "0.8–1.0", users: 88 },
    ],
    qAndAEngagement: 331,               // questions submitted
    promptEngagement: "1 reply per 3.6 prompts",
  },

  // =========================================================
  // 4c — OUTCOMES & COST SAVINGS BY COURT
  // =========================================================
  outcomes: {
    overall: { appearanceRate: 0.96, ftaRate: 0.04, warrants: 12, casesServed: 1404, activePerDay: 38 },
    baseline: { ftaRate: 0.12 },        // external input — open question
    byCourt: [
      { court: "Cuyahoga CP", appearanceRate: 0.96, warrants: 9, casesServed: 1108, savingsRealized: 142800, savingsProjected: 318000 },
      { court: "Garfield Heights", appearanceRate: 0.95, warrants: 3, casesServed: 296, savingsRealized: 38250, savingsProjected: 79500 },
    ],
    costPerFTA: { felony: 1500, misdemeanor: 850 },
    // The instance list behind "FTA 4%" / warrants — drill target
    ftaUsers: [
      { userId: "u-118", name: "Tanya Reese", court: "Cuyahoga CP", case: "CR-24-664120", type: "Misdemeanor", warrantDate: "Jun 22, 2026", cohort: "Control (B)" },
      { userId: "u-771", name: "Andre Cole", court: "Cuyahoga CP", case: "CR-24-650019", type: "Felony", warrantDate: "Jun 18, 2026", cohort: "Control (B)" },
      { userId: "u-802", name: "Lena Ortiz", court: "Garfield Heights", case: "GH-24-001640", type: "Misdemeanor", warrantDate: "Jun 11, 2026", cohort: "Intervention (A)" },
    ],
  },
};
