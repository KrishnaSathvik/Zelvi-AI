Perfect, let’s lock it in:
**Brand:** Zelvi AI
**Domain:** `https://zelvi.pp`
**Tagline:** *Your AI-powered operating system for 2026.*

Below is the **full, cleaned-up architecture** + **all features** + **end-to-end UI/UX flows per page**, now **including SEO + Google Analytics 4 (GA4)** and our existing realtime/PWA ideas.

---

## 1. Product & Branding

### 1.1 What Zelvi AI Is

> **Zelvi AI** is your **personal operating system** for 2026: it unifies
> job search, recruiters, DE/AI/ML/GenAI learning, projects, content planning, goals, analytics, calendar, and an AI coach that knows your data.

You access it via:

* **Public marketing pages** (SEO-friendly) on `https://zelvi.pp`
* **Authenticated app pages** at `https://zelvi.pp/app`

### 1.2 Core Pillars

1. **Execution** – Daily Command Center with a rolling action list
2. **Clarity** – Analytics, goals, weekly reviews, calendar & timeline
3. **Guidance** – AI Coach with deep modes that use your real data

---

## 2. Technical Architecture

### 2.1 Frontend

* **React 18 + Vite + TypeScript**
* **Tailwind CSS** (dark, modern, minimal)
* **React Router v6** for navigation
* **TanStack Query (React Query)** for data fetching + caching
* **Context API**:

  * `AuthContext` – wraps Supabase session
* **PWA**:

  * Service worker
  * Web app manifest (`manifest.webmanifest`)
  * Installable on mobile and desktop

### 2.2 Backend / Infra

* **Supabase**

  * Postgres DB
  * Auth (email/password + anonymous guest accounts)
  * Realtime channels
  * Edge Functions (serverless) for:

    * AI Coach integration
    * Export all data
    * Account deletion
    * Guest → full account migration
* **LLM provider** (e.g. OpenAI) for AI Coach
* **Google Analytics 4 (GA4)**

  * Global analytics
  * Event tracking for critical flows

### 2.3 Realtime Layer

* `RealtimeProvider` subscribes to Supabase Realtime for all user tables.
* On `INSERT / UPDATE / DELETE`:

  * Calls `queryClient.invalidateQueries([...])`
  * UI updates automatically without manual refresh.

---

## 3. Auth & User Model

### 3.1 User Types

* **Guest user** – anonymous Supabase user, full app access, but session-bound.
* **Full account user** – email/password, synced across devices, can export/delete data.

### 3.2 Auth Flow

* Public routes: `/`, `/auth`
* Protected routes under `/app/*`
* If `!user` → redirect to `/`
* Guest sign-in via `supabase.auth.signInAnonymously()`
* Guest → account upgrade via Edge Function (migrates data to new user_id).

---

## 4. Data Model (Main Tables)

All tables with `user_id` (FK to `auth.users.id`) + RLS.

* `jobs`
* `recruiters`
* `learning_logs`
* `projects`
* `content_posts`
* `daily_custom_tasks`
* `daily_task_status`
* `notes`
* `activity_log`
* `goals`
* `weekly_reviews`
* `user_profiles`
* `user_settings`
* Optionally `ai_chat_sessions`, `ai_messages`

---

## 5. SEO Strategy for Zelvi AI

### 5.1 SEO Scope

* **Indexable pages:**

  * `/` – Landing
  * Future: `/pricing`, `/features`, `/blog` (not defined yet but planned)
* **Non-indexable app routes:**

  * `/auth`, `/app/*` – use `<meta name="robots" content="noindex, nofollow" />`

### 5.2 Core SEO Elements (Landing)

For `https://zelvi.pp/`:

* **Title:**
  `Zelvi AI – Your AI-Powered Operating System for Job Search, Learning & Goals`

* **Meta Description:**
  `Zelvi AI is your personal OS for 2026. Track jobs, recruiters, learning, projects, and content in one place, with a daily dashboard, analytics, goals, calendar, and an AI coach that understands your data.`

* **Canonical URL:**
  `<link rel="canonical" href="https://zelvi.pp/" />`

* **Open Graph / Twitter tags:**

  * `og:title`, `og:description`, `og:url`, `og:type=website`, `og:image`
  * `twitter:card=summary_large_image`

### 5.3 SPA SEO Implementation

* Use something like **React Helmet** or `@tanstack/router` metadata:

  * Set `<title>` and `<meta>` tags for:

    * `/`
    * Possibly `/features` later
* App routes:

  * `noindex` meta tag
  * Standard title like “Zelvi AI – Dashboard”

---

## 6. GA4 Analytics Strategy

### 6.1 GA4 Setup

* GA4 Measurement ID: e.g. `G-XXXXXXX` (real ID later)
* Add `gtag.js` snippet in `index.html`.
* Create a small wrapper:

```ts
// analytics.ts
export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;
  (window as any).gtag('event', name, params);
};
```

