# Vercel Deployment Setup Guide

## Current Issue Fix

The "signup failed" error is caused by missing or incorrect environment variables in Vercel. Here's how to fix it:

## Step 1: Set Environment Variables in Vercel

Go to your Vercel project dashboard:
https://vercel.com/your-username/medrec-two/settings/environment-variables

### Required Environment Variables

Add these environment variables in the Vercel dashboard:

#### 1. Database URL
```
Name: DATABASE_URL
Value: postgresql://user:password@your-db-host:5432/dbname?sslmode=require
Environment: Production, Preview, Development
```

**Important**: You need a PostgreSQL database. Options:
- **Vercel Postgres** (Recommended): https://vercel.com/docs/storage/vercel-postgres
- **Neon** (Free tier): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

#### 2. Authentication Secret
```
Name: BETTER_AUTH_SECRET
Value: [Generate with: openssl rand -base64 32]
Environment: Production, Preview, Development
```

Generate a secure secret:
```bash
openssl rand -base64 32
```
Example output: `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE==`

#### 3. Auth URL (Server-side)
```
Name: BETTER_AUTH_URL
Value: https://medrec-two.vercel.app
Environment: Production

Value: https://medrec-two-git-[branch]-[username].vercel.app
Environment: Preview

Value: http://localhost:3000
Environment: Development
```

#### 4. Auth URL (Client-side)
```
Name: NEXT_PUBLIC_BETTER_AUTH_URL
Value: https://medrec-two.vercel.app
Environment: Production

Value: https://medrec-two-git-[branch]-[username].vercel.app
Environment: Preview

Value: http://localhost:3000
Environment: Development
```

#### 5. Node Environment
```
Name: NODE_ENV
Value: production
Environment: Production, Preview
```

## Step 2: Set Up Database (Choose One)

### Option A: Vercel Postgres (Recommended for Vercel)

1. Go to your Vercel project
2. Navigate to Storage tab
3. Create new Postgres database
4. Connect to your project
5. Copy the `POSTGRES_URL` environment variable
6. Use it as your `DATABASE_URL`

```bash
# Vercel will automatically add these:
DATABASE_URL=postgres://...
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
```

### Option B: Neon (Free PostgreSQL)

1. Sign up at https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Option C: Supabase

1. Create project at https://supabase.com
2. Go to Settings > Database
3. Copy "Connection String" (Transaction pooler)
4. Replace `[YOUR-PASSWORD]` with your password
5. Add to Vercel as `DATABASE_URL`

```
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Step 3: Run Database Migrations

After setting up your database, you need to apply migrations.

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations (one-time)
# First, get your DATABASE_URL from Vercel dashboard
export DATABASE_URL="postgresql://..."

# Generate and apply migrations
npm run db:generate
npm run db:migrate
```

### Using Database GUI

If you prefer a GUI:

1. Get your `DATABASE_URL` from Vercel
2. Connect using TablePlus, DBeaver, or pgAdmin
3. Run the migration SQL manually:

```bash
# Copy the SQL from the migration file
cat drizzle/0001_*.sql
cat drizzle/0002_*.sql
cat drizzle/0003_*.sql

# Paste and execute in your database GUI
```

## Step 4: Redeploy

After setting environment variables:

1. Go to your Vercel project dashboard
2. Click "Deployments" tab
3. Click "..." on latest deployment
4. Click "Redeploy"
5. Wait for deployment to complete

Or use CLI:
```bash
vercel --prod
```

## Step 5: Verify

Test the deployment:

1. Visit: https://medrec-two.vercel.app
2. Try to sign up
3. Check the browser console for errors
4. Verify health check: https://medrec-two.vercel.app/api/health

Expected health check response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-XX...",
  "uptime": 123.45,
  "environment": "production",
  "checks": {
    "database": "healthy",
    "memory": "healthy"
  }
}
```

## Troubleshooting

### Issue: Still seeing localhost:3000 error

**Cause**: Environment variables not set or deployment not updated

**Fix**:
1. Verify all 5 environment variables are set
2. Check they're set for "Production" environment
3. Redeploy the application
4. Clear browser cache (Ctrl+Shift+R)

### Issue: Database connection error

**Cause**: DATABASE_URL is incorrect or database not accessible

**Fix**:
1. Verify DATABASE_URL format: `postgresql://user:pass@host:port/db?sslmode=require`
2. Check database is running
3. Verify firewall allows Vercel IPs
4. Test connection with: `psql $DATABASE_URL`

### Issue: "Invalid auth secret" error

**Cause**: BETTER_AUTH_SECRET is too short or missing

**Fix**:
1. Generate new secret: `openssl rand -base64 32`
2. Set in Vercel (must be 32+ characters)
3. Redeploy

### Issue: CORS errors

**Cause**: NEXT_PUBLIC_BETTER_AUTH_URL doesn't match deployment URL

**Fix**:
1. Set to: `https://medrec-two.vercel.app`
2. No trailing slash
3. Must be HTTPS in production
4. Redeploy

## Environment Variables Checklist

Use this to verify all variables are set:

- [ ] `DATABASE_URL` - PostgreSQL connection string with SSL
- [ ] `BETTER_AUTH_SECRET` - 32+ character secret
- [ ] `BETTER_AUTH_URL` - https://medrec-two.vercel.app
- [ ] `NEXT_PUBLIC_BETTER_AUTH_URL` - https://medrec-two.vercel.app
- [ ] `NODE_ENV` - production

## Quick Setup Script

```bash
#!/bin/bash
# Run this locally to help set up Vercel environment

# 1. Generate auth secret
echo "Generated BETTER_AUTH_SECRET:"
openssl rand -base64 32

# 2. Set via Vercel CLI (alternative to dashboard)
vercel env add BETTER_AUTH_SECRET production
vercel env add BETTER_AUTH_URL production
vercel env add NEXT_PUBLIC_BETTER_AUTH_URL production
vercel env add DATABASE_URL production
vercel env add NODE_ENV production

# 3. Redeploy
vercel --prod
```

## Complete Setup Example

Here's a complete working example:

```bash
# 1. Create Neon database
# Visit: https://neon.tech
# Get connection string: postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# 2. Generate secret
SECRET=$(openssl rand -base64 32)

# 3. Set in Vercel (via CLI)
vercel env add DATABASE_URL production
# Paste: postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

vercel env add BETTER_AUTH_SECRET production
# Paste the $SECRET value

vercel env add BETTER_AUTH_URL production
# Paste: https://medrec-two.vercel.app

vercel env add NEXT_PUBLIC_BETTER_AUTH_URL production
# Paste: https://medrec-two.vercel.app

vercel env add NODE_ENV production
# Paste: production

# 4. Run migrations
export DATABASE_URL="postgresql://..." # Use your actual URL
npm run db:migrate

# 5. Deploy
vercel --prod

# 6. Test
curl https://medrec-two.vercel.app/api/health
```

## Post-Setup

After successful setup:

1. ✅ Test signup: https://medrec-two.vercel.app/sign-up
2. ✅ Test signin: https://medrec-two.vercel.app/sign-in
3. ✅ Test dashboard access
4. ✅ Verify health check: https://medrec-two.vercel.app/api/health
5. ✅ Check for console errors (should be none)

## Support

If you're still having issues:

1. Check Vercel logs: https://vercel.com/your-project/logs
2. Check Function logs for errors
3. Verify environment variables are set
4. Try redeploying
5. Clear browser cache completely

---

**Next Steps After Setup**:
- Set up custom domain (optional)
- Configure analytics (Vercel Analytics)
- Set up monitoring (see PRODUCTION.md)
- Enable Vercel Speed Insights
