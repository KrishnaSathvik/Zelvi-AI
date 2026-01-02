# Production Configuration Guide

This document outlines the production setup and optimizations for Zelvi AI.

## Environment Variables

### Required Variables

Create a `.env.production` file with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Google Analytics 4 (Optional)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=production
```

### Supabase Edge Function Secrets

Set these in Supabase Dashboard → Edge Functions → Secrets:

- `OPENAI_API_KEY` - Your OpenAI API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (from Settings → API)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins (e.g., `https://zelvi.pp,https://www.zelvi.pp`)

## Build Optimizations

### Vite Production Build

```bash
npm run build
```

The build process:
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Optimizes assets
- Generates source maps (disabled in production by default)

### Recommended Build Settings

Update `vite.config.ts` for production:

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          charts: ['recharts'],
        },
      },
    },
  },
})
```

## CDN & Asset Optimization

### Recommended Setup

1. **Host static assets on CDN** (e.g., Cloudflare, AWS CloudFront)
2. **Enable compression** (gzip/brotli)
3. **Set cache headers**:
   - Static assets: 1 year
   - HTML: No cache
   - API responses: Short cache (5 minutes)

### Example Nginx Configuration

```nginx
server {
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # No cache for HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}
```

## Monitoring & Alerting

### Error Tracking

Recommended: **Sentry** or **Rollbar**

1. Install Sentry:
```bash
npm install @sentry/react
```

2. Update `src/lib/logger.ts` to send errors to Sentry:
```typescript
import * as Sentry from '@sentry/react'

export const logger = {
  error: (...args: any[]) => {
    if (import.meta.env.PROD) {
      Sentry.captureException(args[0])
    }
    console.error(...args)
  },
  // ... other methods
}
```

### Performance Monitoring

- **Google Analytics 4** - Already configured
- **Web Vitals** - Add to track Core Web Vitals
- **Supabase Dashboard** - Monitor database performance

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Monitor:
- Main application URL
- Supabase Edge Functions
- Database connection

## Security Checklist

- [x] Row Level Security (RLS) enabled on all tables
- [x] API keys stored in Supabase secrets (not in code)
- [x] CORS restricted to allowed origins
- [x] Rate limiting on Edge Functions
- [ ] HTTPS enforced (configure in hosting)
- [ ] Content Security Policy (CSP) headers
- [ ] Security headers (HSTS, X-Frame-Options, etc.)

### Security Headers

Add to your hosting configuration:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
```

## Database Optimizations

### Indexes

All critical indexes are already created in `supabase/schema.sql`. Monitor query performance and add indexes as needed.

### Connection Pooling

Configure Supabase connection pooling:
- Use connection pooler URL for server-side connections
- Set appropriate pool size based on traffic

## Rate Limiting

### Current Implementation

- AI endpoints: 20 requests/minute per user
- General endpoints: 100 requests/minute per user

### Production Recommendations

1. **Use Redis** for distributed rate limiting
2. **Implement per-IP rate limiting** for anonymous endpoints
3. **Add tiered limits** based on user subscription

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure Supabase secrets
- [ ] Deploy Edge Functions
- [ ] Run database migrations
- [ ] Build production bundle
- [ ] Deploy to hosting (Vercel, Netlify, etc.)
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Enable CDN
- [ ] Configure monitoring
- [ ] Set up error tracking
- [ ] Test all critical flows
- [ ] Load test AI endpoints
- [ ] Set up backup strategy

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups. For additional safety:

1. **Manual exports**: Use `export-data` Edge Function
2. **Automated backups**: Set up Supabase backup schedule
3. **Point-in-time recovery**: Available on Pro plan

### Data Export

Users can export their data via Profile → Data Controls → Export Data

## Scaling Considerations

### Current Limits (Supabase Free Tier)

- Database: 500 MB
- Bandwidth: 5 GB/month
- Edge Functions: 500K invocations/month
- Storage: 1 GB

### When to Upgrade

- Database size > 400 MB
- Bandwidth > 4 GB/month
- Edge Function invocations > 400K/month

### Cost Optimization

- Monitor OpenAI API usage
- Implement caching for frequently accessed data
- Use Supabase Realtime efficiently
- Optimize Edge Function execution time

## Troubleshooting

### Common Issues

1. **CORS errors**: Check `ALLOWED_ORIGINS` in Edge Function secrets
2. **Rate limit errors**: Adjust limits in `rateLimit.ts` or use Redis
3. **OpenAI API errors**: Check API key and usage limits
4. **Database connection errors**: Check connection pooler settings

### Logs

- **Edge Functions**: Supabase Dashboard → Edge Functions → Logs
- **Frontend**: Browser console (development) or error tracking service (production)
- **Database**: Supabase Dashboard → Logs