### 6.2 Key Events

* Auth / onboarding:

  * `signup_start`, `signup_success`
  * `login_success`
  * `guest_mode_start`, `guest_mode_success`
  * `upgrade_guest_start`, `upgrade_guest_success`

* Product usage:

  * `job_created`, `job_status_updated`
  * `recruiter_created`
  * `learning_session_created`
  * `project_created`, `project_status_updated`
  * `content_post_created`, `content_status_updated`
  * `task_created`, `task_completed`
  * `goal_created`, `goal_completed`
  * `weekly_review_saved`
  * `ai_chat_message_sent`, `ai_chat_shortcut_used`

* Data/Account:

  * `data_export_started`, `data_export_completed`
  * `account_delete_started`, `account_delete_completed`

* PWA:

  * `pwa_install_prompt_shown`, `pwa_installed`

---

## 7. PWA Behavior

* `manifest.webmanifest`:

  * `name: "Zelvi AI"`
  * `short_name: "Zelvi"`
  * `start_url: "/app"`
  * `display: "standalone"`
  * `theme_color`, `background_color`
  * Icons in multiple sizes

* Service worker:

  * Cache shell (JS/CSS) and core static assets
  * Cache last known data for offline read (dashboard, notes, analytics summary)
  * Show “Offline” banner when offline; disable writes or queue them.

---

## 8. Page-By-Page UI/UX Flow (Zelvi AI)

### 8.1 Landing Page – `/`

**Goal:** Explain Zelvi AI, capture intent, push CTA.

**Sections:**

1. **Header**

   * Left: Zelvi logo + “Zelvi AI”
   * Right:
     `Continue as Guest` (outline button)
     `Log in / Sign up` (solid button)

2. **Hero**

   * Headline: *“Your AI-powered operating system for 2026.”*
   * Subtext:
     “Zelvi AI turns your jobs, recruiters, learning, projects, content, and goals into one daily command center with analytics and an AI coach.”
   * Primary CTA: `Get started free` → `/auth`
   * Secondary CTA: `Try in guest mode` → anonymous sign-in → `/app`

3. **Value Props (3 Cards)**

   * **One command center**
   * **Analytics that tell the truth**
   * **AI coach that knows your data**

4. **How it works**

   * Step 1: Log your jobs, learning, projects, content.
   * Step 2: Zelvi builds a rolling daily list + activity timeline.
   * Step 3: Analytics + AI coach help you adjust every week.

5. **SEO Considerations**

   * H1: hero
   * H2s: “Job search, learning, and goals in one OS”, “How Zelvi AI works”
   * Internal links (later) to `/features`, `/blog`.

**GA4 Events:**

* `cta_click` with `variant: "hero_guest"` or `hero_signup`.
* On landing view: `page_view` auto via GA4.

---

### 8.2 Auth Page – `/auth`

**Goal:** Simple email/password login & signup.

**Layout:**

* Centered card on dark background.
* Toggle at top: “Log in” / “Sign up”
* Inputs: `email`, `password`
* Button:

  * Log in / Sign up (with spinner)
* Links:

  * “Back to landing”

**Behavior:**

* If already authenticated → redirect `/app`.
* On success:

  * Track GA: `signup_success` or `login_success`
  * Redirect `/app`.

**SEO:**

* `<title>Zelvi AI – Log in / Sign up</title>`
* `<meta name="robots" content="noindex, nofollow" />`

---

### 8.3 App Shell – `/app` Layout

**Components:**

* `AppLayout`:

  * `Sidebar` (desktop)
  * `Top/Bottom nav` (mobile)
  * `<Outlet />` for current view
* `RealtimeProvider` around children
* Floating **AI Coach button** bottom-right

**Sidebar Items:**

* Dashboard
* Jobs
* Recruiters
* Learning
* Projects
* Content
* Analytics
* Goals
* Review
* Calendar
* Notes
* Profile

**Behavior:**

* If `loading` → show loading screen.
* If `!user` → redirect `/`.

**GA4:**

* Track route change as `page_view` manually if using client-side routing.

---

### 8.4 Dashboard – `/app` (Daily Command Center)

**Sections:**

1. **Summary Bar**

   * Cards:

     * Jobs: today count
     * Recruiters: contacted
     * Learning: minutes today
     * Content: due/published
     * Tasks: done/total
     * Goals snapshot: e.g., “Q1 Jobs: 34/150”

2. **Today’s Action List**

   * Input: “Add anything to do today…” → manual task.
   * Filter chips: `All | Manual | Learning | Content | Projects`
   * Task rows:

     * Checkbox
     * Label
     * Type tag
     * Due label if overdue
     * Delete icon for manual
   * Completion toggles update `daily_task_status`.

3. **Today’s Activity Timeline**

   * Chronological list of actions from `activity_log`.
   * Shows time + description.

**Realtime:**

* Any updates to jobs/learning/projects/content/tasks cause this page to update instantly.

**GA4:**

