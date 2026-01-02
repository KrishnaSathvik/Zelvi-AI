# Zelvi AI - Phases 2-8 Implementation Roadmap

**Last Updated:** December 23, 2025

This document outlines the detailed implementation plan for Phases 2 through 8 of Zelvi AI development.

---

## Phase 2: Learning + Dashboard (MVP Working Loop) 🎯

**Goal:** Create the first working vertical slice - log learning → see on dashboard → mark tasks done.

### 2.1 Learning Logs CRUD Page (`/app/learning`)

#### Components to Build:
- `src/pages/Learning.tsx` - Main learning page
- `src/components/learning/LearningForm.tsx` - Form for creating/editing learning logs
- `src/components/learning/LearningList.tsx` - List of learning entries grouped by date
- `src/hooks/useLearning.ts` - React Query hook for learning data

#### Features:
1. **Header Section:**
   - Title: "Learning"
   - Quick stats: "This month: X min · Most time in: {category}"
   - Stats calculated from `learning_logs` aggregated by category

2. **Form (`LearningForm.tsx`):**
   - Fields:
     - Date (date picker, defaults to today)
     - Category (dropdown): `de`, `ai_ml`, `genai`, `rag`, `system_design`, `interview`, `other`
     - Topic (text input, required)
     - Minutes (number input, required, > 0)
     - Resource (text input, optional - URL or description)
     - Takeaways (textarea, optional)
   - Save button with loading state
   - Edit mode: pre-fill form when editing existing entry

3. **List (`LearningList.tsx`):**
   - Group entries by date (newest first)
   - Each entry shows:
     - Date header: "Mon, Jan 5"
     - Category pill (color-coded)
     - Topic + minutes
     - Resource link icon (if provided)
     - Takeaways snippet (truncated)
     - Edit icon (opens form in edit mode)
     - Delete icon (with confirmation)

#### Data Operations:
- `useLearning()` hook:
  - Query key: `['learning', user.id]`
  - Fetches all `learning_logs` for user, ordered by date DESC
- Mutations:
  - `createLearningLog()` - Insert new learning_log
  - `updateLearningLog(id)` - Update existing
  - `deleteLearningLog(id)` - Delete with confirmation

#### Activity Log Integration:
- On create: Insert into `activity_log`:
  ```typescript
  {
    event_type: 'learning_created',
    description: `Learning: ${topic} (${minutes} min) [${category}]`,
    event_date: date
  }
  ```

#### GA4 Events:
- `learning_session_created` on successful save

---

### 2.2 Activity Log Writing

#### Components:
- `src/lib/activityLog.ts` - Helper functions for activity logging

#### Functions:
```typescript
// Log learning creation
logLearningCreated(learningLog: LearningLog)

// Log task completion
logTaskCompleted(taskKey: string, taskLabel: string)

// Generic logger
logActivity(eventType: string, description: string, eventDate: Date, metadata?: object)
```

#### Implementation:
- Create helper that inserts into `activity_log` table
- Called automatically after successful CRUD operations
- No UI component needed (used by other features)

---

### 2.3 Dashboard - Summary Bar

#### Component:
- `src/components/dashboard/SummaryBar.tsx`

#### Data Needed:
- Jobs today count (from `jobs` where `applied_date = today`)
- Recruiters contacted today (from `recruiters` where `last_contact_date = today`)
- Learning minutes today (from `learning_logs` where `date = today`, sum minutes)
- Content due/published (from `content_posts` where `date = today`)
- Tasks done/total (from `daily_task_status` + computed tasks)
- Goals snapshot (from `goals` where active, show progress)

#### Display:
- Horizontal scrollable cards on mobile
- Grid layout on desktop
- Each card:
  - Icon/emoji
  - Label
  - Value
  - Optional link to related page

#### React Query Hooks:
- `useDailySummary()` - Aggregates all summary data
- Query key: `['daily-summary', user.id, today]`

---

### 2.4 Dashboard - Today's Action List

#### Components:
- `src/components/dashboard/ActionList.tsx` - Main container
- `src/components/dashboard/TaskRow.tsx` - Individual task row
- `src/components/dashboard/TaskFilters.tsx` - Filter chips
- `src/hooks/useDailyTasks.ts` - Computes all tasks for today

#### Task Generation Logic (`useDailyTasks.ts`):

1. **Manual Tasks:**
   - Source: `daily_custom_tasks` where `due_date <= today`
   - Task key: `manual:<task_id>`
   - Label: Task title
   - Type: `Manual`
   - Show if: No `daily_task_status` exists for this task_key + today

2. **Learning Tasks:**
   - Source: `learning_logs` where `date <= today`
   - Task key: `learning:<learning_id>`
   - Task date: `learning_logs.date`
   - Label: `Learning – {topic} ({minutes} min)`
   - Type: `Learning`
   - Show if: No `daily_task_status` exists for task_key + task_date

3. **Content Tasks:**
   - Source: `content_posts` where `date <= today` AND `status != 'published'`
   - Task key: `content:<content_id>`
   - Label: `Content – {platform}: {title}`
   - Type: `Content`
   - Show if: No `daily_task_status` exists for task_key + today

