# The Greenroom — Project Work Log
**AI 201 · Project 2 · Reactive Sandbox**
Art Director: Milind Murthy

---

## How This Log Works

- **Session Entries** are auto-appended at the end of each work session with an AI-generated descriptor of what was built, changed, or decided.
- **Code Changes** are tracked per-file with a brief note on what changed and why.
- **Records of Resistance** are logged in real time whenever AI output is rejected or significantly revised.
- **AI Direction Log** captures editorial decisions about how AI was directed and corrected.

---

## Records of Resistance

> Documented moments where AI output was rejected or significantly revised. Required: minimum 3 for submission.

*(Auto-logged during sessions — entries will appear below as they occur)*

---

## AI Direction Log

> 3–5 entries documenting the editorial relationship with AI across the project.

*(Entries added at end of each session)*

---

## Session Log

---

### Session 1 — April 13, 2026

**Focus:** Project scaffolding, data model, repo setup.

**Code Changes:**

| File | Action | Notes |
|------|--------|-------|
| `casting-dashboard/` (root) | Created | Vite + React scaffold via `npm create vite@latest` |
| `src/data/actors.js` | Created | Full 8-actor JSON data model per design intent spec |

**Files Created This Session:**
- `src/data/actors.js` — 8 actors with full JSON spine: id, profile (name, headshot, agency, contact), attributes (type, strengths, genreExperience, divaRating 1–9), logistics (availability, availabilityWindow, rottenTomatoesAverage, tapeNotes, sentimentNews)
- `WORKLOG.md` — this document; session logging structure established
- `~/.claude/settings.json` — updated with PostToolUse and Stop hooks for auto-logging

**Session Summary (AI Generated):**
> Session 1 established the full project foundation for "The Greenroom" casting dashboard. The Vite + React environment was scaffolded via `npm create vite@latest`, dependencies installed, and git initialized. GitHub remote setup required troubleshooting — the GitHub CLI was not installed, SSH keys were not configured, and two personal access tokens were cycled before a successful push was made. The repo was then relocated from `~/casting-dashboard` to `~/Documents/github/casting-dashboard` to sit alongside Project 1. Both assignment documents were reviewed in full (Design Intent and Framework), and the architectural constraints were confirmed: all state in the parent, props down/events up, no useContext, no dark mode, no generic icons, 400ms fade transitions, `castDraft` never stored in the Controller. The core JSON data model was authored in full — 8 actors spanning Leading Man, Leading Woman, and Character Actor archetypes, with diva ratings from 1–9 (Jeremy Strong at 9 and Cate Blanchett at 5 are a flagged pairing), availability spread across Pinned/Checking/Unavailable states, and genre coverage across Drama, Thriller, Horror, Sci-Fi, Crime, Fantasy, Historical, Romance, and Action. The session logging system was configured: `WORKLOG.md` tracks all sessions and resistance records, `session-changes.log` auto-appends on every file edit, and a Stop hook fires a reminder banner at session end. No React components were built — per the assignment's production pipeline, data must precede structure.

---

*(Future sessions will be appended below)*

---

### Session 2 — April 15–16, 2026

**Focus:** Data model migration + Panel 1 (The Browser) build.

**Code Changes:**

| File | Action | Notes |
|------|--------|-------|
| `src/data/actors.js` | Rewritten | Full schema migration to new flat structure |
| `index.html` | Edited | Added Playfair Display + Inter from Google Fonts; updated page title |
| `src/index.css` | Rewritten | Full design token system for Light Mode "The Brief" |
| `src/App.css` | Rewritten | Panel 1 styles: header, cost cap bar, cast grid, role slots, actor cards, ghost shadows |
| `src/App.jsx` | Rewritten | Panel 1 React component: CostCapBar, ActorCard, RoleSlot, drag-and-drop state |

**Data Model Changes (`actors.js`):**

The existing nested schema (`profile / attributes / logistics`) was replaced with the new flat schema specified in the updated design intent document:

- Old nesting collapsed into `stats` (rtScore, cost, divaRating), `background` (ethnicity, currentEvents), and `metadata` (tapeNotes, type, agency, availability, etc.)
- Three new top-level blocks added: `appState` (theme, budgetLimit, currentTotal), `roles` (5 named cast positions with assignedActorId + shadow + isLocked), `analytics` (usCensusBaseline for Diversity Index, expectedRevenue, clashAlerts)
- 2 actors added: Daisy Ridley (`fixed-rey`, locked to Rey Skywalker) and Austin Butler (`actor-butler`, assigned to Kaelen Sol) per the design intent sample JSON
- `analytics.usCensusBaseline` populated with 2020–2025 US Census estimates (White 59%, Hispanic/Latino 19%, Black/African American 13%, Asian 6%, Other 3%) for future Diversity Index calculation
- `analytics.clashAlerts` pre-seeded with Blanchett/Strong conflict from original tape notes

**Panel 1 Features Built:**

- **Header:** Studio attribution, Playfair Display serif title, panel label
- **Cost Cap Bar:** Live-calculated from assigned actors' salaries; transitions green → amber (>75%) → red (over budget)
- **Cast Grid:** 5 role slots — Rey Skywalker locked with "Fixed" badge, Kaelen Sol pre-filled with Austin Butler, 3 shadow slots with dashed-border placeholders
- **Talent Pool:** All 10 actors as draggable cards with initials avatar, actor type, RT score, salary, diva dot (green/amber/red)
- **Drag-and-drop:** HTML5 drag API; drop target highlights; ghost shadow left behind in roster when card is mid-drag; reassignment clears prior role; locked slots reject drops

**AI Direction Log — Session 2:**

1. **Data schema driven by design doc, not AI defaults.** The schema structure was provided explicitly via the updated design intent PDF and sample JSON. AI's role was migration of existing actors to the new shape, not schema invention.
2. **Roles defined by the film, not the data.** The 5 cast positions (Rey Skywalker, Kaelen Sol, Vaneen Kor, Jaxen Vane, Aris Thorne) came from the design document. Actor-to-role assignments in the data are suggestions only — the live UI state overrides them.
3. **No dark mode built yet.** Light Mode "The Brief" was the explicit scope for this session. Dark Mode "The Film" (space background, #FFE81F accents, X-Wing cursor, Lightsaber cost bar) is deferred to a later session.
4. **Ghost shadow is a CSS class, not a library.** The drag shadow effect was implemented with a `.ghost` card class (dashed border, muted background) rather than a drag-and-drop library, keeping the dependency count at zero.

**Session Summary (AI Generated):**
> Session 2 delivered two parallel tracks: a full data model migration and the complete build of Panel 1. The `actors.js` file was restructured from a nested profile/attributes/logistics schema into the flat stats/background/metadata shape required by the new design intent, with two new actors added (Daisy Ridley as the locked franchise anchor, Austin Butler as the pre-cast Kaelen Sol), and new top-level blocks for appState, roles, and analytics. On the UI side, Panel 1 — The Browser — was built from a blank Vite scaffold into a functioning casting tool: a serif "gallery aesthetic" header, a live Cost Cap bar that recalculates as actors are dragged between roles, a 5-slot Cast Grid with locked/shadow/filled states, and a full Talent Pool of draggable actor cards with ghost shadows. The drag-and-drop system uses the HTML5 Drag API with no external libraries. The Cost Cap bar transitions through three color states (safe/warning/over) based on live salary totals. Dark Mode, Panel 2 (the FIFA Detail Card), and Panel 3 (the Executive Controller) are all deferred to future sessions.