* `task_created`, `task_completed`.
* `dashboard_view` event when user lands here.

---

### 8.5 Jobs – `/app/jobs`

**Purpose:** All job applications.

**Sections:**

* **Header**:

  * Title: `Jobs`
  * Button: `Add job`
  * Filters: `Status`, `Source`, `Date range`.

* **Job Form**:

  * Role, Company, Location
  * Job type
  * Salary range
  * Source (LinkedIn, Indeed, Referral, etc.)
  * Status (Applied, Screener, Tech, Offer, Rejected)
  * Applied date
  * Job link
  * Notes
  * Save

* **Job List**:

  * Card layout or table:

    * Role @ company
    * Location · type · source
    * Status pill
    * Applied date
    * Link icon
    * Notes snippet
    * Edit icon

**Integration:**

* Jobs with `applied_date == today` feed Dashboard summary + timeline.
* Jobs feed Analytics job funnel and Calendar.

**GA4:**

* `job_created`, `job_status_updated`.

---

### 8.6 Recruiters – `/app/recruiters`

**Purpose:** Recruiter CRM.

**Sections:**

* Form:

  * Name
  * Company
  * Platform (LinkedIn, Email, WhatsApp)
  * Role
  * Status
  * Last contact date
  * Notes

* List:

  * Name – Company – Platform
  * Role
  * Status
  * Last contact date
  * Notes preview
  * Edit

**Integration:**

* `last_contact_date == today` → Dashboard summary.
* Feeds recruiter analytics & calendar.

**GA4:**

* `recruiter_created`, `recruiter_status_updated`.

---

### 8.7 Learning – `/app/learning`

**Purpose:** Track DE/AI/ML/GenAI/RAG study.

**Sections:**

* Header with quick stat: “This month: X min · Top: GenAI”.
* Form:

  * Date
  * Category
  * Topic
  * Minutes
  * Resource (link or text)
  * Takeaways
* List grouped by date:

  * Category pill
  * Topic + minutes
  * Resource icon
  * Takeaways snippet
  * Edit

**Integration:**

* Feeds:

  * Dashboard learning stats
  * Learning tasks
  * Analytics
  * Calendar
  * AI Coach (Learning mode).

**GA4:**

* `learning_session_created`.

---

### 8.8 Projects – `/app/projects`

**Purpose:** Portfolio and side projects.

**Sections:**

* Form:

  * Name
  * Category
  * Status
  * Priority
  * GitHub URL
  * Live URL
  * Next action
  * Notes

* Cards:

  * Name
  * Status, Category, Priority
  * “Next: {next_action}”
  * Links
  * Notes preview

**Integration:**

* Projects with `next_action` generate persistent tasks.
* Status changes feed Analytics & timeline.

**GA4:**

* `project_created`, `project_status_updated`.

---

### 8.9 Content Planner – `/app/content`

**Purpose:** Plan and track social/media content.

**Sections:**

* Form:

  * Date
  * Platform
  * Content type
  * Title/hook
  * Body/caption
  * Status (Idea, Draft, Assets ready, Scheduled, Published)
  * Post link

* List:

  * Platform badge
  * Title
  * Date
  * Status pill
  * Body snippet
  * Link icon
  * Edit

**Integration:**

* Non-published and `date <= today` → tasks.
* Published → counts in Analytics & Calendar.

**GA4:**

* `content_post_created`, `content_status_updated`.

---

### 8.10 Analytics – `/app/analytics`

**Purpose:** Full stats overview.

**Sections:**

* **Filters:** time range selector.
* **Job Funnel:** bar/funnel chart + explanation text.
* **Recruiters:** line chart contacts, response rate.
* **Learning:** minutes by category, streak.
* **Projects:** status distribution, completed projects.
* **Content:** posts per platform, status.
* **Tasks:** created vs completed per day.

**UX Enhancements:**

* Each chart card includes:

  * Short sentence summarizing the insight.
  * Small button: “Ask AI about this →” which opens AI Coach with context.

**GA4:**

* `analytics_view`.
* `ask_ai_from_analytics` when user clicks AI integration.

---

### 8.11 Goals – `/app/goals`

**Purpose:** Set measurable targets.

**Sections:**

* Goal creation card:

  * Title
  * Type
  * Target value
  * Timeframe
  * Date range

* Goals list:

  * Progress bars
  * % complete
  * Days remaining
  * “On track / Behind” badge

**Integration:**

* Dashboard goal snippet.
* Weekly review & Analytics referencing goals.
* AI Coach uses goals in planning.

**GA4:**

* `goal_created`, `goal_updated`.

---

### 8.12 Weekly Review – `/app/review`

**Purpose:** Structured weekly reflection.

**Sections:**

* Week selector
* Weekly stats summary card
* Text areas for:

  * Wins
  * Stuck points
  * Avoided tasks
  * Focus for next week
* Button: `Generate AI weekly summary`
* AI summary area:

  * Narrative + bullet actions

