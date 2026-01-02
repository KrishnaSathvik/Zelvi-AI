# Edge Functions Deployment Guide

## ✅ What You've Done

- [x] Set secrets in Supabase Dashboard (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

## 🚀 Next Steps

### Step 1: Link Your Supabase Project

You need to link your local project to your Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**How to find your project ref:**

**Option A: From Supabase Dashboard**
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **General**
4. Copy the **Reference ID** (looks like: `xpmpplxjmmcxyrvrryqo`)

**Option B: From Supabase CLI**
```bash
supabase projects list
```
Copy the **REFERENCE ID** from the output.

**Then run:**
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

You'll be prompted to enter your database password (the one you set when creating the project).

### Step 2: Deploy Edge Functions

After linking, deploy all functions:

**Option A: Use the deployment script (recommended)**
```bash
./deploy-functions.sh
```

**Option B: Deploy individually**
```bash
# AI Features (require OPENAI_API_KEY)
supabase functions deploy ai-coach
supabase functions deploy ai-weekly-summary

# Profile Features
supabase functions deploy export-data
supabase functions deploy delete-account
supabase functions deploy upgrade-guest
```

### Step 3: Verify Deployment

1. Go to **Supabase Dashboard** → **Edge Functions**
2. You should see all 5 functions:
   - ✅ `ai-coach`
   - ✅ `ai-weekly-summary`
   - ✅ `export-data`
   - ✅ `delete-account`
   - ✅ `upgrade-guest`
3. Each should show **"Active"** status

### Step 4: Test the Functions

**Test AI Coach:**
1. Open your app
2. Click the AI Coach button (floating button)
3. Send a message
4. You should get an AI response

**Test Weekly Summary:**
1. Go to Weekly Review page
2. Click "Generate AI Summary"
3. Wait for AI to generate summary

**Test Profile Features:**
1. Go to Profile page
2. Try exporting data
3. Test guest upgrade (if applicable)

## 🔧 Troubleshooting

### Error: "Cannot find project ref"
- Make sure you've run `supabase link`
- Verify the project ref is correct

### Error: "Function deployment failed"
- Check that secrets are set in Supabase Dashboard
- Verify you're logged in: `supabase projects list`
- Check function logs in Supabase Dashboard → Edge Functions → Logs

### Error: "OpenAI API key not configured"
- Go to Supabase Dashboard → Edge Functions → Secrets
- Verify `OPENAI_API_KEY` is set (case-sensitive)
- Redeploy the function after adding the secret

### Error: "Invalid token" or "Unauthorized"
- Make sure `SUPABASE_SERVICE_ROLE_KEY` secret is set
- Verify the key is correct (from Settings → API → service_role)

## 📝 Quick Reference

**All Edge Functions:**
- `ai-coach` - AI Coach chat
- `ai-weekly-summary` - Weekly summary generation
- `export-data` - Export user data
- `delete-account` - Delete user account
- `upgrade-guest` - Upgrade guest to full account

**Required Secrets:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `OPENAI_API_KEY` - OpenAI API key (for AI features)

## ✅ Deployment Checklist

- [ ] Linked Supabase project (`supabase link`)
- [ ] Deployed `ai-coach`
- [ ] Deployed `ai-weekly-summary`
- [ ] Deployed `export-data`
- [ ] Deployed `delete-account`
- [ ] Deployed `upgrade-guest`
- [ ] Verified all functions show "Active" in dashboard
- [ ] Tested AI Coach
- [ ] Tested Weekly Summary
- [ ] Tested Profile features

