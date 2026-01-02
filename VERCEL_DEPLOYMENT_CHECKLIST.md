# 🚀 Vercel Deployment Checklist

This checklist ensures your Zelvi AI application is ready for Vercel deployment.

## ✅ Pre-Deployment Verification

### 1. Build Configuration ✅
- [x] `vercel.json` created with proper configuration
- [x] Build command: `npm run build` (verified working)
- [x] Output directory: `dist` (verified)
- [x] SPA routing configured (all routes rewrite to `/index.html`)
- [x] Security headers configured
- [x] Service worker caching configured
- [x] Static asset caching configured

### 2. Environment Variables

Set these in **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

#### Required Variables:
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
  - Example: `https://xxxxx.supabase.co`
  - Get from: Supabase Dashboard → Settings → API → Project URL

- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Get from: Supabase Dashboard → Settings → API → anon/public key

- [ ] `VITE_GA4_MEASUREMENT_ID` - Google Analytics 4 Measurement ID
  - Example: `G-XXXXXXXXXX`
  - Get from: Google Analytics Dashboard

#### Optional Variables:
- [ ] `VITE_OPENAI_API_KEY` - OpenAI API key (only if using AI features)
  - Note: AI features will work without this, but AI Coach won't function

### 3. Vercel Project Setup

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

#### Option B: Deploy via GitHub Integration
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Add environment variables (see step 2 above)
7. Click "Deploy"

### 4. Domain Configuration

If using custom domain `zelvi.pp`:

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add domain: `zelvi.pp`
3. Add domain: `www.zelvi.pp` (optional)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

### 5. Post-Deployment Verification

After deployment, verify:

- [ ] Homepage loads at `https://zelvi.pp/`
- [ ] Authentication works (`/auth` page)
- [ ] Protected routes redirect when not authenticated
- [ ] App routes work (`/app/*` routes)
- [ ] Client-side routing works (navigate between pages)
- [ ] Service worker registers (check browser DevTools → Application → Service Workers)
- [ ] PWA manifest loads (`/manifest.webmanifest`)
- [ ] Static assets load (images, fonts, etc.)
- [ ] Supabase connection works (try logging in)
- [ ] AI features work (if `VITE_OPENAI_API_KEY` is set)

### 6. Edge Functions (Supabase)

**Note:** Edge Functions are deployed separately to Supabase, not Vercel.

Verify Edge Functions are deployed:
- [ ] `ai-coach` function deployed
- [ ] `ai-weekly-summary` function deployed
- [ ] `ai-notes` function deployed
- [ ] `export-data` function deployed
- [ ] `delete-account` function deployed
- [ ] `upgrade-guest` function deployed

**Edge Function Secrets** (in Supabase Dashboard):
- [ ] `OPENAI_API_KEY` set
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `ALLOWED_ORIGINS` set (must include `https://zelvi.pp`)

See `DEPLOYMENT_STEPS.md` for detailed Edge Functions deployment instructions.

### 7. Performance Optimization

- [x] Build completes successfully
- [ ] Consider code splitting for large chunks (warning shown in build)
- [ ] Test page load times
- [ ] Verify images are optimized
- [ ] Check Lighthouse scores

### 8. Security Checklist

- [x] Security headers configured in `vercel.json`
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not exposed in client code
- [ ] Supabase RLS policies enabled
- [ ] CORS configured correctly for Edge Functions

### 9. Monitoring & Analytics

- [ ] GA4 tracking works (check GA4 dashboard for events)
- [ ] Error monitoring set up (optional: Sentry, LogRocket, etc.)
- [ ] Performance monitoring enabled
- [ ] Vercel Analytics enabled (optional)

## 📋 Quick Deployment Steps

1. **Set Environment Variables in Vercel:**
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_GA4_MEASUREMENT_ID=...
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```
   Or use GitHub integration in Vercel Dashboard

3. **Verify:**
   - Check deployment URL
   - Test authentication
   - Test app routes
   - Check browser console for errors

4. **Configure Domain:**
   - Add custom domain in Vercel Dashboard
   - Update DNS records
   - Wait for propagation

## 🔧 Troubleshooting

### Build Fails
- Check Node.js version (Vercel uses Node 18+ by default)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel Dashboard

### Routes Return 404
- Verify `vercel.json` has correct rewrite rules
- Check that `dist/index.html` exists after build
- Ensure all routes are handled by React Router

### Environment Variables Not Working
- Variables must start with `VITE_` to be exposed to client
- Redeploy after adding/changing variables
- Check variable names are exact (case-sensitive)

### Service Worker Not Working
- Verify `sw.js` is in `public/` directory
- Check service worker registration in `index.html`
- Ensure service worker path is correct in manifest

### Supabase Connection Issues
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active
- Verify RLS policies allow access

## 📚 Related Documentation

- `DEPLOYMENT_STEPS.md` - Edge Functions deployment
- `DEPLOYMENT_READY.md` - Edge Functions readiness
- `README.md` - General project documentation
- `PRODUCTION_CONFIG.md` - Production configuration guide

## ✅ Ready to Deploy!

Once all items above are checked, your application is ready for Vercel deployment.

**Next Steps:**
1. Set environment variables in Vercel
2. Deploy via CLI or GitHub integration
3. Configure custom domain (if needed)
4. Test all functionality
5. Monitor for errors

Good luck with your deployment! 🚀