**GA4:**

* `weekly_review_saved`, `weekly_review_ai_generated`.

---

### 8.13 Calendar & Timeline – `/app/calendar`

**Purpose:** Visualize activity over time.

**Sections:**

* Month selector + filters (Jobs / Recruiters / Learning / Content / Tasks)
* Monthly calendar grid

  * Dots per category per day
* Day detail panel:

  * Summary counts
  * Mini list of that day’s activity entries

**GA4:**

* `calendar_view`, `calendar_day_selected`.

---

### 8.14 Notes – `/app/notes`

**Purpose:** Freeform notes.

**Sections:**

* Large note editor (single note v1).
* Autosave indicator.

**GA4:**

* `notes_updated`.

---

### 8.15 Profile – `/app/profile`

**Purpose:** Account, guest upgrade, export, delete.

**Sections:**

1. **Profile Info**

   * Email (or “Guest session”)
   * Name (editable)
   * Created date

2. **Guest Mode Panel** (if guest)

   * Explanation
   * Form to create email/password
   * Button: “Upgrade and migrate data”

3. **Data controls**

   * Export all data (JSON download)
   * Delete account (danger zone)

4. **Logout button**

**GA4:**

* `profile_view`, `data_export_started/completed`, `account_delete_started/completed`, `upgrade_guest_start/success`.

---

### 8.16 AI Coach (Global)

**Layout:**

* Floating button
* Slide-out drawer:

  * Tabs: General, Job, Learning, Projects, Content
  * Shortcut buttons
  * Chat history
  * Input + Send

**Modes:**

* **General** – overall planning & weekly summaries.
* **Job** – funnel, strategy, targeting.
* **Learning** – study plan.
* **Projects** – project prioritization.
* **Content** – post ideas, scripts.

**GA4:**

* `ai_chat_open`, `ai_chat_message_sent`, `ai_chat_shortcut_used`.

---

Nice, this is the fun part – designing each page like a real product spec. I’ll go **page by page** and focus on:

* Purpose
* Data it needs
* Layout (sections / components)
* Main interactions & states

I won’t repeat the global stuff (Supabase, Realtime, etc.) unless it affects the page directly.

---

## 1️⃣ Landing Page (`/`)

### Purpose

Explain what the app is, why it exists, and push user to **Guest Mode** or **Auth**.

### Data

* `AuthContext.user` (to auto-redirect if already logged in)

### Layout

**Header**

* Left: Logo “26” + text: “Year 2026 Control Center”
* Right: Buttons (desktop):

  * `Continue as guest`
  * `Log in / Sign up`

**Hero section**

* Big heading:
  “Run your 2026 comeback from one screen.”
* Subtext: 2–3 short lines:

  * “Track jobs, learning, projects, content, goals and see it all in one daily dashboard.”
* Primary CTA: `Get started free` → `/auth`
* Secondary CTA: `Try in guest mode` → `signInAnonymously()` → `/app`

**Three feature cards (horizontal on desktop, stacked on mobile)**

1. What it does
2. Problem it solves
3. Why it’s different (daily OS + analytics + AI coach)

**How it works panel**

* A small bordered box:

  * `1. Log jobs, learning, projects, content`
  * `2. Daily dashboard builds your rolling to-do list`
  * `3. Analytics + AI coach help you review and adjust weekly`

**Footer**

* Tiny note: “Built for your 2026 reset. Guest mode available.”

### Interactions

* If `user` already exists → `useEffect` redirect to `/app`.
* `Continue as guest` → `supabase.auth.signInAnonymously()` → `/app`.
* `Log in / Sign up` → `/auth`.

---

## 2️⃣ Auth Page (`/auth`)

### Purpose

Simple email/password login or signup.

### Data

* `AuthContext.user`

### Layout

**Container**

* Centered card on dark background.

**Card sections**

* Title:

  * `Log in` or `Create your account` depending on mode.
* Small subtext:

  * “Use email + password for now. You can upgrade later.”

**Form**

* Fields:

  * Email (text input)
  * Password (password input)
* Button:

  * `Log in` or `Sign up` with loading state.
* Secondary Zone:

  * Text link: “Don’t have an account? Sign up” (toggle mode)
  * Link: “Back to landing”

### Interactions

* If `user` already exists → redirect to `/app`.
* Submit:

  * Mode = signup → `supabase.auth.signUp`
  * Mode = login → `signInWithPassword`
* On success → `/app`.

---

## 3️⃣ App Layout (`/app` shell)

### Purpose

Shared shell for all internal pages; handles auth & navigation.

### Data

* `AuthContext.user`
* `AuthContext.loading`

### Layout

**Desktop**

* Left: Sidebar (fixed)
* Right: Main content area (scrollable) with max-width & padding

**Mobile**

* Top or bottom tab bar (minimal)
* Sidebar collapses into drawer or overlay if needed

**Sidebar content**

