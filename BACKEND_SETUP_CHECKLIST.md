# 🚀 Backend Setup Checklist - Make Application Work

## ✅ What's Already Done

- [x] Database schema created (`supabase/schema.sql`)
- [x] Environment variables template created (`.env.example`)
- [x] Environment variables file created (`.env`)
- [x] Edge Functions deployed (all 5 functions)
- [x] Secrets configured in Supabase Dashboard

## 🔧 What You Need to Do Now

### Step 1: Run Database Schema ⚠️ **CRITICAL**

**This is the most important step!** Without this, your app won't work.

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New query"**
5. Open `supabase/schema.sql` from your project
6. **Copy the entire contents** of `schema.sql`
7. **Paste it into the SQL Editor**
8. Click **"Run"** (or press Cmd/Ctrl + Enter)
9. Wait for it to complete (should see "Success" message)

**What this does:**
- Creates all 15 database tables
- Sets up Row Level Security (RLS) policies
- Creates indexes for performance
- Sets up triggers for `updated_at` timestamps

**Verify it worked:**
- Go to **Table Editor** in Supabase Dashboard
- You should see all these tables:
  - `user_profiles`
  - `jobs`
  - `recruiters`
  - `learning_logs`
  - `projects`
  - `content_posts`
  - `daily_custom_tasks`
  - `daily_task_status`
  - `goals`
  - `weekly_reviews`
  - `activity_log`
  - `notes`
  - `user_settings`
  - `ai_chat_sessions`
  - `ai_messages`

### Step 2: Update Your .env File

1. Open `.env` file in your project
2. Replace placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://xpmpplxjmmcxyrvrryqo.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**To get your anon key:**
- Go to Supabase Dashboard → Settings → API
- Copy the **"anon public"** key (not the service_role key!)
- Paste it as `VITE_SUPABASE_ANON_KEY` in `.env`

**Optional:**
- Add `VITE_GA4_MEASUREMENT_ID` if you want Google Analytics

### Step 3: Enable Realtime (Optional but Recommended)

For real-time updates in your app:

1. Go to **Supabase Dashboard** → **Database** → **Replication**
2. Enable replication for these tables:
   - `jobs`
   - `recruiters`
   - `learning_logs`
   - `projects`
   - `content_posts`
   - `daily_custom_tasks`
   - `daily_task_status`
   - `goals`
   - `weekly_reviews`
   - `activity_log`
   - `notes`

**Or enable all at once:**
- Click the toggle at the top to enable replication for all tables

### Step 4: Verify Edge Functions Secrets

Double-check that all secrets are set:

1. Go to **Supabase Dashboard** → **Edge Functions** → **Secrets**
2. Verify these exist:
   - ✅ `SUPABASE_URL` = `https://xpmpplxjmmcxyrvrryqo.supabase.co`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
   - ✅ `OPENAI_API_KEY` = (your OpenAI API key)

### Step 5: Test Your Application

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open your app** in browser (usually http://localhost:5173)

3. **Test basic functionality:**
   - Sign in (should create guest user automatically)
   - Create a job application
   - Add a learning log
   - Create a project
   - Test AI Coach (should work if secrets are set)

## 📋 Quick Verification Checklist

Before testing, verify:

- [ ] ✅ Schema.sql has been run in Supabase SQL Editor
- [ ] ✅ All 15 tables exist in Table Editor
- [ ] ✅ `.env` file has correct `VITE_SUPABASE_URL`
- [ ] ✅ `.env` file has correct `VITE_SUPABASE_ANON_KEY`
- [ ] ✅ Edge Functions show "Active" status (already done ✅)
- [ ] ✅ All 3 secrets are set in Edge Functions (already done ✅)
- [ ] ✅ Realtime enabled for key tables (optional)

## 🐛 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution:** Check your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: "Table doesn't exist" errors
**Solution:** You haven't run `schema.sql` yet - go to Step 1 above

### Issue: "RLS policy violation" or "permission denied"
**Solution:** Make sure you ran the full `schema.sql` (includes RLS policies)

### Issue: AI Coach not working
**Solution:** 
- Check `OPENAI_API_KEY` secret is set in Supabase Dashboard
- Check Edge Function logs for errors
- Verify you have OpenAI API credits

### Issue: "Function not found"
**Solution:** Edge Functions might not be deployed - but you already deployed them ✅

## 🎯 Summary: Critical Steps

**MUST DO:**
1. ✅ Run `schema.sql` in Supabase SQL Editor (Step 1)
2. ✅ Update `.env` with your anon key (Step 2)

**ALREADY DONE:**
- ✅ Edge Functions deployed
- ✅ Secrets configured

**OPTIONAL:**
- Enable Realtime for better UX
- Add GA4 tracking

## 🚀 After Setup

Once everything is set up:
- Your app should work end-to-end
- You can create jobs, recruiters, learning logs, etc.
- AI Coach should respond
- Weekly summaries should generate
- Profile features should work

**If something doesn't work, check the error message and refer to the troubleshooting section above.**

