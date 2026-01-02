# Phase 6: Weekly Review + AI Coach - Completion Document

**Status:** ✅ Complete  
**Date:** December 23, 2025

---

## Overview

Phase 6 adds weekly reflection capabilities and an AI-powered coaching interface to help users review their progress, identify patterns, and get actionable insights.

---

## Deliverables

### 1. Weekly Review Page (`/app/review`)

#### Components Created:
- **`src/pages/WeeklyReview.tsx`** - Main weekly review page
- **`src/components/review/WeekSelector.tsx`** - Week picker with quick select options
- **`src/components/review/WeeklyStats.tsx`** - Aggregated stats card for selected week
- **`src/components/review/ReviewForm.tsx`** - Text areas for user reflection
- **`src/components/review/AISummary.tsx`** - AI-generated summary display

#### Features:
- Week selector with "This Week", "Last Week", and custom date options
- Weekly stats aggregation:
  - Jobs: applied, interviews, offers
  - Recruiters: contacts and response rate
  - Learning: total minutes and top category
  - Content: published posts
  - Tasks: created vs completed
  - Goals: progress snapshot for overlapping goals
- User reflection form with four sections:
  - What went well this week?
  - What didn't move / where did I get stuck?
  - What did I avoid or procrastinate on?
  - What will I focus on next week?
- AI summary generation with narrative summary and focus points

#### Hooks Created:
- **`src/hooks/useWeeklyReview.ts`** - Manages weekly review data and AI summary generation
- **`src/hooks/useWeeklyStats.ts`** - Aggregates stats for selected week

---

### 2. AI Coach (Global Overlay)

#### Components Created:
- **`src/components/ai/AICoachButton.tsx`** - Floating button (bottom-right)
- **`src/components/ai/AICoachDrawer.tsx`** - Slide-out chat panel
- **`src/components/ai/ChatMessage.tsx`** - Message bubble component
- **`src/components/ai/ShortcutButtons.tsx`** - Quick action buttons
- **`src/components/ai/ChatInput.tsx`** - Input area with send button

#### Features:
- Floating button accessible from all pages
- Drawer with mode tabs: General, Job, Learning, Projects, Content
- Mode-specific shortcut buttons:
  - **General**: Summarize last 7 days, 5-day action plan, top priorities, weekly update draft
  - **Job**: Analyze job funnel, suggest strategy changes
  - **Learning**: Plan next 2 weeks of learning
  - **Projects**: Help prioritize projects
  - **Content**: Generate post ideas based on learning
- Chat interface with message history
- Loading states and error handling
- Responsive design (full-width on mobile, 400px drawer on desktop)

#### Hook Created:
- **`src/hooks/useAICoach.ts`** - Manages chat state and API calls to edge functions

---

### 3. Edge Functions

#### Functions Created:
- **`supabase/functions/ai-coach/index.ts`** - AI coach chat endpoint
- **`supabase/functions/ai-weekly-summary/index.ts`** - Weekly summary generation endpoint

#### Features:
- JWT authentication and user verification
- Mode-based data fetching (general, job, learning, projects, content)
- Context summary building from user data
- OpenAI API integration (GPT-4o-mini)
- CORS support
- Error handling

**Note:** Edge functions need to be deployed separately using Supabase CLI:
```bash
supabase functions deploy ai-coach
supabase functions deploy ai-weekly-summary
```

**Required Environment Variables:**
- `OPENAI_API_KEY` - OpenAI API key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

---

## Integration Points

### App Updates:
- **`src/App.tsx`** - Added `/app/review` route
- **`src/components/AppLayout.tsx`** - Added AI Coach button (already had review in nav)

### Activity Logging:
- Weekly review saves logged to `activity_log` table
- GA4 events tracked:
  - `weekly_review_saved`
  - `weekly_review_ai_generated`
  - `ai_chat_open`
  - `ai_chat_message_sent`
  - `ai_chat_shortcut_used`

---

## Database Schema Requirements

### `weekly_reviews` Table:
```sql
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  wins TEXT,
  challenges TEXT,
  avoided TEXT,
  next_focus TEXT,
  ai_summary TEXT,
  ai_focus_points TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);
```

**Note:** This table should already exist from the initial schema setup. If not, create it before using the weekly review feature.

---

## Files Created

### Pages:
- `src/pages/WeeklyReview.tsx`

### Components:
- `src/components/review/WeekSelector.tsx`
- `src/components/review/WeeklyStats.tsx`
- `src/components/review/ReviewForm.tsx`
- `src/components/review/AISummary.tsx`
- `src/components/ai/AICoachButton.tsx`
- `src/components/ai/AICoachDrawer.tsx`
- `src/components/ai/ChatMessage.tsx`
- `src/components/ai/ShortcutButtons.tsx`
- `src/components/ai/ChatInput.tsx`

### Hooks:
- `src/hooks/useWeeklyReview.ts`
- `src/hooks/useWeeklyStats.ts`
- `src/hooks/useAICoach.ts`

### Edge Functions:
- `supabase/functions/ai-coach/index.ts`
- `supabase/functions/ai-weekly-summary/index.ts`

**Total:** 13 new files

---

## Files Updated

- `src/App.tsx` - Added WeeklyReview route
- `src/components/AppLayout.tsx` - Added AI Coach button

**Total:** 2 files updated

---

## Testing Checklist

- [ ] Weekly review page loads correctly
- [ ] Week selector works (this week, last week, custom date)
- [ ] Weekly stats display correctly for selected week
- [ ] Review form saves and loads existing reviews
- [ ] AI summary generation works (requires edge function deployment)
- [ ] AI Coach button appears on all pages
- [ ] AI Coach drawer opens and closes correctly
- [ ] Mode tabs switch correctly
- [ ] Shortcut buttons send messages
- [ ] Chat messages display correctly
- [ ] AI responses are received (requires edge function deployment)
- [ ] Error handling works for failed API calls
- [ ] Mobile responsive design works

---

## Known Limitations

1. **Edge Functions Not Deployed:** The edge functions are created but need to be deployed to Supabase separately. Until deployed, AI features will show errors.

2. **OpenAI API Key Required:** The edge functions require an OpenAI API key to be set in Supabase environment variables.

3. **Chat History Not Persisted:** Currently, chat messages are not saved to the database. This is optional per the roadmap and can be added later.

4. **No Integration from Analytics/Calendar:** The "Ask AI" buttons mentioned in the roadmap for Analytics and Calendar pages are not yet implemented. These can be added in future updates.

---

## Next Steps

1. **Deploy Edge Functions:**
   ```bash
   supabase functions deploy ai-coach
   supabase functions deploy ai-weekly-summary
   ```

2. **Set Environment Variables in Supabase:**
   - `OPENAI_API_KEY`
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

3. **Test AI Features:**
   - Test weekly summary generation
   - Test AI coach chat in all modes

4. **Optional Enhancements:**
   - Add chat history persistence
   - Add "Ask AI" buttons to Analytics and Calendar pages
   - Add more shortcut options
   - Improve error messages and loading states

---

## Summary

Phase 6 successfully implements:
- ✅ Weekly review page with stats and reflection
- ✅ AI-powered weekly summary generation
- ✅ Global AI Coach interface with mode-specific shortcuts
- ✅ Edge functions for AI integration
- ✅ Complete integration with existing data and activity logging

**Phase 6 is complete and ready for testing (pending edge function deployment).**

---

**Next Phase:** Phase 7 - Profile, Export, Delete, Guest Upgrade