* Logo “26”
* Navigation items:

  * Dashboard
  * Jobs
  * Recruiters
  * Learning
  * Projects
  * Content
  * Analytics
  * Goals
  * Review
  * Calendar
  * Notes
  * Profile
* Logout button at bottom.

### Interactions

* If `loading` → full-screen “Loading…”
* If no `user` → redirect `/`.
* `<Outlet />` loads whichever page route.

---

## 4️⃣ Daily Dashboard (`/app`)

### Purpose

Your **home screen**: Today’s summary + actionable list + timeline.

### Data

From `useDailyDashboard` hook:

* `jobsToday`
* `recruitersToday`
* `learningLast30` (and filtered for today)
* `projects`
* `contentAll`
* `manualTasks`
* `taskStatus`
* `today`
* plus analytics snippets (tasks completed today, streak, goal summaries)

### Layout

**A. SummaryBar (top row)**

* Horizontally scrollable on mobile.
* Cards like:

  * Jobs: “2 applied today”
  * Recruiters: “1 contacted”
  * Learning: “45 min”
  * Content: “1 due / 0 published”
  * Tasks: “5 / 9 done”
  * Goals snippet: “Q1 jobs: 34 / 150”

**B. Today’s Action List**

* Card with:

  * Title: “Today’s action list”
  * Hint text: “Auto-built from your jobs, learning, projects, content + manual tasks.”

* Add task row:

  * Input: “Add anything to do today…”
  * Button: `Add`

* Task list:

  * Each row:

    * Checkbox
    * Label e.g. `Project – TrailVerse: finalize calendar view`
    * Type tag `[Manual]` / `[Learning]` / `[Content]` / `[Project]`
    * If overdue (due date < today): `(due 2026-01-04)` in amber
    * For manual: small delete icon

* Filters above list:

  * Chips: `All`, `Manual`, `Learning`, `Content`, `Projects`

**C. Today’s Timeline**

* Card with:

  * Title: “Today’s activity timeline”
  * Vertical timeline entries:

    * Time · description
  * If empty:

    * “No events logged yet. Add jobs, learning sessions, content, or tasks to see them here.”

### Interactions

* Checking a task:

  * Insert/delete row in `daily_task_status`
  * Realtime invalidation updates:

    * Task row
    * SummaryBar (tasks count)
    * Analytics (if open)

* Adding manual task:

  * Insert row in `daily_custom_tasks` with `due_date = today`.

* Deleting manual task:

  * Delete from `daily_custom_tasks` and `daily_task_status`.

---

## 5️⃣ Jobs Page (`/app/jobs`)

### Purpose

Track all job applications & opportunities.

### Data

* Jobs for current user (`jobs`)
* Possibly filters (status, company, date range)

### Layout

**Header**

* Title: `Jobs`
* Right: buttons:

  * “Add job”
  * Simple filters (dropdowns): status, source, time range

**Add/Edit Job Form**

* In-page card or modal:

  * Role
  * Company
  * Location
  * Job type (remote/hybrid/onsite/contract)
  * Salary range
  * Source (LinkedIn, Indeed, Vendor, etc.)
  * Status (Applied, Screener, Tech round, Offer, Rejected)
  * Applied date
  * Job link
  * Notes
  * `Save` button

**Job List**

* Table or stacked cards:

  * Top line: `Senior DE @ JPMorgan`
  * Secondary:

    * `Remote · LinkedIn · 120–150k`
  * Status pill
  * Applied date
  * Link icon (opens job in new tab)
  * Notes preview
  * Edit icon

### Interactions

* Create / edit / delete job.
* Each create/update triggers:

  * `activity_log` entry.
  * Realtime update:

    * Dashboard jobsToday
    * Analytics funnel
    * Calendar day dots.

---

## 6️⃣ Recruiters Page (`/app/recruiters`)

### Purpose

Recruiter / vendor CRM.

### Data

* `recruiters` table rows

### Layout

**Header**

* Title: `Recruiters`
* Filters:

  * Status (Messaged, Replied, Call, Submitted, Ghosted)
  * Platform

**Form**

* Name
* Company
* Platform (LinkedIn, Email, WhatsApp, etc.)
* Role
* Status
* Last contact date
* Notes
* Save

**List**

* Cards:

  * Line 1: `Priya – Zensar (LinkedIn)`
  * Line 2: `Role: Senior Data Engineer`
  * Status pill
  * Last contact date
  * Notes snippet
  * Edit icon

### Interactions

* New / updated recruiters:

  * Show in Dashboard summary (today contact count).
  * Log to timeline.
  * Feed into analytics (response rate).

---

## 7️⃣ Learning Page (`/app/learning`)

### Purpose

Track DE/AI/ML/GenAI/RAG learning and prep.

### Data

* `learning_logs` for current user
* Maybe aggregated minutes by category (for quick view)

### Layout

**Header**

* Title: `Learning`
* Quick stats: “This month: 520 min · Most time in: GenAI”

