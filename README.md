# Zelvi AI

**Your AI-powered operating system for 2026**

Zelvi AI is a comprehensive personal productivity platform that unifies job search, recruiter management, learning tracking, project management, content planning, goals, analytics, calendar, and an AI coach that knows your data.

**Domain:** `https://zelvi.pp`  
**Tagline:** *Your AI-powered operating system for 2026.*

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Edge Functions](#edge-functions)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Contributing](#contributing)

---

## 🎯 Overview

Zelvi AI is built on three core pillars:

1. **Execution** – Daily Command Center with a rolling action list
2. **Clarity** – Analytics, goals, weekly reviews, calendar & timeline
3. **Guidance** – AI Coach with deep modes that use your real data

The application provides:
- **Public marketing pages** (SEO-friendly) on `https://zelvi.pp`
- **Authenticated app pages** at `https://zelvi.pp/app`

---

## ✨ Features

### Core Modules

#### 1. **Jobs Tracker** ✅
- Application status tracking (applied, screener, tech, offer, rejected, saved)
- Job form with all fields (role, company, location, type, salary, source, status, date, URL, notes)
- Job list with filtering (status, source, date range)
- CRUD operations fully functional
- Activity log integration
- Dashboard integration

#### 2. **Recruiters Network** ✅
- Contact management (name, company, platform, role, status, notes)
- Interaction history (last_contact_date field tracks when you last contacted)
- Status tracking (messaged, replied, call, submitted, ghosted)
- Filtering by status and platform
- CRUD operations fully functional

#### 3. **Learning Hub** ✅
- Course tracking (topic, category, date, minutes, resource, takeaways)
- Progress monitoring (minutes tracked, category breakdown, monthly stats)
- Category-based organization (DE, AI/ML, GenAI, RAG, System Design, Interview Prep, Other)
- CRUD operations fully functional
- Dashboard integration

#### 4. **Projects Manager** ✅
- Project timelines (started_at, completed_at dates)
- Milestone tracking (next_action field for next steps)
- Project status (planning, building, polishing, done, archived)
- Priority levels (high, medium, low)
- GitHub and live URL tracking
- CRUD operations fully functional

#### 5. **Content Creator** ✅
- Content calendar (date field for scheduling)
- Publishing schedule (status: idea, draft, assets_ready, scheduled, published)
- Platform tracking (Instagram, YouTube, LinkedIn, Medium, Pinterest, Other)
- Content type tracking (post, reel, short, story, article, pin)
- CRUD operations fully functional

#### 6. **Goals & Analytics** ✅
- Goal setting & tracking (job_applications, recruiter_contacts, learning_minutes, content_posts, projects_completed)
- Performance analytics (comprehensive analytics dashboard with charts)
- Weekly reviews (with AI-generated summaries)
- Goal progress calculation
- CRUD operations fully functional

#### 7. **AI Coach** ✅
- Personalized recommendations (AI analyzes user's actual data)
- Weekly review insights (AI-generated summaries and focus points)
- Real-time chat support (AI chat interface with context-aware responses)
- Pattern recognition (AI identifies patterns in activities)
- Multiple modes (general, job, learning, projects, content)
- Edge function integration with OpenAI

#### 8. **Calendar & Timeline** ✅
- Calendar view of all activities
- Daily timeline view
- Filtering by activity type
- Date-based navigation

#### 9. **Weekly Review** ✅
- Manual reflection (wins, challenges, avoided, next focus)
- AI-generated summaries
- AI focus points
- Week-over-week tracking

#### 10. **Notes** ✅
- Rich text notes
- AI-powered transcription
- AI chat integration
- Autosave functionality

#### 11. **Profile & Settings** ✅
- User profile management
- Data export (PDF)
- Account deletion
- Guest account upgrade
- Settings (timezone, week start, analytics opt-in, AI opt-in)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **TanStack Query (React Query)** - Data fetching and caching
- **Tailwind CSS 4** - Utility-first CSS framework
- **Recharts** - Chart library for analytics
- **jsPDF** - PDF generation for data export
- **React Icons** - Icon library

### Backend & Infrastructure
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email/password + anonymous guest accounts)
  - Realtime subscriptions
  - Row Level Security (RLS)
  - Edge Functions (serverless)
- **OpenAI API** - AI Coach integration (GPT-4o-mini)

### Development Tools
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **Testing Library** - Component testing utilities
- **TypeScript** - Static type checking

### PWA & Analytics
- **Service Worker** - Offline support
- **Web App Manifest** - Installable PWA
- **Google Analytics 4 (GA4)** - Analytics tracking

---

## 📁 Project Structure

```
zelvi-ai/
├── public/                    # Static assets
│   ├── manifest.webmanifest   # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── favicon.ico
│   ├── logo.png
│   └── ...
├── src/
│   ├── components/            # React components
│   │   ├── ai/                # AI Coach components
│   │   ├── analytics/         # Analytics components
│   │   ├── calendar/           # Calendar components
│   │   ├── content/           # Content components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── goals/             # Goals components
│   │   ├── jobs/              # Jobs components
│   │   ├── learning/          # Learning components
│   │   ├── notes/             # Notes components
│   │   ├── profile/           # Profile components
│   │   ├── projects/          # Projects components
│   │   ├── recruiters/        # Recruiters components
│   │   ├── review/            # Weekly review components
│   │   ├── ui/                # Reusable UI components
│   │   ├── AppLayout.tsx      # Main app layout with sidebar
│   │   └── Footer.tsx         # Footer component
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx    # Authentication context
│   │   ├── RealtimeProvider.tsx  # Realtime subscriptions
│   │   └── ThemeContext.tsx   # Theme context
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAICoach.ts      # AI Coach hook
│   │   ├── useAnalytics.ts    # Analytics hook
│   │   ├── useCalendarData.ts # Calendar data hook
│   │   ├── useContent.ts      # Content hook
│   │   ├── useDailySummary.ts # Daily summary hook
│   │   ├── useDailyTasks.ts   # Daily tasks hook
│   │   ├── useGoalProgress.ts # Goal progress hook
│   │   ├── useGoals.ts        # Goals hook
│   │   ├── useJobs.ts         # Jobs hook
│   │   ├── useLearning.ts     # Learning hook
│   │   ├── useNotes.ts        # Notes hook
│   │   ├── useProjects.ts     # Projects hook
│   │   ├── useRecruiters.ts   # Recruiters hook
│   │   ├── useRealtime.ts     # Realtime hook
│   │   ├── useTodayTimeline.ts # Today timeline hook
│   │   ├── useUserProfile.ts  # User profile hook
│   │   ├── useWeeklyReview.ts # Weekly review hook
│   │   └── useWeeklyStats.ts  # Weekly stats hook
│   ├── lib/                   # Utility libraries
│   │   ├── activityLog.ts     # Activity logging
│   │   ├── analytics.ts       # Analytics utilities
│   │   ├── dateUtils.ts       # Date utilities
│   │   ├── ga4.ts             # GA4 initialization
│   │   ├── logger.ts          # Logging utilities
│   │   ├── pdfExport.ts       # PDF export
│   │   ├── pwa.ts             # PWA utilities
│   │   └── supabase.ts        # Supabase client
│   ├── pages/                 # Page components
│   │   ├── About.tsx
│   │   ├── Analytics.tsx
│   │   ├── Auth.tsx
│   │   ├── Calendar.tsx
│   │   ├── Comparison.tsx
│   │   ├── Content.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Documentation.tsx
│   │   ├── Goals.tsx
│   │   ├── Jobs.tsx
│   │   ├── Landing.tsx
│   │   ├── Learning.tsx
│   │   ├── Notes.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── Profile.tsx
│   │   ├── Projects.tsx
│   │   ├── Recruiters.tsx
│   │   ├── Support.tsx
│   │   ├── TermsOfService.tsx
│   │   └── WeeklyReview.tsx
│   ├── test/                  # Test utilities
│   │   └── setup.ts
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── supabase/
│   ├── functions/              # Edge Functions
│   │   ├── _shared/           # Shared utilities
│   │   │   ├── cors.ts        # CORS utilities
│   │   │   └── rateLimit.ts   # Rate limiting
│   │   ├── ai-coach/          # AI Coach function
│   │   ├── ai-notes/          # AI Notes function
│   │   ├── ai-weekly-summary/ # Weekly summary function
│   │   ├── delete-account/    # Account deletion function
│   │   ├── export-data/       # Data export function
│   │   └── upgrade-guest/     # Guest upgrade function
│   ├── migrations/            # Database migrations
│   │   ├── fix_schema_constraints.sql
│   │   └── verify_schema.sql
│   └── schema.sql             # Complete database schema
├── e2e/                       # E2E tests
│   └── critical-flows.spec.ts
├── dist/                      # Build output
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── tailwind.config.js         # Tailwind config
├── playwright.config.ts       # Playwright config
├── vitest.config.ts           # Vitest config
└── deploy-functions.sh        # Edge functions deployment script
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **pnpm** (package manager)
- **Supabase account** - For backend services
- **OpenAI API key** - For AI features (optional, app works without it)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd zelvi-ai
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GA4_MEASUREMENT_ID=your_ga4_measurement_id
VITE_OPENAI_API_KEY=your_openai_api_key  # Optional
```

4. **Set up Supabase database**

Run the schema in `supabase/schema.sql` in your Supabase SQL editor:
- Go to Supabase Dashboard → SQL Editor
- Copy and paste the contents of `supabase/schema.sql`
- Execute the script

5. **Enable Realtime**

In Supabase Dashboard:
- Go to Database → Replication
- Enable replication for all tables:
  - `jobs`
  - `recruiters`
  - `learning_logs`
  - `projects`
  - `content_posts`
  - `goals`
  - `weekly_reviews`
  - `daily_custom_tasks`
  - `daily_task_status`
  - `notes`
  - `ai_chat_sessions`
  - `ai_messages`

6. **Deploy Edge Functions** (Optional, for AI features)

```bash
# Link your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
./deploy-functions.sh

# Or deploy individually
supabase functions deploy ai-coach
supabase functions deploy ai-weekly-summary
supabase functions deploy ai-notes
supabase functions deploy export-data
supabase functions deploy delete-account
supabase functions deploy upgrade-guest
```

**Set Edge Function secrets in Supabase Dashboard:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins (e.g., `https://zelvi.pp,http://localhost:5173`)

### Development

```bash
# Start development server
npm run dev
# or
pnpm dev

# The app will be available at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

---

## 🗄️ Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

### Core Tables

- **`user_profiles`** - User profile information
- **`jobs`** - Job applications tracking
- **`recruiters`** - Recruiter contacts
- **`learning_logs`** - Learning activity logs
- **`projects`** - Project management
- **`content_posts`** - Content planning and tracking
- **`goals`** - Goal setting and tracking
- **`weekly_reviews`** - Weekly reflection and reviews
- **`daily_custom_tasks`** - Custom daily tasks
- **`daily_task_status`** - Daily task completion tracking
- **`notes`** - User notes
- **`activity_log`** - Activity logging for analytics
- **`user_settings`** - User preferences and settings
- **`ai_chat_sessions`** - AI chat session metadata
- **`ai_messages`** - AI chat messages

### Security

All tables use **Row Level Security (RLS)** policies to ensure users can only access their own data. The schema includes:
- Foreign key constraints
- Check constraints for data validation
- Indexes for performance
- Triggers for automatic timestamp updates

See `supabase/schema.sql` for the complete schema definition.

---

## ⚡ Edge Functions

The application uses Supabase Edge Functions for serverless operations:

### 1. **ai-coach**
- **Purpose**: AI-powered chat assistant with context-aware responses
- **Rate Limit**: 20 requests/minute per user
- **Modes**: general, job, learning, projects, content
- **Features**: 
  - Analyzes user's actual data
  - Provides personalized recommendations
  - Pattern recognition

### 2. **ai-weekly-summary**
- **Purpose**: Generate AI-powered weekly summaries
- **Rate Limit**: 5 requests/minute per user
- **Features**:
  - Analyzes week's activities
  - Generates summary and focus points
  - Integrates with weekly reviews

### 3. **ai-notes**
- **Purpose**: AI-powered notes with transcription and chat
- **Rate Limit**: 30 requests/minute per user
- **Features**:
  - Audio transcription
  - AI chat for notes
  - Context-aware responses

### 4. **export-data**
- **Purpose**: Export all user data as JSON
- **Features**:
  - Exports all user tables
  - Returns structured JSON
  - Used for data portability

### 5. **delete-account**
- **Purpose**: Permanently delete user account and all data
- **Features**:
  - Deletes all user data
  - Removes auth user
  - GDPR compliant

### 6. **upgrade-guest**
- **Purpose**: Upgrade anonymous guest account to full account
- **Features**:
  - Creates new auth user with email/password
  - Migrates all guest data to new account
  - Deletes guest account

All functions include:
- CORS support with origin restrictions
- Rate limiting
- JWT authentication
- Error handling

See `supabase/functions/` for implementation details.

---

## 💻 Development

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Code linting (if configured)
- **Prettier** - Code formatting (if configured)

### Key Patterns

1. **Data Fetching**: Use TanStack Query hooks
2. **State Management**: React Context API for global state
3. **Realtime Updates**: Supabase Realtime via `RealtimeProvider`
4. **Error Handling**: Error boundaries and try-catch blocks
5. **Logging**: Use `logger` utility from `src/lib/logger.ts`

### Adding New Features

1. Create component in appropriate directory under `src/components/`
2. Create hook in `src/hooks/` if needed
3. Add route in `src/App.tsx` if it's a new page
4. Update navigation in `src/components/AppLayout.tsx`
5. Add database table in `supabase/schema.sql` if needed
6. Create Edge Function if serverless logic is required

---

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm test
# or
pnpm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e
# or
pnpm test:e2e
```

E2E tests are located in `e2e/critical-flows.spec.ts` and test:
- Authentication flows
- Core feature interactions
- Critical user journeys

---

## 🚢 Deployment

### Frontend Deployment

1. **Build the application**
```bash
npm run build
```

2. **Deploy `dist/` folder** to your hosting provider:
   - Vercel
   - Netlify
   - Cloudflare Pages
   - Any static hosting service

3. **Set environment variables** in your hosting provider:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GA4_MEASUREMENT_ID`
   - `VITE_OPENAI_API_KEY` (optional)

### Edge Functions Deployment

1. **Link Supabase project**
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

2. **Deploy functions**
```bash
./deploy-functions.sh
```

3. **Set secrets** in Supabase Dashboard:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ALLOWED_ORIGINS`

### Production Checklist

- [ ] Environment variables set
- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Realtime enabled for all tables
- [ ] Edge functions deployed
- [ ] Edge function secrets configured
- [ ] GA4 tracking configured
- [ ] PWA manifest configured
- [ ] Service worker registered
- [ ] CORS configured correctly
- [ ] Rate limiting configured

---

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────┐
│         React Application            │
├─────────────────────────────────────┤
│  Contexts (Auth, Theme, Realtime)   │
├─────────────────────────────────────┤
│  TanStack Query (Data Fetching)     │
├─────────────────────────────────────┤
│  React Router (Navigation)           │
├─────────────────────────────────────┤
│  Components (UI Layer)               │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│      Supabase Client (SDK)          │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│      Supabase Backend               │
│  - PostgreSQL Database              │
│  - Authentication                   │
│  - Realtime                         │
│  - Edge Functions                   │
└─────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Component
2. **Component** → Custom Hook (e.g., `useJobs`)
3. **Hook** → TanStack Query mutation/query
4. **TanStack Query** → Supabase Client
5. **Supabase** → Database/Edge Function
6. **Realtime** → Updates propagated back
7. **TanStack Query** → Cache invalidation
8. **Component** → Re-render with new data

### Realtime Architecture

- `RealtimeProvider` subscribes to Supabase Realtime channels
- On database changes (INSERT/UPDATE/DELETE):
  - Realtime event received
  - TanStack Query cache invalidated
  - Components re-fetch data
  - UI updates automatically

---

## 📚 Key Documentation Files

- **`Starterguide.md`** - Original project specification and architecture
- **`DEPLOYMENT_GUIDE.md`** - Edge functions deployment guide
- **`DEPLOYMENT_STEPS.md`** - Step-by-step deployment instructions
- **`SETUP_OPENAI.md`** - OpenAI API setup guide
- **`FEATURE_AUDIT_REPORT.md`** - Feature implementation status
- **`COMPLIANCE_CHECK_REPORT.md`** - Compliance with specifications
- **`PHASE*_COMPLETE.md`** - Phase completion documentation

---

## 🔐 Security

- **Row Level Security (RLS)** - All tables protected
- **JWT Authentication** - Secure token-based auth
- **CORS Restrictions** - Edge functions restricted to allowed origins
- **Rate Limiting** - Prevents abuse of AI features
- **Input Validation** - Database constraints and TypeScript types
- **Environment Variables** - Sensitive data not in code

---

## 🎨 Design System

### Colors

- **Primary**: `#00d9ff` (Cyan)
- **Accent**: `#ff3300` (Red/Orange)
- **Background**: `#09090b` (Obsidian)
- **Surface**: `#18181b` (Charcoal)

### Typography

- **Sans**: Space Grotesk
- **Serif**: Newsreader
- **Mono**: JetBrains Mono

### Theme

- Dark mode only
- Modern, minimal design
- Glassmorphism effects
- Smooth animations

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Follow existing code style
- Keep commits atomic and descriptive

---

## 📄 License

[Add your license here]

---

## 🆘 Support

For support, email [your-email] or visit [your-support-page].

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Supabase](https://supabase.com/)
- AI powered by [OpenAI](https://openai.com/)

---

**Made with ❤️ by the Zelvi AI team**
