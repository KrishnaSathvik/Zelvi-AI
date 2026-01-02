# 🧱 Architecture Blueprints

Universal architecture patterns for common project types.

## 1️⃣ React SPA + API Backend

**Use for:** Dashboards, subscription apps, admin panels, tools.

**High-Level:**
- Frontend: React (Vite/Next) SPA
- Backend: REST/GraphQL (Node/Express or FastAPI)
- DB: PostgreSQL / MongoDB / Firestore / Supabase

**Flow:** Browser → React SPA → API → DB/Services → Response → React state/UI

**Folder Structure:**
```
project-root/
  frontend/
    src/
      components/
      pages/          # routes (Dashboard, Visualize, Settings...)
      features/       # domain slices (subscriptions, analytics, auth)
      hooks/
      lib/            # API client, utils
      store/          # Zustand/Redux
      styles/
  backend/
    src/
      routes/         # REST endpoints
      controllers/
      services/       # business logic
      models/         # DB models / ORM
      middlewares/
      lib/            # config, utils
    tests/
  infra/
    docker/
    k8s/
    scripts/
```

## 2️⃣ React + Supabase Fullstack

**Use for:** Quick SaaS, dashboards, auth + Postgres without custom backend.

**High-Level:**
- Frontend: React SPA
- Backend: Supabase (Auth, Postgres, Storage, Functions)
- React talks directly to Supabase client SDK

**Flow:** React → Supabase client → Auth / Row-level DB queries / Edge Functions

**Folder Structure:**
```
project-root/
  src/
    components/
    pages/
    features/
      auth/
        AuthProvider.tsx
        useAuth.ts
      subscriptions/
        api.ts        # Supabase queries (RPC, select, upsert)
        hooks.ts
        ui/
    lib/
      supabaseClient.ts
  supabase/
    migrations/
    functions/        # edge functions for complex logic
    seed/
```

**Key Ideas:**
- Keep all Supabase queries in `features/*/api.ts` (one place).
- Use Row-Level Security + policies, not custom auth logic in React.

## 3️⃣ React + Firebase

**Use for:** Trailverse-style apps, push notifications, real-time data, guest mode.

**High-Level:**
- React SPA/PWA
- Firebase: Auth, Firestore, Storage, Cloud Functions, FCM
- Optional: local Dexie for guest mode → sync later

**Flow:**
- Guest: React → Dexie (local) → Later: Dexie → Firestore (migration)
- Logged In: React → Auth → Firestore / Functions / FCM

**Folder Structure:**
```
project-root/
  src/
    firebase/
      firebaseApp.ts
      auth.ts
      firestore.ts
      storage.ts
      messaging.ts
    context/
      AuthContext.tsx
      ToastContext.tsx
      NotificationContext.tsx
    features/
      subscriptions/
        hooks.ts
        firestoreApi.ts
        dexieStore.ts
      parks/
      blog/
      reviews/
    components/
    pages/
    hooks/
    utils/
  functions/          # Firebase Cloud Functions
    src/
      api/
      jobs/
      notifications/
```

**Patterns:**
- All Firestore logic per feature → `features/x/firestoreApi.ts`
- All guest/local logic → `features/x/dexieStore.ts`
- Cloud Functions for: Heavy aggregation, Scheduled jobs, Push notifications

## 4️⃣ Node.js / Express Backend

**Use for:** APIs for React apps, webhook handlers, business logic.

**High-Level:** Client → /api/... → Express → Controllers → Services → DB/External APIs

**Folder Structure:**
```
backend/
  src/
    index.ts            # app bootstrap
    config/             # env, db config
    routes/             # route definitions
      subscriptions.ts
      auth.ts
      analytics.ts
    controllers/        # HTTP layer
      subscriptionsController.ts
    services/           # business logic
      subscriptionsService.ts
    models/             # ORM models (Prisma/Sequelize/Mongoose)
    middlewares/        # auth, logging, validation
    lib/                # helpers, logger, http client
  tests/
```

**Rules:**
- Controllers → no business logic, just req/res.
- Services → pure domain logic.
- Models → DB only.

## 5️⃣ FastAPI Backend (Great for AI / ML / RAG)

**Use for:** AI endpoints, RAG, embeddings, model-serving.