**Form**

* Date (defaults to today)
* Category:

  * DE, AI-ML, GenAI, RAG, System Design, Interview Prep, Other
* Topic
* Minutes
* Resource link (URL or text)
* Takeaways (textarea)
* Save

**List**

* Rows or cards grouped by date:

  * Header: “Mon, Jan 5”
  * Each entry:

    * Category pill
    * Topic
    * Minutes
    * Resource link icon
    * Takeaways snippet
    * Edit icon

### Interactions

* Save → increments:

  * Today Overview (learning)
  * Tasks (learning tasks)
  * Analytics & calendar.
* Edit → updates analytics, tasks labels.

---

## 8️⃣ Projects Page (`/app/projects`)

### Purpose

Manage long-running projects & portfolio.

### Data

* `projects`

### Layout

**Header**

* Title: `Projects`
* Filters: status (planning, building, polishing, done), priority (high/med/low)

**Form**

* Name
* Category (DE, AI, GenAI, RAG, Other)
* Status
* Priority
* GitHub URL
* Live URL
* Next action
* Notes
* Save

**List (cards)**

* Card content:

  * Name
  * Status pill
  * Category + priority tags
  * “Next: {next_action}”
  * Links (GitHub / Live)
  * Notes preview
  * Edit icon

### Interactions

* Updating `next_action` always feeds:

  * Project task in Today’s Action List (until project done or task completed).
* Moving status to `Done`:

  * Removes project from daily tasks.
  * Shows in Analytics & Timeline as a milestone.

---

## 9️⃣ Content Planner Page (`/app/content`)

### Purpose

Plan IG/YT/LinkedIn/Medium/Pinterest content.

### Data

* `content_posts`

### Layout

**Header**

* Title: `Content`
* Filters:

  * Platform
  * Status (Idea, Draft, Assets ready, Scheduled, Published)
  * Date range

**Form**

* Date
* Platform (Instagram, YouTube, LinkedIn, Medium, Pinterest, Other)
* Content type (post, reel, short, story, article, pin)
* Title / Hook
* Body/Caption
* Status
* Post link (optional)
* Save

**List**

* Cards:

  * Platform badge
  * Title
  * Date
  * Status pill
  * Body snippet
  * Link icon (if posted)
  * Edit icon

### Interactions

* Non-published, `date <= today` → tasks in Today’s Action List.
* Status change:

  * `published` removes tasks and updates Analytics.

---

## 🔟 Analytics Page (`/app/analytics`)

### Purpose

Numbers and charts for clarity.

### Data

* Aggregated from:

  * jobs
  * recruiters
  * learning_logs
  * projects
  * content_posts
  * daily_task_status

### Layout

**Filters**

* Time range: last 7/30/90 days, custom dates.

**Sections (stacked cards)**

1. **Job Funnel**

   * Funnel chart (Applied → Screener → Tech → Offer → Rejected)
   * Text summary line.

2. **Recruiters**

   * Line chart: contacts per week
   * Response rate % & counts.

3. **Learning**

   * Bar chart: minutes per category
   * Streak count
   * Summary.

4. **Projects**

   * Bar/pie: status distribution
   * Completed per period.

5. **Content**

   * Posts per platform
   * Idea→Published flow.

6. **Tasks**

   * Tasks created vs completed per day
   * Completion rate.

### Interactions

* Clicking certain charts could:

  * Open AI Coach with pre-filled question:

    * e.g., “Analyze my job search funnel for the last 30 days.”

---

## 1️⃣1️⃣ Goals Page (`/app/goals`)

### Purpose

Define and track measurable targets.

### Data

* `goals`
* Aggregated metrics (jobs, learning, content, projects) over goal timeframe.

### Layout

**Header**

* Title: `Goals`

**Goal creation card**

* Fields:

  * Title
  * Type (job_applications, learning_minutes, content_posts, projects_completed)
  * Target value (number)
  * Timeframe (weekly, monthly, quarterly, custom)
  * Start date / end date
* Button: `Create goal`

**Goals list**

* Card per goal:

  * Title
  * Timeframe
  * Progress bar: current value / target
  * Summary text:

    * “34 / 150 jobs (23%) · 23 days left”
  * Status tag: `On track` / `Behind` (based on simple projection)
  * Edit icon.

### Interactions

* Creating/editing goals updates:

  * Dashboard snippet
  * Analytics integration.
* AI Coach can see all goals and respond with context.

---

## 1️⃣2️⃣ Weekly Review Page (`/app/review`)

### Purpose

Reflect on the last week & generate AI summaries.

### Data

* `weekly_reviews`
* Aggregated stats (jobs, learning, tasks, content, goals) for chosen week.

### Layout

**Week selector**

* Dropdown or week picker:

  * “This week”, “Last week”, date-based selection (Mon–Sun)

**Weekly stats card**

