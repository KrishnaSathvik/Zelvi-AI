# Edge Functions Update Summary

All Edge Functions have been updated with CORS restrictions and rate limiting.

## ✅ Updated Functions

### 1. ai-coach
- **CORS**: Restricted to `ALLOWED_ORIGINS` environment variable
- **Rate Limit**: 20 requests/minute per user
- **Status**: ✅ Updated

### 2. ai-weekly-summary
- **CORS**: Restricted to `ALLOWED_ORIGINS` environment variable
- **Rate Limit**: 5 requests/minute per user
- **Status**: ✅ Updated

### 3. ai-notes
- **CORS**: Restricted to `ALLOWED_ORIGINS` environment variable
- **Rate Limit**: 30 requests/minute per user (transcription + chat)
- **Status**: ✅ Updated

## 🔧 Changes Made

### CORS Configuration

All functions now:
- Use `ALLOWED_ORIGINS` environment variable (comma-separated list)
- Default to `localhost:5173`, `localhost:3000`, and `zelvi.pp` if not set
- Return proper CORS headers in all responses
- Handle OPTIONS preflight requests

### Rate Limiting

All functions now:
- Implement in-memory rate limiting per user
- Return rate limit headers:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in window
  - `X-RateLimit-Reset`: Timestamp when limit resets
- Return `429 Too Many Requests` when limit exceeded
- Include `Retry-After` header with seconds until reset

## 📋 Required Configuration

### Set ALLOWED_ORIGINS Secret

**Before deploying**, set this secret in Supabase Dashboard:

1. Go to: **Project Settings** → **Edge Functions** → **Secrets**
2. Add secret:
   - **Name**: `ALLOWED_ORIGINS`
   - **Value**: `https://zelvi.pp,https://www.zelvi.pp,http://localhost:5173`
   - (Adjust for your production domain)

### Rate Limits by Function

| Function | Rate Limit | Window |
|----------|-----------|--------|
| ai-coach | 20 requests | 1 minute |
| ai-weekly-summary | 5 requests | 1 minute |
| ai-notes | 30 requests | 1 minute |

## 🚀 Deployment

### Quick Deploy

```bash
./deploy-functions.sh
```

### Manual Deploy

```bash
supabase functions deploy ai-coach
supabase functions deploy ai-weekly-summary
supabase functions deploy ai-notes
```

## ✅ Verification

After deployment, verify:

1. **CORS**: Make request from allowed origin → Should succeed
2. **Rate Limiting**: Make 21 requests to ai-coach → 21st should return 429
3. **Headers**: Check response headers for rate limit info
4. **Logs**: Check Supabase Dashboard → Edge Functions → Logs

## 🔍 Testing

### Test CORS

```bash
# From allowed origin (should work)
curl -X POST https://your-project.supabase.co/functions/v1/ai-coach \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Origin: https://zelvi.pp" \
  -H "Content-Type: application/json" \
  -d '{"mode":"general","message":"test"}'

# From disallowed origin (should fail)
curl -X POST https://your-project.supabase.co/functions/v1/ai-coach \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Origin: https://evil.com" \
  -H "Content-Type: application/json" \
  -d '{"mode":"general","message":"test"}'
```

### Test Rate Limiting

```bash
# Make 21 requests in quick succession
for i in {1..21}; do
  curl -X POST https://your-project.supabase.co/functions/v1/ai-coach \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"mode":"general","message":"test"}' \
    -w "\nStatus: %{http_code}\n"
done

# 21st request should return 429
```

## 📝 Notes

- Rate limiting is **per-user** (based on user ID from auth token)
- Rate limit store is **in-memory** (resets on function restart)
- For production at scale, consider migrating to Redis-based rate limiting
- CORS origins are checked against `ALLOWED_ORIGINS` environment variable
- All error responses include proper CORS headers

## 🔄 Next Steps

1. ✅ Set `ALLOWED_ORIGINS` secret in Supabase Dashboard
2. ✅ Deploy all updated functions
3. ✅ Test CORS and rate limiting
4. ⏭️ Monitor function logs for issues
5. ⏭️ Consider Redis for distributed rate limiting (future)

## 📚 Related Documentation

- `DEPLOYMENT_STEPS.md` - Detailed deployment guide
- `PRODUCTION_CONFIG.md` - Production configuration guide
- `CRITICAL_FIXES_COMPLETE.md` - Summary of all critical fixes

