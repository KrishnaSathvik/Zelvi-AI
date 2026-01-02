# 🚀 Deployment Ready Checklist

All critical fixes are complete and Edge Functions are ready for deployment.

## ✅ Completed Tasks

### 1. Edge Functions Updated
- ✅ `ai-coach` - CORS + Rate Limiting (20 req/min)
- ✅ `ai-weekly-summary` - CORS + Rate Limiting (5 req/min)
- ✅ `ai-notes` - CORS + Rate Limiting (30 req/min)

### 2. Deployment Script Updated
- ✅ `deploy-functions.sh` includes all functions including `ai-notes`

### 3. Documentation Created
- ✅ `DEPLOYMENT_STEPS.md` - Step-by-step deployment guide
- ✅ `EDGE_FUNCTIONS_UPDATE_SUMMARY.md` - Technical summary
- ✅ `PRODUCTION_CONFIG.md` - Production configuration

## 🎯 Action Items Before Deployment

### 1. Set ALLOWED_ORIGINS Secret (REQUIRED)

**Location**: Supabase Dashboard → Edge Functions → Secrets

**Steps**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
4. Click **"Add new secret"**
5. Enter:
   - **Name**: `ALLOWED_ORIGINS` (exact, case-sensitive)
   - **Value**: `https://zelvi.pp,https://www.zelvi.pp,http://localhost:5173`
6. Click **"Save"**

**For Production Only**:
```
https://zelvi.pp,https://www.zelvi.pp
```

**For Development**:
```
http://localhost:5173,http://localhost:3000
```

### 2. Verify Other Secrets

Ensure these secrets exist:
- ✅ `OPENAI_API_KEY`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ⚠️ `ALLOWED_ORIGINS` (NEW - must add)

### 3. Deploy Functions

**Option A: Use Script (Recommended)**
```bash
chmod +x deploy-functions.sh
./deploy-functions.sh
```

**Option B: Manual Deploy**
```bash
supabase functions deploy ai-coach
supabase functions deploy ai-weekly-summary
supabase functions deploy ai-notes
supabase functions deploy export-data
supabase functions deploy delete-account
supabase functions deploy upgrade-guest
```

## ✅ Post-Deployment Verification

### 1. Check Function Status
- Go to Supabase Dashboard → Edge Functions
- All functions should show **"Active"** status

### 2. Test CORS
- Make request from allowed origin → Should succeed
- Check response headers include `Access-Control-Allow-Origin`

### 3. Test Rate Limiting
- Make 21 requests to `ai-coach` in 1 minute
- 21st request should return `429 Too Many Requests`
- Check response headers:
  - `X-RateLimit-Limit: 20`
  - `X-RateLimit-Remaining: 0`
  - `Retry-After: <seconds>`

### 4. Test Functionality
- ✅ AI Coach chat works
- ✅ Weekly Summary generation works
- ✅ AI Notes (transcription + chat) works
- ✅ Profile features work

### 5. Check Logs
- Go to Supabase Dashboard → Edge Functions → Logs
- Look for errors or warnings
- Monitor rate limit hits

## 📊 Rate Limits Summary

| Function | Limit | Window | Notes |
|----------|-------|--------|-------|
| ai-coach | 20 | 1 min | General AI chat |
| ai-weekly-summary | 5 | 1 min | Weekly summaries |
| ai-notes | 30 | 1 min | Transcription + chat |

## 🔍 Quick Test Commands

### Test AI Coach
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-coach \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Origin: https://zelvi.pp" \
  -H "Content-Type: application/json" \
  -d '{"mode":"general","message":"Hello"}'
```

### Test Rate Limit
```bash
# Make 21 requests
for i in {1..21}; do
  curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-coach \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"mode":"general","message":"test"}' \
    -w "\nHTTP Status: %{http_code}\n"
done
```

## ⚠️ Important Notes

1. **CORS**: Without `ALLOWED_ORIGINS` secret, functions will default to localhost origins
2. **Rate Limiting**: Currently in-memory (resets on function restart). For production at scale, consider Redis
3. **Secrets**: All secrets are case-sensitive. Double-check spelling.
4. **Deployment**: Functions must be redeployed after adding/updating secrets

## 📚 Documentation

- **Deployment Guide**: `DEPLOYMENT_STEPS.md`
- **Technical Summary**: `EDGE_FUNCTIONS_UPDATE_SUMMARY.md`
- **Production Config**: `PRODUCTION_CONFIG.md`
- **Critical Fixes**: `CRITICAL_FIXES_COMPLETE.md`

## 🎉 Ready to Deploy!

All code changes are complete. Follow the steps above to:
1. Set `ALLOWED_ORIGINS` secret
2. Deploy functions
3. Verify everything works

Good luck with your deployment! 🚀

