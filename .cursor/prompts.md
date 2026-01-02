# 🎯 Token-Safe Prompt Templates

Use these templates to reduce token usage by 40-60%.

## ✅ Section A — Safe UI / Frontend Prompts

### 1) Small UI Change (Cheapest)
```
Make a minimal edit to the component.
Only modify the smallest required JSX lines.
Do NOT rewrite the entire file.
Do NOT touch unrelated code.
```

### 2) UI Redesign (Chunked + Safe)
```
We are redesigning ONLY this section of the UI:
[describe section: header / hero / card / navbar / form]

DO NOT rewrite the entire component.
Provide a replacement JSX snippet for ONLY this section.
Do not load the whole repo.
No global refactors.
```

### 3) New Component Generation
```
Create a NEW component called <ComponentName>.
Do not modify any existing files.
Output ONLY the new code for this component.
Keep it self-contained and minimal.
```

### 4) Styling Update
```
Update ONLY the styling.
Do not change component structure or logic.
Modify only the classes or style blocks.
Avoid full-file rewrites.
```

### 5) Fix Layout, Spacing, Responsiveness
```
Fix the layout for mobile/tablet/desktop.
Make minimal changes to the JSX.
Only adjust classNames related to spacing, flex/grid.
Do not change component logic or unrelated sections.
```

## ⚙️ Section B — Safe Backend / API Prompts

### 6) Modify a Single API Route
```
Update ONLY this API route:
[path]

Do not modify other routes.
Do not refactor controllers/services unless approved.
Use a minimal diff patch.
```

### 7) Add a New API Endpoint
```
Add a NEW endpoint:
METHOD: GET/POST/PUT/DELETE
PATH: /api/xxx

Create a new file or append ONLY within the router file.
Do NOT scan or modify other backend files.
Keep logic minimal and focused.
```

### 8) Fix a Bug in One Function
```
Fix ONLY the bug in this function.
Show a minimal diff.
Do not rewrite the entire file.
Do not touch unrelated functions.
```

### 9) Add Validation / Error Handling
```
Add validation/error-handling ONLY to this handler.
Minimal patch; avoid structural changes.
Do not refactor unrelated code.
```

### 10) Integrate External API
```
Integrate this external API:
[API name]

Add the logic ONLY inside the specified function or file.
Avoid global changes.
Keep the implementation minimal.
```

## 🧱 Section C — Database / Schema Prompts

### 11) Add a Field to a Schema
```
Add ONE new field to schema/model:
[field name] : [type]

Modify ONLY the schema file.
Do not touch migrations unless requested.
Do not refactor other models.
```

### 12) Firestore Rule Change
```
Modify ONLY the rules related to:
[collection name]

Minimal diff.
No full rewrite of the entire ruleset.
```

### 13) SQL / Prisma Model Adjustments
```
Update ONLY this model:
[model name]

Change fields minimally.
Avoid touching unrelated models or migrations.
```

## 🧠 Section D — Token-Safe Multi-step Feature Prompts

### 14) Feature Implementation (Plan First)
```
Before writing code:
1. Generate a 5–8 step plan.
2. List EXACT files that need updates.
3. Provide estimated diff size.

Do not start coding.
Wait for my approval.
```

### 15) Feature Implementation (After Approval)
```
Follow the approved plan.
Modify ONLY the listed files.
Make minimal-diff changes.
Do not introduce unrelated refactors.
```

### 16) Break Large Tasks Into Chunks
```
This is a large feature. Break it into logical parts.

Part 1: Planning  
Part 2: Core logic  
Part 3: UI  
Part 4: Integrations  
Part 5: Cleanup

Handle only Part 1 now.  
Do NOT read or modify the full repo.
```

## 🔍 Section E — Debugging Prompts

### 17) Debug Using Snippets
```
I will paste ONLY the relevant code snippet.

Analyze only this snippet.
Do NOT request the full file.
Suggest a minimal fix.
```

### 18) Internal Reasoning Debug
```
Think step-by-step internally.
Explain only the final fix.

Modify only the smallest code region needed.
```

### 19) Fix a Crash or Error
```
Fix the error with the smallest possible code change.
No unrelated refactoring.
Target ONLY the file causing the error.
```

### 20) Safe Dependency Fix
```
We are updating / adding a dependency.
Modify ONLY:
- package.json
- specific import lines
- relevant functions

Do not audit the entire repo.
Do not refactor unrelated files.
```

## 🧩 Section F — Repo & Architectural Changes

### 21) Add Folder Structure Only
```
Generate ONLY the folder structure + empty files.
Do NOT populate code yet.
Do NOT modify existing files.
```

### 22) Migrate a File to a New Folder
```
Move ONLY this file:
[from → to]

Update ONLY imports that break from this move.
Avoid scanning the whole repo.
```

### 23) Create a New Module / Service
```
Create a NEW isolated module called:
[module name]

It should be stand-alone.
Do NOT modify any existing modules.
```

### 24) Cleanup Repetitive Code
```
Show a minimal-diff cleanup ONLY in these files:
[list files]

No global repo-wide refactors.
Do not search the entire project for patterns.
```

## 🎨 Section G — AI, ML, Agents, Embeddings

### 25) Add AI Functionality
```
Add AI logic ONLY inside this function:
[path]

Do not modify unrelated files.
Keep the implementation minimal.
No whole-project agent rewrites.
```

### 26) Add Embedding Generation
```
Add embedding usage ONLY in this module.
Avoid touching other services.
Minimal changes only.
```

### 27) Improve Prompt Engineering
```
Rewrite ONLY the prompt string.
Do not modify business logic or API calls.
```

## 🔥 Section H — Prevent Runaway Tasks

### 28) Hard Stop Prompt
```
STOP.  
Before doing anything, tell me:
1. Which files you will modify
2. Estimated diff size
3. Token cost estimate
4. A lighter alternative

Do NOT start coding.
```

### 29) Local Scope Only
```
Work ONLY within this file.
Do not consider or read other files.
Do not expand context.
```

### 30) Zero-Refactor Mode
```
DO NOT do any refactor.  
DO NOT rewrite code.  
ONLY apply the exact change I describe.  
Minimal diff only.
```

