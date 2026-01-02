# OpenAI API Key Setup Guide

## Overview

The OpenAI API key is **required** for AI features in Zelvi AI:
- **AI Coach** - Chat with AI about your job search, learning, projects, etc.
- **Weekly Summary** - AI-generated weekly review summaries

## Important: Where to Set the API Key

⚠️ **The OpenAI API key is NOT set in your `.env` file.**

It must be set in **Supabase Dashboard** as an Edge Function secret because:
1. Edge Functions run server-side (secure)
2. API keys should never be exposed in frontend code
3. Supabase manages secrets securely

## Step-by-Step Setup

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Give it a name (e.g., "Zelvi AI")
5. **Copy the key immediately** - you won't see it again!

### 2. Set the Secret in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
4. Click **"Add new secret"**
5. Enter:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Paste your OpenAI API key
6. Click **"Save"**

### 3. Set Other Required Secrets

While you're in the Secrets page, also add:

- **SUPABASE_URL**
  - Value: Your Supabase project URL (same as `VITE_SUPABASE_URL` in `.env`)
  - Example: `https://your-project-id.supabase.co`

- **SUPABASE_SERVICE_ROLE_KEY**
  - Value: Get from **Settings** → **API** → **service_role** key
  - ⚠️ Keep this secret - it bypasses Row Level Security

### 4. Deploy Edge Functions

After setting secrets, deploy the AI functions:

```bash
supabase functions deploy ai-coach
supabase functions deploy ai-weekly-summary
```

## Cost Information

- **Model**: `gpt-4o-mini` (cost-effective)
- **Pricing** (as of 2024):
  - Input: ~$0.15 per 1M tokens
  - Output: ~$0.60 per 1M tokens
- **Typical usage**: 
  - AI Coach chat: ~500-2000 tokens per message
  - Weekly Summary: ~2000-5000 tokens per summary

## Testing

After setup, test the AI features:

1. **AI Coach**: Open the AI Coach drawer in the app and send a message
2. **Weekly Summary**: Go to Weekly Review page and click "Generate AI Summary"

If you see errors, check:
- Secrets are set correctly in Supabase Dashboard
- Edge Functions are deployed
- OpenAI API key has credits/usage limits configured

## Security Notes

- ✅ API key is stored securely in Supabase (encrypted)
- ✅ Never commit API keys to git
- ✅ API key is only used server-side in Edge Functions
- ✅ Each request is authenticated via user session

## Troubleshooting

**Error: "OpenAI API key not configured"**
- Check that `OPENAI_API_KEY` secret exists in Supabase Dashboard
- Verify the secret name is exactly `OPENAI_API_KEY` (case-sensitive)
- Redeploy the Edge Function after adding the secret

**Error: "OpenAI API error"**
- Check your OpenAI account has credits
- Verify the API key is valid and not revoked
- Check OpenAI status page for outages