4. **Project Tasks:**
   - Source: `projects` where `status != 'done'` AND `next_action IS NOT NULL`
   - Task key: `project:<project_id>:<YYYY-MM-DD>` (today's date)
   - Label: `Project – {name}: {next_action}`
   - Type: `Project`
   - Show if: No `daily_task_status` exists for task_key + today

#### UI Features:
- Input: "Add anything to do today…" → creates manual task
- Filter chips: `All | Manual | Learning | Content | Projects`
- Each task row:
  - Checkbox (unchecked = not done)
  - Label with type tag
  - Overdue indicator (amber) if `due_date < today`
  - Delete icon (only for manual tasks)

#### Task Completion:
- On checkbox click:
  - Insert into `daily_task_status`:
    ```typescript
    {
      task_key: 'manual:123',
      task_date: today,
      completed_at: now()
    }
  ```
  - Log activity: `logTaskCompleted(task_key, taskLabel)`
  - Invalidate queries: `['daily-tasks', user.id, today]`, `['daily-summary', user.id, today]`

#### Task Creation (Manual):
- On "Add" click:
  - Insert into `daily_custom_tasks`:
    ```typescript
    {
      title: inputValue,
      due_date: today
    }
  ```
  - Log activity: `logActivity('task_created', 'Created manual task: {title}', today)`

#### Task Deletion (Manual only):
- Delete from `daily_custom_tasks`
- Delete related `daily_task_status` rows
- Invalidate queries

---

### 2.5 Dashboard - Today's Timeline

#### Component:
- `src/components/dashboard/Timeline.tsx`

#### Data:
- Query `activity_log` where `event_date = today`, ordered by `occurred_at` DESC

#### Display:
- Vertical timeline
- Each entry:
  - Time (HH:MM format)
  - Description (from `activity_log.description`)
- Empty state: "No events logged yet. Add jobs, learning sessions, content, or tasks to see them here."

#### React Query:
- `useTodayTimeline()` hook
- Query key: `['timeline', user.id, today]`

---

### 2.6 Dashboard Page Integration

#### Component:
- `src/pages/Dashboard.tsx` - Main dashboard page

#### Layout:
```
┌─────────────────────────────────┐
│     SummaryBar (6 cards)        │
├─────────────────────────────────┤
│  Today's Action List            │
│  [Filters] [Add task input]     │
│  [Task rows...]                 │
├─────────────────────────────────┤
│  Today's Activity Timeline      │
│  [Timeline entries...]          │
└─────────────────────────────────┘
```

#### React Query Hooks Used:
- `useDailySummary()` - Summary bar data
- `useDailyTasks(today)` - Action list tasks
- `useTodayTimeline()` - Timeline events

---

### 2.7 Database Tables Required

Ensure these tables exist (from Starterguide.md schemas):
- ✅ `learning_logs`
- ✅ `daily_custom_tasks`
- ✅ `daily_task_status`
- ✅ `activity_log`

---

### 2.8 Phase 2 Deliverables

**Files to Create:**
```
src/
├── pages/
│   └── Learning.tsx                    ✅ Learning CRUD page
├── components/
│   ├── learning/
│   │   ├── LearningForm.tsx           ✅ Form component
│   │   └── LearningList.tsx           ✅ List component
│   └── dashboard/
│       ├── SummaryBar.tsx             ✅ Summary cards
│       ├── ActionList.tsx             ✅ Task list
│       ├── TaskRow.tsx                ✅ Task item
│       ├── TaskFilters.tsx             ✅ Filter chips
│       └── Timeline.tsx                ✅ Timeline component
├── hooks/
│   ├── useLearning.ts                 ✅ Learning data hook
│   ├── useDailyTasks.ts               ✅ Task computation hook
│   ├── useDailySummary.ts             ✅ Summary data hook
│   └── useTodayTimeline.ts            ✅ Timeline data hook
└── lib/
    └── activityLog.ts                  ✅ Activity logging helpers
```

**Updated Files:**
- `src/pages/Dashboard.tsx` - Full dashboard implementation

**Testing:**
1. Create learning log → appears in dashboard summary
2. Learning log creates task in action list
3. Mark task complete → updates summary, logs to timeline
4. Add manual task → appears in list
5. Delete manual task → removes from list
6. Timeline shows all today's activities

---

## Phase 3: Jobs + Recruiters 💼

**Goal:** Add job search and recruiter CRM functionality, integrated with dashboard.

### 3.1 Jobs Page (`/app/jobs`)

#### Components:
- `src/pages/Jobs.tsx` - Main jobs page
- `src/components/jobs/JobForm.tsx` - Create/edit form
- `src/components/jobs/JobList.tsx` - List/table view
- `src/components/jobs/JobFilters.tsx` - Filter controls
- `src/hooks/useJobs.ts` - Jobs data hook

#### Features:

1. **Header:**
   - Title: "Jobs"
   - Button: "Add job"
   - Filters: Status, Source, Date range (dropdowns)

2. **Job Form:**
   - Fields:
     - Role (text, required)
     - Company (text, required)
     - Location (text)
     - Job type (select): `remote`, `hybrid`, `onsite`, `contract`, `full_time`
     - Salary range: min (number), max (number), currency (default: USD)
     - Source (select): `LinkedIn`, `Indeed`, `Referral`, `Vendor`, `Other`
     - Status (select, required): `applied`, `screener`, `tech`, `offer`, `rejected`, `saved`
     - Applied date (date picker)
     - Job URL (text, optional)
     - Notes (textarea)
   - Save button

3. **Job List:**
   - Display: Table or card layout
   - Columns/Fields:
     - Role @ Company (bold)
     - Location · type · source
     - Status pill (color-coded)
     - Applied date
     - Link icon (opens job URL in new tab)
     - Notes snippet (truncated)
     - Edit icon
     - Delete icon (with confirmation)

#### Data Operations:
- `useJobs(filters?)` hook:
  - Query key: `['jobs', user.id, filters]`
  - Supports filtering by status, source, date range
- Mutations:
  - `createJob()` - Insert new job
  - `updateJob(id)` - Update existing
  - `deleteJob(id)` - Delete with confirmation

#### Activity Log:
- On create: `logActivity('job_created', 'Applied to {role} @ {company}', applied_date)`
- On status change: `logActivity('job_status_updated', 'Job {role} @ {company} moved to {status}', today)`

#### Dashboard Integration:
- Jobs with `applied_date == today` appear in:
  - Summary bar: "X applied today"
  - Timeline: "Applied to {role} @ {company}"

#### GA4 Events:
- `job_created`
- `job_status_updated`

---

### 3.2 Recruiters Page (`/app/recruiters`)

#### Components:
- `src/pages/Recruiters.tsx` - Main recruiters page
- `src/components/recruiters/RecruiterForm.tsx` - Create/edit form
- `src/components/recruiters/RecruiterList.tsx` - List view
- `src/components/recruiters/RecruiterFilters.tsx` - Filter controls
- `src/hooks/useRecruiters.ts` - Recruiters data hook

#### Features:

1. **Header:**
   - Title: "Recruiters"
   - Filters: Status, Platform (dropdowns)

2. **Recruiter Form:**
   - Fields:
     - Name (text, required)
     - Company (text)
     - Platform (select): `LinkedIn`, `Email`, `WhatsApp`, `Other`
     - Role (text) - role they're hiring for
     - Status (select): `messaged`, `replied`, `call`, `submitted`, `ghosted`
     - Last contact date (date picker)
     - Notes (textarea)
   - Save button

3. **Recruiter List:**
   - Card layout:
     - Line 1: `{Name} – {Company} ({Platform})`
     - Line 2: `Role: {role}`
     - Status pill
     - Last contact date
     - Notes snippet
     - Edit icon
     - Delete icon

#### Data Operations:
- `useRecruiters(filters?)` hook
- Mutations: create, update, delete

#### Activity Log:
- On create/update: `logActivity('recruiter_contacted', 'Contacted recruiter {name} ({platform}) for {role}', last_contact_date)`

#### Dashboard Integration:
- Recruiters with `last_contact_date == today` appear in:
  - Summary bar: "X contacted"
  - Timeline: "Contacted recruiter..."

#### GA4 Events:
- `recruiter_created`
- `recruiter_status_updated`

---

### 3.3 Phase 3 Deliverables

**Files to Create:**
```
src/
├── pages/
│   ├── Jobs.tsx                       ✅ Jobs page
│   └── Recruiters.tsx                 ✅ Recruiters page
├── components/
│   ├── jobs/
│   │   ├── JobForm.tsx                ✅ Job form
│   │   ├── JobList.tsx                ✅ Job list
│   │   └── JobFilters.tsx             ✅ Job filters
│   └── recruiters/
│       ├── RecruiterForm.tsx          ✅ Recruiter form
│       ├── RecruiterList.tsx          ✅ Recruiter list
│       └── RecruiterFilters.tsx       ✅ Recruiter filters
└── hooks/
    ├── useJobs.ts                     ✅ Jobs data hook
    └── useRecruiters.ts               ✅ Recruiters data hook
```

**Updated Files:**
- `src/components/dashboard/SummaryBar.tsx` - Add jobs & recruiters cards
- `src/lib/activityLog.ts` - Add job/recruiter logging functions

---

## Phase 4: Projects + Content 🚀

**Goal:** Add project management and content planning, with task generation.

### 4.1 Projects Page (`/app/projects`)

#### Components:
- `src/pages/Projects.tsx` - Main projects page
- `src/components/projects/ProjectForm.tsx` - Create/edit form
- `src/components/projects/ProjectList.tsx` - Card grid
- `src/components/projects/ProjectFilters.tsx` - Filter controls
- `src/hooks/useProjects.ts` - Projects data hook

#### Features:

1. **Header:**
   - Title: "Projects"
   - Filters: Status, Priority (dropdowns)

2. **Project Form:**
   - Fields:
     - Name (text, required)
     - Category (select): `de`, `ai`, `genai`, `rag`, `product`, `other`
     - Status (select, required): `planning`, `building`, `polishing`, `done`, `archived`
     - Priority (select): `high`, `medium`, `low`
     - GitHub URL (text, optional)
     - Live URL (text, optional)
     - Next action (text) - **Important: feeds daily tasks**
     - Notes (textarea)
     - Started at (date, optional)
     - Completed at (date, optional, auto-set when status = 'done')
   - Save button

3. **Project List:**
   - Card grid layout:
     - Name (bold)
     - Status pill
     - Category + Priority tags
     - "Next: {next_action}" (if exists)
     - Links: GitHub / Live (icons)
     - Notes preview
     - Edit icon
     - Delete icon

#### Task Generation:
- Projects with `status != 'done'` AND `next_action IS NOT NULL` generate daily tasks:
  - Task key: `project:<project_id>:<YYYY-MM-DD>`
  - Label: `Project – {name}: {next_action}`
  - Appears every day until:
    - Task completed for that day, OR
    - Project status = 'done', OR
    - `next_action` updated/cleared

#### Activity Log:
- On create: `logActivity('project_created', 'Started project {name}', started_at)`
- On status change: `logActivity('project_status_updated', 'Project {name} moved to {status}', today)`
- On next_action change: `logActivity('project_action_updated', 'Updated next action for {name}', today)`

#### Dashboard Integration:
- Projects feed into:
  - Action list (via task generation)
  - Timeline (status changes, completions)

#### GA4 Events:
- `project_created`
- `project_status_updated`

---

### 4.2 Content Planner Page (`/app/content`)

#### Components:
- `src/pages/Content.tsx` - Main content page
- `src/components/content/ContentForm.tsx` - Create/edit form
- `src/components/content/ContentList.tsx` - List view
- `src/components/content/ContentFilters.tsx` - Filter controls
- `src/hooks/useContent.ts` - Content data hook

#### Features:

1. **Header:**
   - Title: "Content"
   - Filters: Platform, Status, Date range

2. **Content Form:**
   - Fields:
     - Date (date picker, required) - planned publish date
     - Platform (select, required): `instagram`, `youtube`, `linkedin`, `medium`, `pinterest`, `other`
     - Content type (select): `post`, `reel`, `short`, `story`, `article`, `pin`
     - Title/Hook (text, required)
     - Body/Caption (textarea)
     - Status (select, required): `idea`, `draft`, `assets_ready`, `scheduled`, `published`
     - Post URL (text, optional) - link to published content
   - Save button

3. **Content List:**
   - Card layout:
     - Platform badge (color-coded)
     - Title
     - Date
     - Status pill
     - Body snippet (truncated)
     - Link icon (if published, opens post_url)
     - Edit icon
     - Delete icon

#### Task Generation:
- Content with `status != 'published'` AND `date <= today` generates tasks:
  - Task key: `content:<content_id>`
  - Label: `Content – {platform}: {title}`
  - Appears until:
    - Task completed, OR
    - Status changed to `published`

#### Activity Log:
- On create: `logActivity('content_created', 'Content planned: {platform} – {title}', date)`
- On publish: `logActivity('content_published', 'Published content on {platform}: {title}', date)`

#### Dashboard Integration:
- Content feeds into:
  - Summary bar: "X due / Y published"
  - Action list (via task generation)
  - Timeline (creation, publishing)

#### GA4 Events:
- `content_post_created`
- `content_status_updated`

---

### 4.3 Phase 4 Deliverables

**Files to Create:**
```
src/
├── pages/
│   ├── Projects.tsx                   ✅ Projects page
│   └── Content.tsx                    ✅ Content page
├── components/
│   ├── projects/
│   │   ├── ProjectForm.tsx            ✅ Project form
│   │   ├── ProjectList.tsx            ✅ Project list
│   │   └── ProjectFilters.tsx         ✅ Project filters
│   └── content/
│       ├── ContentForm.tsx            ✅ Content form
│       ├── ContentList.tsx            ✅ Content list
│       └── ContentFilters.tsx         ✅ Content filters
└── hooks/
    ├── useProjects.ts                 ✅ Projects data hook
    └── useContent.ts                  ✅ Content data hook
```

**Updated Files:**
- `src/hooks/useDailyTasks.ts` - Add project & content task generation
- `src/components/dashboard/SummaryBar.tsx` - Add content card

---

## Phase 5: Goals + Analytics + Calendar 📊

**Goal:** Add goal tracking, comprehensive analytics, and calendar visualization.

### 5.1 Goals Page (`/app/goals`)

#### Components:
- `src/pages/Goals.tsx` - Main goals page
- `src/components/goals/GoalForm.tsx` - Create/edit form
- `src/components/goals/GoalList.tsx` - Goals with progress bars
- `src/hooks/useGoals.ts` - Goals data hook
- `src/hooks/useGoalProgress.ts` - Calculate progress for each goal

#### Features:

1. **Header:**
   - Title: "Goals"

2. **Goal Form:**
   - Fields:
     - Title (text, required)
     - Type (select, required): `job_applications`, `recruiter_contacts`, `learning_minutes`, `content_posts`, `projects_completed`
     - Target value (number, required, > 0)
     - Timeframe (select, required): `weekly`, `monthly`, `quarterly`, `custom`
     - Start date (date, required)
     - End date (date, required)
     - Is active (checkbox, default: true)
   - Save button

3. **Goal List:**
   - Card per goal:
     - Title
     - Timeframe badge
     - Progress bar: current / target (percentage)
     - Summary text: "{current} / {target} {type} ({percentage}%) · {days} days left"
     - Status tag: `On track` / `Behind` (based on projection)
     - Edit icon
     - Archive/Delete icon

#### Progress Calculation (`useGoalProgress.ts`):
- For each goal, query relevant data:
  - `job_applications`: Count jobs where `applied_date` between start_date and end_date
  - `recruiter_contacts`: Count recruiters where `last_contact_date` in range
  - `learning_minutes`: Sum minutes from `learning_logs` where `date` in range
  - `content_posts`: Count content where `status = 'published'` AND `date` in range
  - `projects_completed`: Count projects where `status = 'done'` AND `completed_at` in range

#### Status Calculation:
- `On track`: If `(current / days_elapsed) * days_total >= target`
- `Behind`: Otherwise

#### Activity Log:
- On create: `logActivity('goal_created', 'Created goal: {title}', start_date)`
- On completion: `logActivity('goal_completed', 'Goal reached: {title}', today)` (when current >= target)

#### Dashboard Integration:
- Active goals appear in summary bar:
  - Snapshot: "Q1 Jobs: 34 / 150"
  - Click to go to goals page

#### GA4 Events:
- `goal_created`
- `goal_updated`
- `goal_completed`

---

### 5.2 Analytics Page (`/app/analytics`)

#### Components:
- `src/pages/Analytics.tsx` - Main analytics page
- `src/components/analytics/AnalyticsFilters.tsx` - Time range selector
- `src/components/analytics/JobFunnelChart.tsx` - Funnel visualization
- `src/components/analytics/RecruiterChart.tsx` - Line chart
- `src/components/analytics/LearningChart.tsx` - Bar chart
- `src/components/analytics/ProjectChart.tsx` - Pie/bar chart
- `src/components/analytics/ContentChart.tsx` - Bar chart
- `src/components/analytics/TaskChart.tsx` - Line chart
- `src/hooks/useAnalytics.ts` - Aggregated analytics data

#### Features:

1. **Filters:**
   - Time range selector: Last 7/30/90 days, Custom dates
   - Applied to all charts

2. **Job Funnel Chart:**
   - Funnel visualization (using Recharts BarChart styled as funnel):
     - Applied → Screener → Tech → Offer → Rejected
   - Summary text: "X applications, Y reached interviews, Z offers"
   - "Ask AI about this →" button (opens AI Coach with context)

3. **Recruiters Chart:**
   - Line chart: Contacts per week
   - Response rate % & counts
   - Summary: "X contacts, Y% response rate"

4. **Learning Chart:**
   - Bar chart: Minutes per category
   - Streak count (consecutive days with learning)
   - Summary: "X total minutes, Y day streak"

5. **Projects Chart:**
   - Pie/Bar chart: Status distribution
   - Completed per period count
   - Summary: "X active, Y completed"

6. **Content Chart:**
   - Bar chart: Posts per platform
   - Status flow: Idea → Published
   - Summary: "X published, Y in pipeline"

7. **Tasks Chart:**
   - Line chart: Tasks created vs completed per day
   - Completion rate %
   - Summary: "X% completion rate"

#### Data Aggregation (`useAnalytics.ts`):
- Query all relevant tables filtered by time range
- Aggregate by:
  - Jobs: Group by status, count
  - Recruiters: Group by week, count contacts & responses
  - Learning: Group by category, sum minutes, calculate streak
  - Projects: Group by status, count
  - Content: Group by platform & status, count
  - Tasks: Group by date, count created vs completed

#### AI Integration:
- Each chart card has "Ask AI about this →" button
- Opens AI Coach in relevant mode with pre-filled context:
  - Job funnel → Job mode: "Analyze my job search funnel for the last 30 days"
  - Learning → Learning mode: "What patterns do you see in my learning?"
  - etc.

#### GA4 Events:
- `analytics_view`
- `ask_ai_from_analytics` (when clicking AI button)

---

### 5.3 Calendar Page (`/app/calendar`)

#### Components:
- `src/pages/Calendar.tsx` - Main calendar page
- `src/components/calendar/CalendarGrid.tsx` - Month grid
- `src/components/calendar/DayDetail.tsx` - Selected day panel
- `src/components/calendar/CalendarFilters.tsx` - Category toggles
- `src/hooks/useCalendarData.ts` - Activity data by date

#### Features:

1. **Filters:**
   - Month/Year picker
   - Category toggles: Jobs / Recruiters / Learning / Content / Tasks

2. **Calendar Grid:**
   - Standard month grid (7 days × ~5 weeks)
   - Each day cell:
     - Date number
     - Tiny dots/badges per category:
       - Blue dot: Jobs
       - Green dot: Learning
       - Yellow dot: Content
       - Purple dot: Tasks
       - Orange dot: Recruiters
     - Today highlighted (border/background)
   - Click day → opens detail panel

3. **Day Detail Panel:**
   - Summary counts:
     - Jobs: X
     - Recruiters: Y
     - Learning: Z min
     - Content: P
     - Tasks completed: T
   - Mini timeline: List of that day's activity entries
   - Link: "Open this day's timeline" (scrolls to dashboard or opens modal)

#### Data:
- Query `activity_log` + raw tables grouped by date
- Filter by selected categories
- Aggregate counts per day

#### AI Integration:
- Button: "Ask AI: What pattern do you see in this month?"
- Opens AI Coach with calendar context

#### GA4 Events:
- `calendar_view`
- `calendar_day_selected`

---

### 5.4 Phase 5 Deliverables

**Files to Create:**
```
src/
├── pages/
│   ├── Goals.tsx                      ✅ Goals page
│   ├── Analytics.tsx                  ✅ Analytics page
│   └── Calendar.tsx                   ✅ Calendar page
├── components/
│   ├── goals/
│   │   ├── GoalForm.tsx               ✅ Goal form
│   │   └── GoalList.tsx               ✅ Goal list with progress
│   ├── analytics/
│   │   ├── AnalyticsFilters.tsx        ✅ Time range selector
│   │   ├── JobFunnelChart.tsx         ✅ Funnel chart
│   │   ├── RecruiterChart.tsx         ✅ Line chart
│   │   ├── LearningChart.tsx          ✅ Bar chart
│   │   ├── ProjectChart.tsx           ✅ Pie/bar chart
│   │   ├── ContentChart.tsx           ✅ Bar chart
│   │   └── TaskChart.tsx               ✅ Line chart
│   └── calendar/
│       ├── CalendarGrid.tsx            ✅ Month grid
│       ├── DayDetail.tsx                ✅ Day panel
│       └── CalendarFilters.tsx         ✅ Category toggles
└── hooks/
    ├── useGoals.ts                    ✅ Goals data hook
    ├── useGoalProgress.ts              ✅ Progress calculation
    ├── useAnalytics.ts                ✅ Analytics aggregation
    └── useCalendarData.ts              ✅ Calendar data
```

**Dependencies:**
- Recharts already installed ✅

---

## Phase 6: Weekly Review + AI Coach 🤖

**Goal:** Add weekly reflection and AI-powered coaching.

### 6.1 Weekly Review Page (`/app/review`)

#### Components:
- `src/pages/WeeklyReview.tsx` - Main review page
- `src/components/review/WeekSelector.tsx` - Week picker
- `src/components/review/WeeklyStats.tsx` - Stats summary card
- `src/components/review/ReviewForm.tsx` - Text areas
- `src/components/review/AISummary.tsx` - AI-generated summary
- `src/hooks/useWeeklyReview.ts` - Review data hook
- `src/hooks/useWeeklyStats.ts` - Aggregate stats for week

#### Features:

1. **Week Selector:**
   - Dropdown: "This week", "Last week", or date picker (Mon-Sun)
   - Calculates week_start (Monday) and week_end (Sunday)

2. **Weekly Stats Card:**
   - Aggregated stats for selected week:
     - Jobs: applied / reached interviews / offers
     - Recruiters: contacts & response rate
     - Learning: total minutes & top category
     - Content: posts published
     - Tasks: created vs completed
     - Goals: progress snapshot for overlapping goals

3. **Review Form:**
   - Text areas:
     - "What went well this week?" (textarea)
     - "What didn't move / where did I get stuck?" (textarea)
     - "What did I avoid or procrastinate on?" (textarea)
     - "What will I focus on next week?" (textarea)
   - Save button
   - Auto-save indicator

4. **AI Review:**
   - Button: "Generate AI weekly summary"
   - Loading state while generating
   - Display area:
     - AI-written narrative summary
     - 3-5 recommended focus points (bullets)
   - Save AI summary button (optional)

#### Data Operations:
- `useWeeklyReview(week_start)` hook:
  - Query key: `['weekly-review', user.id, week_start]`
  - Fetches or creates review for that week
- Mutations:
  - `saveReview()` - Upsert `weekly_reviews` row
  - `generateAISummary()` - Calls Edge Function, stores result

#### AI Summary Generation:
- Edge Function: `ai-weekly-summary`
- Input:
  - user_id
  - week_start, week_end
  - stats (from `useWeeklyStats`)
  - review text (wins, challenges, avoided, next_focus)
  - goals (active goals overlapping week)
- Backend:
  - Fetches all relevant data
  - Builds context summary
  - Calls OpenAI with prompt:
    ```
    You are Zelvi AI, the user's personal OS coach.
    Review their week: {stats}
    They wrote: {review_text}
    Their goals: {goals}
    Generate a narrative summary and 3-5 actionable focus points for next week.
    ```
  - Returns: `{ summary: string, focus_points: string[] }`
- Frontend stores in `weekly_reviews.ai_summary`

#### Activity Log:
- On save: `logActivity('weekly_review_saved', 'Saved weekly review for week starting {week_start}', week_start)`

#### GA4 Events:
- `weekly_review_saved`
- `weekly_review_ai_generated`

---

### 6.2 AI Coach (Global Overlay)

#### Components:
- `src/components/ai/AICoachButton.tsx` - Floating button
- `src/components/ai/AICoachDrawer.tsx` - Slide-out panel
- `src/components/ai/ChatMessage.tsx` - Message bubble
- `src/components/ai/ShortcutButtons.tsx` - Quick actions
- `src/components/ai/ChatInput.tsx` - Input area
- `src/hooks/useAICoach.ts` - Chat state & API calls

#### Features:

1. **Floating Button:**
   - Fixed position: bottom-right
   - Icon: Chat/AI icon
   - Badge: Unread count (optional)
   - Click → opens drawer

2. **Drawer Layout:**
   - Slide-out from right edge
   - Width: ~400px on desktop, full-width on mobile
   - Header:
     - Title: "AI Coach"
     - Tabs: General, Job, Learning, Projects, Content
     - Close button

3. **Shortcut Buttons:**
   - Below header, mode-specific:
     - **General:**
       - "Summarize my last 7 days"
       - "Give me a 5-day action plan"
       - "What are my top 3 priorities today?"
       - "Write a weekly update draft"
     - **Job:**
       - "Analyze my job funnel"
       - "Suggest changes to my job search strategy"
     - **Learning:**
       - "Plan my next 2 weeks of learning"
     - **Projects:**
       - "Help me prioritize my projects"
     - **Content:**
       - "Generate 3 post ideas based on my recent learning"

4. **Conversation Area:**
   - Scrollable message list
   - Messages styled as chat bubbles:
     - User (right, blue)
     - AI (left, gray)
   - Loading indicator while AI responds

5. **Input:**
   - Textarea
   - Send button
   - Hint text: "Ask about your jobs, learning, projects, content, goals…"

#### Data Operations:
- `useAICoach(mode)` hook:
  - Manages chat state (messages, loading)
  - Calls Edge Function: `ai-coach`
- Edge Function: `ai-coach`
  - Input:
    ```typescript
    {
      mode: 'general' | 'job' | 'learning' | 'projects' | 'content',
      message: string,
      time_range?: number // days, default 30
    }
    ```
  - Backend:
    1. Validate JWT → user_id
    2. Fetch relevant data based on mode:
       - **general**: Last N days stats (all tables)
       - **job**: Jobs, recruiters, funnel data
       - **learning**: Learning logs, categories, streaks
       - **projects**: Active projects, statuses, next_actions
       - **content**: Content pipeline, platforms, statuses
    3. Build context summary string
    4. Call OpenAI:
       ```
       System: You are Zelvi AI, the user's personal OS coach...
       Context: {summary}
       User: {message}
       ```
    5. Return response
    6. Optionally save to `ai_chat_sessions` + `ai_messages`

#### Chat History:
- Optional: Save conversations to DB
- `ai_chat_sessions`: One per conversation
- `ai_messages`: Messages in conversation
- Load previous sessions on drawer open

#### Integration Points:
- From Analytics: "Ask AI about this →" opens drawer with pre-filled question
- From Calendar: "Ask AI: What pattern..." opens with calendar context
- From Dashboard: Shortcut buttons

#### GA4 Events:
- `ai_chat_open`
- `ai_chat_message_sent`
- `ai_chat_shortcut_used`

---

### 6.3 Edge Functions Required

#### 6.3.1 `ai-coach` Function
**Path:** `supabase/functions/ai-coach/index.ts`

**Request:**
```typescript
POST /functions/v1/ai-coach
Headers: { Authorization: Bearer <access_token> }
Body: {
  mode: 'general' | 'job' | 'learning' | 'projects' | 'content',
  message: string,
  time_range?: number
}
```

**Response:**
```typescript
{
  success: boolean,
  data?: {
    response: string,
    session_id?: string
  },
  error?: string
}
```

**Implementation:**
- Extract user_id from JWT
- Fetch data based on mode
- Build context summary
- Call OpenAI API
- Return response
- Optionally save to DB

#### 6.3.2 `ai-weekly-summary` Function
**Path:** `supabase/functions/ai-weekly-summary/index.ts`

**Request:**
```typescript
POST /functions/v1/ai-weekly-summary
Headers: { Authorization: Bearer <access_token> }
Body: {
  week_start: string, // ISO date
  week_end: string,
  stats: object,
  review_text: {
    wins: string,
    challenges: string,
    avoided: string,
    next_focus: string
  },
  goals: array
}
```

**Response:**
```typescript
{
  success: boolean,
  data?: {
    summary: string,
    focus_points: string[]
  },
  error?: string
}
```

---

### 6.4 Phase 6 Deliverables

**Files to Create:**
```
src/
├── pages/
│   └── WeeklyReview.tsx               ✅ Weekly review page
├── components/
│   ├── review/
│   │   ├── WeekSelector.tsx           ✅ Week picker
│   │   ├── WeeklyStats.tsx             ✅ Stats card
│   │   ├── ReviewForm.tsx              ✅ Text areas
│   │   └── AISummary.tsx               ✅ AI summary display
│   └── ai/
│       ├── AICoachButton.tsx            ✅ Floating button
│       ├── AICoachDrawer.tsx           ✅ Drawer panel
│       ├── ChatMessage.tsx             ✅ Message bubble
│       ├── ShortcutButtons.tsx         ✅ Quick actions
│       └── ChatInput.tsx               ✅ Input area
└── hooks/
    ├── useWeeklyReview.ts              ✅ Review data hook
    ├── useWeeklyStats.ts               ✅ Stats aggregation
    └── useAICoach.ts                   ✅ Chat state & API
```

**Edge Functions:**
```
supabase/functions/
├── ai-coach/
│   └── index.ts                        ✅ AI coach function
└── ai-weekly-summary/
    └── index.ts                        ✅ Weekly summary function
```

**Updated Files:**
- `src/components/AppLayout.tsx` - Add AICoachButton
- `src/components/analytics/*` - Add "Ask AI" buttons
- `src/components/calendar/*` - Add AI integration

---

## Phase 7: Profile, Export, Delete, Guest Upgrade 👤

**Goal:** Complete account management and data controls.

### 7.1 Profile Page (`/app/profile`)

#### Components:
- `src/pages/Profile.tsx` - Main profile page
- `src/components/profile/ProfileInfo.tsx` - User info display/edit
- `src/components/profile/GuestUpgrade.tsx` - Guest mode panel
- `src/components/profile/DataControls.tsx` - Export/delete section
- `src/hooks/useUserProfile.ts` - Profile data hook

#### Features:

1. **Profile Info:**
   - Email (if full account) or "Guest session" badge
   - Name (editable, from `user_profiles`)
   - Created date
   - Plan: "Free" (hardcoded for now)

2. **Guest Mode Panel** (if `user.is_anonymous`):
   - Panel: "You're in Guest Mode"
   - Explanation text
   - Form:
     - Email (text input)
     - Password (password input)
     - Confirm password
   - Button: "Upgrade and migrate data"
   - Loading state
   - Success message

3. **Data Controls:**
   - **Export:**
     - Button: "Export all my data"
     - Loading state
     - Triggers download of JSON file
   - **Delete:**
     - Danger zone card (red border)
     - Text: "Permanently delete my account & all data"
     - Confirmation input: Type "DELETE" to confirm
     - Button: "Delete account" (disabled until confirmed)
     - Final confirmation modal

4. **Logout:**
   - Button: "Log out"
   - Signs out and redirects to `/`

#### Data Operations:
- `useUserProfile()` hook:
  - Query key: `['user-profile', user.id]`
  - Fetches `user_profiles` row
- Mutations:
  - `updateProfile()` - Update name
  - `upgradeGuest()` - Call Edge Function
  - `exportData()` - Call Edge Function, download file
  - `deleteAccount()` - Call Edge Function, logout, redirect

---

### 7.2 Edge Functions Required

#### 7.2.1 `export-data` Function
**Path:** `supabase/functions/export-data/index.ts`

**Request:**
```typescript
POST /functions/v1/export-data
Headers: { Authorization: Bearer <access_token> }
```

**Response:**
```typescript
{
  success: boolean,
  data?: {
    export: {
      user_id: string,
      exported_at: string,
      jobs: array,
      recruiters: array,
      learning_logs: array,
      projects: array,
      content_posts: array,
      daily_custom_tasks: array,
      daily_task_status: array,
      goals: array,
      weekly_reviews: array,
      notes: array,
      activity_log: array,
      ai_chat_sessions: array,
      ai_messages: array
    }
  },
  error?: string
}
```

**Implementation:**
- Extract user_id from JWT
- Query all tables for that user
- Build JSON object
- Return as JSON (frontend handles download)

#### 7.2.2 `delete-account` Function
**Path:** `supabase/functions/delete-account/index.ts`

**Request:**
```typescript
POST /functions/v1/delete-account
Headers: { Authorization: Bearer <access_token> }
Body: {
  confirm: "DELETE" // required
}
```

**Response:**
```typescript
{
  success: boolean,
  error?: string
}
```

**Implementation:**
- Extract user_id from JWT
- Validate confirm = "DELETE"
- In transaction:
  - Delete all rows from user tables (or rely on CASCADE)
  - Call `supabase.auth.admin.deleteUser(user_id)`
- Return success

#### 7.2.3 `upgrade-guest` Function
**Path:** `supabase/functions/upgrade-guest/index.ts`

**Request:**
```typescript
POST /functions/v1/upgrade-guest
Headers: { Authorization: Bearer <access_token> }
Body: {
  email: string,
  password: string
}
```

**Response:**
```typescript
{
  success: boolean,
  data?: {
    new_user_id: string,
    session?: object
  },
  error?: string
}
```

**Implementation:**
- Extract guest_user_id from JWT
- Validate email/password
- Using service role:
  1. Create new auth user: `supabase.auth.admin.createUser({ email, password })`
  2. Get new_user_id
  3. For each table: `UPDATE SET user_id = new_user_id WHERE user_id = guest_user_id`
  4. Optionally delete guest user
- Return new_user_id
- Frontend: Sign in as new user (or use returned session if possible)

---

### 7.3 Phase 7 Deliverables

**Files to Create:**
```
src/
├── pages/
│   └── Profile.tsx                    ✅ Profile page
├── components/
│   └── profile/
│       ├── ProfileInfo.tsx            ✅ User info
│       ├── GuestUpgrade.tsx           ✅ Upgrade panel
│       └── DataControls.tsx            ✅ Export/delete
└── hooks/
    └── useUserProfile.ts              ✅ Profile data hook
```

**Edge Functions:**
```
supabase/functions/
├── export-data/
│   └── index.ts                       ✅ Export function
├── delete-account/
│   └── index.ts                       ✅ Delete function
└── upgrade-guest/
    └── index.ts                       ✅ Upgrade function
```

**Updated Files:**
- `src/components/AppLayout.tsx` - Update logout to use signOut from context

---

## Phase 8: Realtime + PWA Polish 🔄

**Goal:** Add real-time sync and PWA capabilities.

### 8.1 Realtime Provider

#### Components:
- `src/contexts/RealtimeProvider.tsx` - Global realtime subscription manager
- `src/hooks/useRealtime.ts` - Realtime utilities

#### Features:

1. **RealtimeProvider:**
   - Wraps app (inside AuthProvider)
   - Subscribes to Supabase Realtime channels for all key tables:
     - `jobs`
     - `recruiters`
     - `learning_logs`
     - `projects`
     - `content_posts`
     - `daily_custom_tasks`
     - `daily_task_status`
     - `goals`
     - `weekly_reviews`
     - `notes`
     - `activity_log`
   - Filters by `user_id = current user.id`
   - On `INSERT / UPDATE / DELETE`:
     - Determines affected query keys
     - Calls `queryClient.invalidateQueries([...])`
     - UI updates automatically

2. **Query Invalidation Mapping:**
   - `jobs` changes → `['jobs', user.id]`, `['daily-summary', user.id, today]`
   - `learning_logs` changes → `['learning', user.id]`, `['daily-tasks', user.id, today]`, `['daily-summary', user.id, today]`
   - `daily_task_status` changes → `['daily-tasks', user.id, today]`, `['daily-summary', user.id, today]`
   - etc.

3. **Reconnection Handling:**
   - Auto-reconnect on disconnect
   - Re-subscribe on user change (guest → full account)

#### Implementation:
```typescript
// RealtimeProvider.tsx
export function RealtimeProvider({ children }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('user-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        // Invalidate relevant queries based on table
        const table = payload.table
        const event = payload.eventType
        
        if (table === 'jobs') {
          queryClient.invalidateQueries(['jobs', user.id])
          queryClient.invalidateQueries(['daily-summary', user.id])
        }
        // ... etc for all tables
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, queryClient])

  return <>{children}</>
}
```

---

### 8.2 PWA Setup

#### Files to Create:

1. **`public/manifest.webmanifest`:**
```json
{
  "name": "Zelvi AI",
  "short_name": "Zelvi",
  "description": "Your AI-powered operating system for 2026",
  "start_url": "/app",
  "display": "standalone",
  "background_color": "#111827",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

2. **`public/sw.js` (Service Worker):**
   - Cache shell (HTML, JS, CSS)
   - Cache last known data (dashboard, notes, analytics summary)
   - Offline detection
   - Show "Offline" banner
   - Queue writes when offline (optional)

3. **`src/lib/pwa.ts`:**
   - Service worker registration
   - Install prompt handling
   - Offline detection

#### Features:

1. **Service Worker:**
   - Cache strategy:
     - Shell: Cache-first (HTML, JS, CSS)
     - API: Network-first, fallback to cache
     - Images: Cache-first
   - Offline page (optional)
   - Update notification

2. **Install Prompt:**
   - Detect installability
   - Show custom install prompt
   - Track: `pwa_install_prompt_shown`, `pwa_installed`

3. **Offline Banner:**
   - Show when offline
   - Disable write operations (or queue them)
   - Re-enable when back online

4. **Icons:**
   - Generate icons: 192x192, 512x512
   - Place in `public/` directory

---

### 8.3 Mobile UI Polish

#### Responsive Improvements:

1. **Sidebar:**
   - Desktop: Fixed left sidebar
   - Mobile: Drawer/overlay (hamburger menu)

2. **Navigation:**
   - Desktop: Sidebar
   - Mobile: Bottom tab bar (key pages only) or drawer

3. **Forms:**
   - Mobile-friendly inputs
   - Date pickers work on mobile
   - Touch targets ≥ 44px

4. **Charts:**
   - Responsive containers
   - Touch-friendly on mobile

5. **AI Coach Drawer:**
   - Full-width on mobile
   - Swipe to close

---

### 8.4 Phase 8 Deliverables

**Files to Create:**
```
src/
├── contexts/
│   └── RealtimeProvider.tsx          ✅ Realtime subscriptions
└── lib/
    └── pwa.ts                         ✅ PWA utilities

public/
├── manifest.webmanifest               ✅ PWA manifest
├── sw.js                              ✅ Service worker
├── icon-192.png                       ✅ App icon 192x192
└── icon-512.png                       ✅ App icon 512x512
```

**Updated Files:**
- `src/App.tsx` - Wrap with RealtimeProvider
- `index.html` - Add manifest link, service worker registration
- `src/components/AppLayout.tsx` - Mobile responsive sidebar
- All pages - Mobile responsive improvements

---

## Summary: All Phases Overview

| Phase | Focus | Key Deliverables | Status |
|-------|-------|------------------|--------|
| **Phase 1** | Foundation | Setup, Auth, Routing, Basic Pages | ✅ Complete |
| **Phase 2** | Learning + Dashboard MVP | Learning CRUD, Dashboard with tasks & timeline | ✅ Complete |
| **Phase 3** | Jobs + Recruiters | Job & recruiter CRM, dashboard integration | ✅ Complete |
| **Phase 4** | Projects + Content | Project management, content planning, task generation | ✅ Complete |
| **Phase 5** | Goals + Analytics + Calendar | Goal tracking, charts, calendar view | ✅ Complete |
| **Phase 6** | Weekly Review + AI Coach | Reflection, AI summaries, chat interface | ✅ Complete |
| **Phase 7** | Profile + Data Controls | Export, delete, guest upgrade, Edge Functions | ✅ Complete |
| **Phase 8** | Realtime + PWA | Real-time sync, offline support, mobile polish | ✅ Complete |

---

## Implementation Notes

### Database Setup
- All table schemas provided in `Starterguide.md`
- Run migrations in Supabase SQL editor
- Enable Realtime on all tables (Supabase dashboard)

### Environment Variables
- Required in `.env`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GA4_MEASUREMENT_ID`
  - `VITE_OPENAI_API_KEY` (for Phase 6)

### Testing Strategy
- Test each phase before moving to next
- Verify realtime updates work across tabs/devices
- Test offline functionality (Phase 8)
- Test guest → full account upgrade flow

### Performance Considerations
- Use React Query caching effectively
- Optimize queries with proper indexes (already in schemas)
- Lazy load charts (Recharts) on Analytics page
- Debounce search/filter inputs

---

**Last Updated:** December 23, 2025
**Next Phase:** All phases complete! 🎉

---

## Phase 2 Completion

✅ **Phase 2 Complete** - See `PHASE2_COMPLETE.md` for full documentation.

**Key Achievements:**
- Learning logs CRUD page fully functional
- Dashboard with summary bar, action list, and timeline
- Task generation from learning logs
- Activity logging system
- Complete integration between learning and dashboard

**Files Created:** 15 new files
**Files Updated:** 3 existing files

---

## Phase 3 Completion

✅ **Phase 3 Complete** - See `PHASE3_COMPLETE.md` for full documentation.

**Key Achievements:**
- Jobs page with full CRUD operations and filtering
- Recruiters page with full CRUD operations and filtering
- Dashboard integration (summary bar and timeline)
- Activity logging for jobs and recruiters
- Status tracking for job funnel and recruiter pipeline

**Files Created:** 10 new files
**Files Updated:** 2 existing files

---

## Phase 4 Completion

✅ **Phase 4 Complete** - See `PHASE4_COMPLETE.md` for full documentation.

**Key Achievements:**
- Projects page with full CRUD operations and filtering
- Content Planner page with full CRUD operations and filtering
- Task generation from projects (next actions) and content (due dates)
- Dashboard integration (summary bar, action list, and timeline)
- Activity logging for projects and content
- Status tracking for project workflow and content pipeline

**Files Created:** 10 new files
**Files Updated:** 4 existing files

---

## Phase 5 Completion

✅ **Phase 5 Complete** - See `PHASE5_COMPLETE.md` for full documentation.

**Key Achievements:**
- Goals page with full CRUD operations and progress tracking
- Analytics page with 6 comprehensive chart visualizations
- Calendar page with month grid and day detail panel
- Progress calculation for all goal types
- Data aggregation across all major tables
- Dashboard integration (goals snapshot in summary bar)
- Activity visualization in calendar view

**Files Created:** 19 new files
**Files Updated:** 2 existing files

---

## Phase 6 Completion

✅ **Phase 6 Complete** - See `PHASE6_COMPLETE.md` for full documentation.

**Key Achievements:**
- Weekly Review page with week selector, stats aggregation, and reflection form
- AI-powered weekly summary generation with narrative and focus points
- Global AI Coach interface with floating button and slide-out drawer
- Mode-specific AI coaching (General, Job, Learning, Projects, Content)
- Shortcut buttons for quick AI interactions
- Edge functions for AI integration (ai-coach, ai-weekly-summary)
- Complete integration with existing data and activity logging

**Files Created:** 13 new files
**Files Updated:** 2 existing files

**Note:** Edge functions need to be deployed separately to Supabase for AI features to work.

---

## Phase 7 Completion

✅ **Phase 7 Complete** - See `PHASE7_COMPLETE.md` for full documentation.

**Key Achievements:**
- Profile page with user information display and editing
- Guest mode upgrade functionality with automatic data migration
- Complete data export as JSON file
- Account deletion with confirmation safeguards
- Three Edge Functions for backend operations (export-data, delete-account, upgrade-guest)
- Full integration with existing authentication system

**Files Created:** 8 new files
**Files Updated:** 1 existing file

**Note:** Edge functions need to be deployed separately to Supabase for profile features to work.

---

## Phase 8 Completion

✅ **Phase 8 Complete** - See `PHASE8_COMPLETE.md` for full documentation.

**Key Achievements:**
- RealtimeProvider context for automatic data synchronization across tabs/devices
- PWA manifest and service worker for offline support
- Mobile-responsive sidebar with drawer navigation
- Touch-friendly UI with proper minimum touch targets (44px)
- Automatic React Query cache invalidation on realtime updates
- PWA utilities for install prompts and offline detection

**Files Created:** 5 new files
**Files Updated:** 4 existing files

**Note:** 
- PWA icons (192x192 and 512x512) need to be created and placed in `public/` directory
- Realtime must be enabled on all tables in Supabase dashboard for realtime features to work

