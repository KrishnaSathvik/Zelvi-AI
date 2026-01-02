# 🧩 Token-Efficient Workflows

Step-by-step workflows for common tasks that minimize token usage.

## 1️⃣ Workflow: UI Redesign for a Page

### Step 1 — Scope the page + sections
```
We are redesigning ONLY this page:
[src/pages/PageName.tsx]

Break the page into sections (e.g., header, hero, stats, cards, footer).
List the sections and what each does. Do NOT change any code yet.
Local scope only.
```

### Step 2 — Decide section order of work
```
From the sections you listed, tell me:
1) Which one is safest to update first
2) Which parts are most isolated
Do NOT scan other files. Local reasoning only.
```

### Step 3 — Redesign ONE section at a time
```
Redesign ONLY the [Hero Section] of this component.

Rules:
- Minimal diff mode
- Do NOT rewrite the entire file
- Only modify the JSX + Tailwind classes for the hero
- No logic changes (state, hooks, effects, data fetching)

Return: the updated snippet and a minimal patch description.
```

### Step 4 — Final pass (optional)
```
Review ONLY the updated sections we changed.
Check for:
- obvious layout bugs
- missing props
- simple ref consistency

No refactors. No full-file rewrite. Minimal suggestions only.
```

## 2️⃣ Workflow: Backend/API Feature or Change

### Step 1 — Identify exact entrypoint
```
We want to change backend behavior for:
[describe feature: e.g., POST /api/parks/:id/review]

Find the SINGLE route or controller responsible for this.
List:
- file path
- function name
Do NOT open or reason about other files.
```

### Step 2 — Ask for a safe plan
```
Now, for ONLY that function:
1) Explain current behavior in 2–3 bullets
2) Describe a minimal change to support: [new behavior]

Do NOT propose refactors or new abstractions.
```

### Step 3 — Apply minimal patch
```
Apply the minimal code change to support:
[new requirement]

Rules:
- Modify ONLY this route/handler
- Minimal diff mode
- No refactors or renames
- No changes outside this file
```

### Step 4 — Optional tests
```
Suggest 1–2 small test cases (unit or integration) ONLY for this handler.
Do not modify any test files yet.
```

## 3️⃣ Workflow: Database / Schema Change

### Step 1 — Locate schema
```
We need to add/update a field:
[field name: e.g., subscriptionCategory]

Find the SINGLE schema/model definition where this field belongs.
Return: file path and model snippet only.
Do NOT explore entire DB layer.
```

### Step 2 — Plan the minimal change
```
Explain:
1) Current structure of this model in 3 bullets
2) Minimal change to add/update [field name]
No other schema changes allowed.
```

### Step 3 — Apply change
```
Apply ONLY the schema change for [field name] in this model.

If migrations are necessary:
- Suggest a minimal migration script name and summary
- Do NOT generate the full migration yet unless I ask.
Minimal diff mode.
```

## 4️⃣ Workflow: Firestore Feature

### Step 1 — Analyze only needed parts
```
We're changing Firestore for this feature:
[e.g., user notification preferences]

1) Find the collection(s) we use
2) Show existing shape for 1–2 example documents
3) List rules that touch those collections

Do this with minimal snippets. No full rules file dump.
```

### Step 2 — Design new field + rule
```
Propose:
- A new field name + type
- How it fits into existing document shape
- The minimal Firestore rule change required

No other changes to collections or rules.
```

### Step 3 — Apply minimal rule + client change
```
1) Update ONLY the rule(s) related to this collection and new field
2) Show a minimal update to ONE client function that writes/reads this field

No global refactors.
No other rule changes.
Minimal diff mode.
```

## 5️⃣ Workflow: Auth Change

### Step 1 — Locate guard + context
```
We want this new auth behavior:
[e.g., admins can access /admin, guests → /]

Find:
- The main auth provider/context
- The route guard or ProtectedRoute
- The login handler

List file paths only. No code changes.
```

### Step 2 — Plan minimal auth logic
```
Propose the smallest change needed to support:
[new behavior]

Specify:
- Which file to modify
- What condition to add/change
Do NOT propose full architecture changes.
```

### Step 3 — Apply guarded change
```
Apply ONLY the new condition in:
[file path, function name]

Minimal diff mode:
- ONLY modify the if/conditional logic
- Do not move, rename, or refactor other auth helpers
```

## 6️⃣ Workflow: Page Migration / Route Restructure

### Step 1 — Plan the move
```
We want to move this page:
[from: src/pages/oldPath.tsx → to: src/pages/newPath.tsx]

1) List files that directly import or reference this page
2) List navigation/menu components linking to it

Do not search beyond those references.
```

### Step 2 — Step-wise migration plan
```
Propose a 3–5 step migration plan that:
- Avoids breaking the app mid-way
- Minimizes file changes

Do NOT change any code yet.
```

### Step 3 — Execute step 1 only
```
Implement Step 1 of your plan ONLY:
- Move/rename the file
- Update imports that break due to this move

Minimal diff mode.
No refactors, no cleanup yet.
Repeat step-by-step.
```

## 7️⃣ Workflow: Monorepo / Multi-App Work

### Step 1 — Declare active "domain"
```
We are working ONLY on this package/module:
[packages/web]  OR  [apps/api]  OR  [services/ai]

Treat this as the only context.
Do not analyze or modify other packages.
```

### Step 2 — Localized feature plan
```
Within ONLY [packages/web], propose a plan to implement:
[feature]

List:
- Files in this package only
- Minimal set of changes
Do NOT touch other packages.
```

### Step 3 — Execute with local scope lock
```
Apply changes ONLY in [packages/web] files listed.
Local Scope Lock:
- No imports or references to other packages unless they already exist.
- Minimal diff mode.
```

## 8️⃣ Workflow: AI Agent / RAG Feature

### Step 1 — Identify integration point
```
We are adding AI behavior:
[e.g., /api/generate-resume-summary]

Find:
- The existing API or route that will call the AI
OR
- Suggest a new dedicated handler for it

No global pipeline analysis.
```

### Step 2 — Prompt & schema only
```
Design ONLY:
- The prompt template
- The input/output JSON schema (request/response)
No code yet.

Optimize for clarity, but keep token size small.
```

### Step 3 — Wire AI to endpoint
```
Implement the AI call ONLY inside:
[file path, handler name]

Rules:
- Minimal diff mode
- No refactors to other endpoints
- No new abstractions unless absolutely necessary
```

### Step 4 — Optional: logging / limits
```
Suggest a minimal way to:
- Log AI calls
- Add a basic rate limit or token cap

Do NOT implement it yet unless I ask.
```

## 9️⃣ Workflow: "Big Refactor" Without Burning Tokens

### Step 1 — Explicitly cap scope
```
We are doing a SMALL, LOCAL REFACTOR.

Scope:
- Only this file: [path]
- Only this concern: [e.g., extract reusable card component]

Do NOT touch any other files.
Do NOT scan repo for patterns.
```

### Step 2 — Ask for a refactor plan
```
Propose a refactor within this file ONLY:

1) What to extract
2) What to rename
3) How it improves clarity

If it changes >20 lines, warn me first.
No code changes yet.
```

### Step 3 — Approve + apply
```
Approved. Apply your refactor plan in this file only.
- Minimal diff mode
- No global search/replace
- No impact on other modules
```

## 🔟 Workflow: Quick Fix Mode

```
I need a QUICK FIX for this bug ONLY.

Rules:
- Do NOT refactor
- Do NOT optimize
- Do NOT rename
- Do NOT touch other files

Give me the smallest possible code change that works.
```