* Bullets:

  * Jobs: applied / reached interviews / offers
  * Recruiters: contacts & response rate
  * Learning: total minutes & top category
  * Content: posts published
  * Tasks: created vs completed
  * Goals: progress snapshot for overlapping goals

**Review text areas**

* “What went well this week?” (textarea)
* “What didn’t move / where did I get stuck?” (textarea)
* “What did I avoid or procrastinate on?” (textarea)
* “What will I focus on next week?” (textarea)
* Save button.

**AI Review**

* Button: `Generate AI weekly summary`
* Space showing:

  * AI-written summary of week.
  * 3–5 recommended focus points.

### Interactions

* Save review:

  * Stores `weekly_reviews` row.
* Generate AI:

  * Sends stats + freeform review + goals to AI backend.
  * Stores AI result optionally in `weekly_reviews` or `ai_chat_sessions`.

---

## 1️⃣3️⃣ Calendar Page (`/app/calendar`)

### Purpose

Visual overview of your activity over days.

### Data

* Jobs, recruiters, learning, content, tasks by date
* From `activity_log` / raw tables.

### Layout

**Filters**

* View month (month/year picker).
* Toggles: Jobs / Recruiters / Learning / Content / Tasks.

**Calendar grid**

* Standard month grid.
* Each day cell:

  * Date number
  * Tiny dots or badges:

    * e.g., blue dot for jobs, green for learning, etc.
* Today highlighted.

**Right/Bottom detail panel**

* When clicking a day:

  * Summary:

    * Jobs: X
    * Recruiters: Y
    * Learning: Z min
    * Content: P
    * Tasks completed: T
  * Link: “Open this day’s timeline” (scrolls/time-travels to that day’s view or opens a mini timeline).

### Interactions

* Clicking day updates detail panel.
* AI Coach integration button:

  * “Ask AI: What pattern do you see in this month?”

---

## 1️⃣4️⃣ Notes Page (`/app/notes`)

### Purpose

Freeform notes / brain dump.

### Data

* `notes` (start with 1 primary note)

### Layout

**Header**

* Title: `Notes`

**Main editor**

* Large textarea or rich text area (v2).
* Save button or autosave indicator.

### Interactions

* Editing triggers save via React Query.
* Optionally logs `activity_log` event.

---

## 1️⃣5️⃣ Profile Page (`/app/profile`)

### Purpose

Account & data control.

### Data

* `AuthContext.user`
* `user_profiles`
* plan type (guest vs full)

### Layout

**Profile info**

* Email (if full account) or “Guest session” badge.
* Name (editable) from `user_profiles`.
* Plan: “Free”

**Guest section**

* If anonymous:

  * Panel: “You’re in Guest Mode”
  * Explanation + button: `Create account to secure & sync your data`
  * Inline form: email + password
  * After success:

    * Data migrated
    * Profile reloads as full account.

**Data Section**

* Export:

  * Button: `Export all my data` → triggers file download.
* Delete:

  * Danger zone card:

    * Text: “Permanently delete my account & all data”
    * Button `Delete account`
    * Confirmation input (`DELETE`)

**Logout**

* Simple button: `Log out`

### Interactions

* Edit name → update `user_profiles`.
* Guest upgrade → call migration function.
* Export → call Edge function & download file.
* Delete account → call Edge function & redirect to `/`.

---

## 1️⃣6️⃣ AI Coach (Overlay on all `/app` pages)

### Purpose

Personal assistant that understands your actual data.

### Data

* Everything relevant for mode:

  * Jobs, recruiters, learning, projects, content, goals, stats, weekly reviews, etc.

### Layout

**Entry**

* Floating chat button at bottom-right.
* On click → slide-out panel from right edge.

**Header**

* Title: “AI Coach”
* Tabs:

  * General
  * Job
  * Learning
  * Projects
  * Content

**Shortcut buttons**
Below header:

* General mode:

  * “Summarize my last 7 days”
  * “Give me a 5-day action plan”
  * “What are my top 3 priorities today?”
  * “Write a weekly update draft”

* Job mode:

  * “Analyze my job funnel”
  * “Suggest changes to my job search strategy”

* Learning mode:

  * “Plan my next 2 weeks of learning”

* Projects mode:

  * “Help me prioritize my projects”

* Content mode:

  * “Generate 3 post ideas based on my recent learning”

**Conversation area**

* Messages styled like chat bubbles:

  * User (right)
  * AI (left)

**Input**

* Textarea row:

  * Input box
  * `Send` button
  * Small hint text: “Ask about your jobs, learning, projects, content, goals…”

### Interactions

* Mode tab change:

  * Adjusts system prompt on backend.
* Clicking shortcut:

  * Inserts templated message & sends automatically.
* Sending message:

  * Calls backend AI endpoint with:

    * user_id
    * mode
    * message
  * Backend fetches context from Supabase, calls LLM, returns answer.

---

Yes, that’s a **perfect** last layer to add – and with Supabase it fits really cleanly.
Think of it as adding a **Realtime layer** on top of everything we already designed.