**High-Level:** Client → /api/* → FastAPI → Routers → Services → Models / Vector DB / LLM

**Folder Structure:**
```
backend/
  app/
    main.py
    api/
      v1/
        routes/
          resume.py
          subscriptions.py
        deps.py
    core/
      config.py
      security.py
    models/
      db_models.py
      pydantic_schemas.py
    services/
      resume_service.py
      subscriptions_service.py
      rag_service.py
    llm/
      openai_client.py
      prompts/
        resume_prompt.txt
        de_framework.txt
        ai_ml_framework.txt
    db/
      session.py
      base.py
```

**Patterns:**
- All LLM/RAG logic in `services/` + `llm/`, never in routes.
- Prompts and frameworks as flat text/Markdown files in `llm/prompts/`.

## 6️⃣ Monorepo (Turbo/pnpm)

**Use for:** Multi-app systems (web, admin, API, worker).

**High-Level:**
- `apps/` → user-facing apps (web, admin, api, worker)
- `packages/` → shared libs (ui, config, types, data, prompts)

**Folder Structure:**
```
.
  apps/
    web/           # React SPA
    admin/         # admin panel
    api/           # Node/Express or FastAPI (via wrapper)
    worker/        # cron jobs, queues
  packages/
    ui/            # shared components
    config/        # eslint, tsconfig, tailwind, env schemas
    types/         # shared TS types
    data/          # shared constants, enums
    prompts/       # shared LLM prompts + frameworks
  turbo.json
  package.json
  pnpm-workspace.yaml
```

**Guidelines:**
- No cross-app deep imports — only via `packages/*`.
- Put DE/AI/GenAI frameworks & RAG specs in `packages/prompts/` for reuse.

## 7️⃣ AI Agent / RAG Backend

**Use for:** Resume optimization RAG bot, AI insights, AI coach.

**High-Level:**
- API Layer: /api/generate-resume, /api/analyze-subscriptions
- Orchestration Layer: reads frameworks, builds prompt, calls LLM
- Vector / Context Layer: embeddings, similar docs
- Storage: Postgres/Firestore/Supabase for logs, user configs

**Folder Structure:**
```
backend/
  src/
    api/
      routes/
        resume.ts        # /api/resume/generate
        subs_insights.ts # /api/subscriptions/ai-insights
    core/
      config.ts
      logging.ts
    llm/
      client.ts          # OpenAI/Anthropic wrapper
      prompt_builder/
        index.ts
        schemas/
          resume_schema.json
          subs_insights_schema.json
    rag/
      vector_client.ts   # Pinecone/PGVector/Chroma/etc
      retrievers/
        resume_retriever.ts
        subs_retriever.ts
    data/
      frameworks/
        de_framework.md
        ai_ml_framework.md
        genai_framework.md
        resume_rules.md
        ats_checklist.md
```

**Flow (example: Resume Bot):**
1. Client uploads JD + selects mode (DE / AI/ML)
2. API → `resume_service.generate()`
3. `generate()` →
   - Loads correct framework MD files
   - Builds structured system prompt + schema
   - Optionally retrieves past resumes/snippets via vector DB
   - Calls `llm.client` with JSON schema
4. Returns structured summary, experience, skills

## 8️⃣ Analytics + Events + AI Insights

**Use for:** Tracking events to power analytics dashboards + AI summaries.

**High-Level:**
- Frontend sends events (SUB_CREATED, VIEWED_PAGE, CANCELLED_SUB)
- Backend receives → stores in events table or Firestore collection
- Analytics jobs (cron/Cloud Function) aggregate → metrics_daily
- AI Insights API reads metrics → generates natural language insights

**Folder Structure (Backend slice):**
```
backend/
  src/
    events/
      eventTypes.ts
      eventRouter.ts       # /api/events
      eventService.ts
    analytics/
      aggregations.ts      # batch jobs / SQL queries
      metricsService.ts
    ai_insights/
      subs_insights_service.ts
      prompts/
        subs_insights_system.md
        subs_insights_examples.md
    db/
      models/
        Event.ts
        DailyMetrics.ts
```

**Flow:**
1. React `trackEvent('SUB_CREATED', payload)` → /api/events
2. Cron job: aggregates into daily/weekly metrics
3. /api/subscriptions/ai-insights:
   - Reads metrics tables
   - Builds summary prompt
   - Calls LLM
   - Returns "You're overspending on X, Y, Z…"

## 9️⃣ PWA + Offline-First

**Use for:** Offline subscription tracker, travel planner, etc.

**High-Level:**
- Frontend: React + Service Worker + IndexedDB (Dexie)
- Sync Engine: client-side "sync queue" to backend/Firestore
- Optional: background sync

**Core Folders:**
```
src/
  offline/
    dexieClient.ts
    syncQueue.ts
    syncStrategies.ts
  features/
    subscriptions/
      offlineAdapter.ts   # maps sub <-> local
      sync.ts             # sync logic
```

**Rules:**
- Always write feature logic via an adapter that chooses:
  - Dexie (guest/offline)
  - Backend/Firestore (logged-in)

