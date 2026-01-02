# Deployment Steps for Production

This guide walks you through deploying the updated Edge Functions with CORS and rate limiting.

## Prerequisites

- Supabase CLI installed and authenticated
- Supabase project linked (`supabase link`)
- All Edge Functions code updated

## Step 1: Set Environment Variables in Supabase

### Required Secrets

Go to **Supabase Dashboard** → **Your Project** → **Edge Functions** → **Secrets**

Add or update these secrets:

1. **OPENAI_API_KEY**
   - Value: Your OpenAI API key
   - Already set? ✅ Check if exists

2. **SUPABASE_URL**
   - Value: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Already set? ✅ Check if exists

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: From **Settings** → **API** → **service_role** key
   - ⚠️ Keep this secret - it bypasses RLS
   - Already set? ✅ Check if exists

4. **ALLOWED_ORIGINS** ⚠️ **NEW - REQUIRED**
   - Value: Comma-separated list of allowed origins
   - Example: `https://zelvi.pp,https://www.zelvi.pp,http://localhost:5173`
   - For production: `https://zelvi.pp,https://www.zelvi.pp`
   - For development: `http://localhost:5173,http://localhost:3000`
   - **Action**: Add this secret now

### How to Set Secrets

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
4. Click **"Add new secret"** or **"Edit"** if it exists
5. Enter:
   - **Name**: `ALLOWED_ORIGINS` (case-sensitive)
   - **Value**: Your comma-separated origins
6. Click **"Save"**

## Step 2: Verify Supabase Project Link

Make sure your local project is linked to Supabase:

```bash
# Check if linked
supabase projects list

# If not linked, link your project
supabase link --project-ref YOUR_PROJECT_REF
```

**To find your project ref:**
- Go to Supabase Dashboard → Settings → General
- Copy the **Reference ID** (looks like: `xpmpplxjmmcxyrvrryqo`)

## Step 3: Deploy Edge Functions

### Option A: Deploy All Functions (Recommended)

Use the deployment script:

```bash
./deploy-functions.sh
```

### Option B: Deploy Individually

Deploy each function one by one:

```bash
# AI Functions (require OPENAI_API_KEY)
supabase functions deploy ai-coach
supabase functions deploy ai-weekly-summary
supabase functions deploy ai-notes

# Profile Functions
supabase functions deploy export-data
supabase functions deploy delete-account
supabase functions deploy upgrade-guest
```

### Deployment Output

You should see output like:

```
Deploying function ai-coach...
Function ai-coach deployed successfully
Function URL: https://xxxxx.supabase.co/functions/v1/ai-coach
```

## Step 4: Verify Deployment

### Check Function Status

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Verify all functions show **"Active"** status:
   - ✅ `ai-coach`
   - ✅ `ai-weekly-summary`
   - ✅ `ai-notes`
   - ✅ `export-data`
   - ✅ `delete-account`
   - ✅ `upgrade-guest`

### Test Functions

#### Test AI Coach

1. Open your app
2. Click the AI Coach button
3. Send a message
4. Should receive AI response
5. Check browser console for rate limit headers:
   - `X-RateLimit-Limit: 20`
   - `X-RateLimit-Remaining: 19`
   - `X-RateLimit-Reset: <timestamp>`

#### Test Rate Limiting

1. Make 21 requests to AI coach in 1 minute
2. 21st request should return:
   - Status: `429 Too Many Requests`
   - Header: `Retry-After: <seconds>`
   - Error message: "Rate limit exceeded"

#### Test CORS

1. Make request from allowed origin → Should succeed
2. Make request from disallowed origin → Should fail with CORS error

## Step 5: Check Function Logs

Monitor function execution:

1. Go to **Supabase Dashboard** → **Edge Functions** → **Logs**
2. Select a function (e.g., `ai-coach`)
3. Check for:
   - ✅ Successful requests
   - ⚠️ Rate limit errors (429)
   - ⚠️ CORS errors
   - ⚠️ Authentication errors

## Troubleshooting

### Error: "Function deployment failed"

**Possible causes:**
- Not authenticated: Run `supabase login`
- Project not linked: Run `supabase link`
- Missing secrets: Check all required secrets are set
- Syntax error: Check function code

**Solution:**
```bash
# Re-authenticate
supabase login

# Re-link project
supabase link --project-ref YOUR_PROJECT_REF

# Check secrets
# Go to Dashboard → Edge Functions → Secrets

# Check function logs
# Go to Dashboard → Edge Functions → Logs
```

### Error: "CORS error" in browser

**Possible causes:**
- `ALLOWED_ORIGINS` not set
- Origin not in `ALLOWED_ORIGINS` list
- Function not deployed with latest code

**Solution:**
1. Check `ALLOWED_ORIGINS` secret is set
2. Verify your origin is in the list
3. Redeploy the function

### Error: "Rate limit exceeded" immediately

**Possible causes:**
- Rate limit too strict
- Multiple users sharing same rate limit key

**Solution:**
- Rate limiting is per-user (by user ID)
- If issue persists, check rate limit logic in function code
- Consider increasing limits in function code

### Error: "OpenAI API key not configured"

**Possible causes:**
- `OPENAI_API_KEY` secret not set
- Secret name is incorrect (case-sensitive)

**Solution:**
1. Go to Dashboard → Edge Functions → Secrets
2. Verify `OPENAI_API_KEY` exists (exact name, case-sensitive)
3. Redeploy function after adding secret

## Post-Deployment Checklist

- [ ] All secrets set in Supabase Dashboard
- [ ] All Edge Functions deployed successfully
- [ ] Functions show "Active" status
- [ ] Tested AI Coach functionality
- [ ] Tested rate limiting (make 21 requests)
- [ ] Tested CORS (from allowed origin)
- [ ] Checked function logs for errors
- [ ] Verified rate limit headers in responses
- [ ] Tested in production environment

## Production Environment Variables

For your production frontend, set these in your hosting platform (Vercel, Netlify, etc.):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
```

## Next Steps

After successful deployment:

1. **Monitor Usage**: Check Edge Function logs regularly
2. **Monitor Costs**: Track OpenAI API usage
3. **Set Up Alerts**: Configure alerts for errors or high usage
4. **Load Testing**: Test with expected user load
5. **Documentation**: Update team documentation with deployment process

## Quick Reference

### Deploy All Functions
```bash
./deploy-functions.sh
```

### Deploy Single Function
```bash
supabase functions deploy FUNCTION_NAME
```

### Check Function Logs
```bash
supabase functions logs FUNCTION_NAME
```

### List Functions
```bash
supabase functions list
```

### View Function Details
Go to: Supabase Dashboard → Edge Functions → [Function Name]

