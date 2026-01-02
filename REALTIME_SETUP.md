# 🔴 Realtime Subscriptions Setup Guide

## Overview

Your app already has **RealtimeProvider** implemented! It automatically syncs data changes across all pages in real-time. But you need to **enable replication** in Supabase for it to work.

## ✅ What's Already Implemented

Your codebase includes:
- ✅ `RealtimeProvider` component (`src/contexts/RealtimeProvider.tsx`)
- ✅ `useRealtime` hook (`src/hooks/useRealtime.ts`)
- ✅ Integrated in `App.tsx` (wraps the entire app)
- ✅ Auto-invalidates React Query cache on changes

## 🔧 What You Need to Do

### Step 1: Enable Replication for Tables

For Realtime to work, you must enable replication on each table in Supabase:

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Go to **Database** → **Replication** (left sidebar)
   - ⚠️ **NOT** "Stream database changes" (that's for external warehouses)
   - ⚠️ **NOT** "Read replicas" (that's for database replicas)
   - ✅ **YES** "Replication" (the page with table toggles)
4. You'll see a list of all tables with toggle switches

**Enable replication for these tables:**

- ✅ `jobs`
- ✅ `recruiters`
- ✅ `learning_logs`
- ✅ `projects`
- ✅ `content_posts`
- ✅ `daily_custom_tasks`
- ✅ `daily_task_status`
- ✅ `goals`
- ✅ `weekly_reviews`
- ✅ `notes`
- ✅ `activity_log`
- ✅ `user_profiles` (optional, but recommended)

**How to enable:**
- Toggle the switch next to each table name
- OR click the toggle at the top to enable all at once

### Step 2: Verify Realtime is Working

After enabling replication:

1. **Open your app** in browser
2. **Open browser console** (F12 or Cmd+Option+I)
3. Look for: `"Realtime subscription active"` in console
4. **Test it:**
   - Open app in two browser tabs
   - Create a job in one tab
   - Watch it appear automatically in the other tab! ✨

## 📋 How RealtimeProvider Works

The `RealtimeProvider` automatically:

1. **Subscribes** to all changes on tables filtered by `user_id`
2. **Listens** for `INSERT`, `UPDATE`, `DELETE` events
3. **Invalidates** React Query cache for relevant queries
4. **Refetches** data automatically → UI updates instantly

### Tables Monitored:

```typescript
// These tables are monitored by RealtimeProvider:
- jobs              → Updates: jobs list, dashboard, analytics
- recruiters        → Updates: recruiters list, dashboard, analytics
- learning_logs      → Updates: learning list, tasks, dashboard, analytics
- projects           → Updates: projects list, tasks, dashboard, analytics
- content_posts      → Updates: content list, tasks, dashboard, analytics
- daily_custom_tasks → Updates: daily tasks, dashboard
- daily_task_status  → Updates: daily tasks, timeline, analytics
- goals              → Updates: goals list, goal progress, dashboard
- weekly_reviews     → Updates: weekly review page
- notes              → Updates: notes page
- activity_log       → Updates: timeline, calendar
```

## 🎯 Benefits

With Realtime enabled:

- ✨ **Instant Updates**: Changes appear immediately across all pages
- 🔄 **No Manual Refresh**: UI updates automatically
- 📱 **Multi-Device Sync**: Changes on one device appear on others
- 🚀 **Better UX**: Feels like a native app

## 🐛 Troubleshooting

### Issue: "Realtime subscription active" not showing in console

**Solutions:**
1. Check that replication is enabled for the tables
2. Verify you're logged in (RealtimeProvider only works for authenticated users)
3. Check browser console for errors
4. Make sure RLS policies allow the user to read the tables

### Issue: Changes not appearing in real-time

**Solutions:**
1. Verify replication is enabled (Dashboard → Database → Replication)
2. Check that the table has the toggle ON
3. Verify RLS policies allow SELECT on the table
4. Check browser console for subscription errors

### Issue: "CHANNEL_ERROR" in console

**Solutions:**
1. Check your Supabase project is active (not paused)
2. Verify your `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Check Supabase status page for outages
4. Try refreshing the page

## 📊 Realtime Status Check

To verify Realtime is working:

1. **Check Console:**
   ```javascript
   // Should see in browser console:
   "Realtime subscription active"
   ```

2. **Test Multi-Tab:**
   - Open app in 2 browser tabs
   - Create/edit/delete data in one tab
   - Watch it update in the other tab instantly

3. **Check Network Tab:**
   - Open DevTools → Network
   - Filter by "WS" (WebSocket)
   - Should see WebSocket connection to Supabase

## 🔒 Security Note

Realtime subscriptions are **automatically filtered by `user_id`**:
- Users only receive updates for their own data
- RLS policies are enforced
- No cross-user data leakage

## ✅ Quick Setup Checklist

- [ ] Go to Supabase Dashboard → Database → Replication
- [ ] Enable replication for all 11 tables listed above
- [ ] Open your app
- [ ] Check browser console for "Realtime subscription active"
- [ ] Test by creating data in one tab, watching it appear in another

## 🚀 After Setup

Once Realtime is enabled:
- Your app will feel **instant** and **responsive**
- Changes sync across all pages automatically
- Multi-device usage works seamlessly
- No manual refresh needed!

---

**That's it!** Just enable replication in Supabase Dashboard and Realtime will work automatically. Your code is already set up! 🎉