I’ll explain what this changes in the architecture + UX, and how we’d wire it.

---

## 🧱 What we’re adding: Realtime Sync Layer

We keep everything we already defined (pages, tables, AI coach, goals, weekly review, calendar, etc.), and we add:

> **Realtime subscriptions on all key tables so any change instantly updates the UI — no manual refresh.**

### 1️⃣ New “Realtime” Layer in Architecture

**Current stack:**

* React + Vite + TS
* Supabase (Postgres + Auth)
* React Query for fetching & caching
* Pages: Dashboard, Jobs, Recruiters, Learning, Projects, Content, Analytics, Goals, Review, Calendar, Notes, Profile
* AI Coach, PWA, etc.

**New layer:**

* **RealtimeProvider (global)**:

  * Subscribes to Supabase Realtime channels for all important tables:

    * `jobs`
    * `recruiters`
    * `learning_logs`
    * `projects`
    * `content_posts`
    * `daily_custom_tasks`
    * `daily_task_status`
    * `goals`
    * `weekly_reviews`
    * `notes`
    * `activity_log`
  * On every `INSERT / UPDATE / DELETE` for the current `user_id`, it:

    * Calls `queryClient.invalidateQueries(...)` for the relevant keys
      (e.g., `['jobs', user.id]`, `['daily-dashboard', user.id]`, etc.)

So instead of manually refreshing or refetching, **React Query sees invalidation and refetches silently** → UI updates everywhere.

### 2️⃣ How it feels in the UI (UX impact)

Across the app, this gives you a *live* feeling:

* On **Daily Dashboard**:

  * If you add a job on `/app/jobs`, the **jobs today count** and **timeline** update **instantly** on the dashboard screen.
  * If you complete a task on your phone, the same task is struck-through on your laptop.

* On **Jobs page**:

  * Adding/updating jobs on one device updates lists on another device in real time.
  * If you change a job from “Applied” → “Tech Round”, Analytics & Dashboard will reflect it without refresh.

* On **Learning / Projects / Content pages**:

  * Logging a new learning session immediately:

    * Updates the **Today Overview** minutes
    * Creates a new learning task in **Today’s Action List**
    * Shows up in **Analytics** and **Calendar** as soon as the queries refetch.

* On **Goals page**:

  * If you adjust a goal, Dashboard’s goal snippet & Analytics progress bars re-adjust automatically.

* On **Weekly Review & Analytics**:

  * While you’re filling review, any new activity (e.g., learning log added from phone) will shift the stats live.

* On **Calendar & Timeline**:

  * New activity logs appear on the timeline without any reload.
  * Calendar dots (jobs/learning/tasks) update as you record things.

* On **Profile (export/delete/upgrade)**:

  * After upgrading guest → full account, your user_id changes; the RealtimeProvider reconnects on the new session and starts listening for that new user’s data automatically.

So the app turns into a **multi-device, real-time command center**.

---

## ⚙️ Implementation Sketch (High Level)

You don’t have to remember all details now, but this is the core pattern:

1. **Create a RealtimeProvider**:

   * Reads current `user` from `AuthContext`.
   * When `user` changes, subscribes to `supabase.channel(...)` for each table with `user_id = current user`.
   * For each event (`INSERT`, `UPDATE`, `DELETE`), it:

     * Figures out which queries are impacted.
     * Calls `queryClient.invalidateQueries(...)`.

2. **React Query**:

   * All existing hooks (`useDailyDashboard`, `useJobs`, `useLearning`, etc.) already use `queryKey` like `['jobs', user.id]`.
   * When invalidated, they refetch the latest data in the background.

3. **Result**:

   * Every open page stays fresh across all tabs/devices.

Later, you can get fancy and:

* Do **optimistic updates** for instant feedback on local actions.
* Use event payload to patch cache instead of full refetch for some cases (like `setQueryData`).

---

## 🔁 Updated Architecture Summary with Realtime

Here’s the “final-final” abstract view:

* **Data & Auth**:

  * Supabase Postgres, Auth (email + guest), RLS by `user_id`
* **API / Logic**:

  * React Query for data fetching
  * Edge Functions for:

    * AI Coach
    * Export all data
    * Delete account
    * Guest → full account migration
* **Realtime Layer**:

  * Global `RealtimeProvider` subscribing to all key tables for current user.
  * On any DB change → invalidates relevant React Query caches.
* **Frontend App**:

  * PWA-enabled React/Vite app
  * Routing: `/` (Landing), `/auth`, `/app/*`
  * Features:

    * Daily Dashboard (action list + timeline)
    * Jobs, Recruiters, Learning, Projects, Content
    * Goals
    * Weekly Review
    * Analytics
    * Calendar & Timeline
    * Notes
    * Profile (guest upgrade, export, delete)
    * AI Coach (shortcuts + deep modes)
* **UX**:

  * Feels “alive” – data flows in real time, no manual refresh needed.

---



