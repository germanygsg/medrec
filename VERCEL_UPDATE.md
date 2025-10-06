# Vercel Update Guide - Auth Removal

## What Changed

The authentication system has been completely removed. The app now:
- ✅ Opens directly to the dashboard (no sign-in required)
- ✅ No user authentication or sessions
- ✅ Removed all auth-related UI (sign-in, sign-up, logout, user profile)
- ✅ Database migration drops auth tables (user, session, account, verification)

## Update Your Vercel Deployment

### Step 1: Update Environment Variables

Go to: https://vercel.com/[your-username]/medrec-two/settings/environment-variables

**Remove these variables** (they're no longer needed):
- ❌ `BETTER_AUTH_SECRET`
- ❌ `BETTER_AUTH_URL`
- ❌ `NEXT_PUBLIC_BETTER_AUTH_URL`

**Keep these variables**:
- ✅ `DATABASE_URL` - Your PostgreSQL connection string
- ✅ `NODE_ENV` - Set to "production"

### Step 2: Run Database Migration

The migration `drizzle/0004_curved_big_bertha.sql` drops the auth tables.

#### Option A: Using Drizzle CLI (Recommended)

```bash
# Install Drizzle CLI globally
npm i -g drizzle-kit

# Set your production database URL
export DATABASE_URL="postgresql://..."

# Run the migration
drizzle-kit push
```

#### Option B: Manual SQL

Connect to your database and run:

```sql
DROP TABLE "account" CASCADE;
DROP TABLE "session" CASCADE;
DROP TABLE "user" CASCADE;
DROP TABLE "verification" CASCADE;
```

#### Option C: Using Database GUI

1. Connect to your production database with TablePlus, DBeaver, or pgAdmin
2. Open the SQL editor
3. Copy and paste the migration SQL from `drizzle/0004_curved_big_bertha.sql`
4. Execute

### Step 3: Redeploy

After updating environment variables and running migrations:

**Automatic** (if you pushed to main):
- Vercel will auto-deploy from your main branch

**Manual**:
```bash
vercel --prod
```

Or in Vercel dashboard:
1. Go to Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"

### Step 4: Verify

Test the deployment:

1. **Visit**: https://medrec-two.vercel.app
   - Should redirect directly to dashboard (no sign-in)

2. **Check Health**: https://medrec-two.vercel.app/api/health
   ```json
   {
     "status": "healthy",
     "checks": {
       "database": "healthy",
       "memory": "healthy"
     }
   }
   ```

3. **Test Features**:
   - ✅ Dashboard displays
   - ✅ Can create patients
   - ✅ Can create appointments
   - ✅ Can create treatments
   - ✅ Can generate invoices

## Simplified Environment Variables

Your `.env` file now only needs:

```bash
# Node Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:port/db?sslmode=require
```

## What Was Removed

### Files Deleted:
- `app/sign-in/page.tsx`
- `app/sign-up/page.tsx`
- `app/api/auth/[...all]/route.ts`
- `components/nav-user.tsx`
- `lib/auth.ts`
- `lib/auth-client.ts`
- `db/schema/auth.ts`

### Database Tables Dropped:
- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts
- `verification` - Email verification

### UI Changes:
- Landing page now redirects to `/dashboard`
- Sidebar no longer shows user profile
- No logout button
- No authentication checks

## Security Considerations

⚠️ **Important**: The app is now **publicly accessible**

If you need to restrict access:

### Option 1: Basic Auth (Quick)
Add to `middleware.ts`:
```typescript
export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');

  if (!basicAuth) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const auth = basicAuth.split(' ')[1];
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');

  if (user !== 'admin' || pwd !== process.env.ADMIN_PASSWORD) {
    return new NextResponse('Invalid credentials', { status: 401 });
  }

  return NextResponse.next();
}
```

### Option 2: IP Whitelist
Configure in Vercel:
1. Go to Settings > Security
2. Add allowed IP addresses
3. Enable IP restrictions

### Option 3: VPN/Private Network
Deploy behind a VPN or private network for clinic-only access.

## Rollback Plan

If you need to restore authentication:

```bash
# 1. Checkout previous commit
git checkout 92a0bea

# 2. Push to a new branch
git checkout -b with-auth
git push origin with-auth

# 3. Deploy from Vercel dashboard
# Select "with-auth" branch for deployment
```

## Support

If you encounter issues:

1. **Check Logs**: https://vercel.com/[your-project]/logs
2. **Verify Database**: Ensure migration ran successfully
3. **Check Environment**: Verify only DATABASE_URL and NODE_ENV are set
4. **Test Health**: Visit `/api/health` endpoint

---

**Next Steps**:
- ✅ Update environment variables in Vercel
- ✅ Run database migration
- ✅ Redeploy
- ✅ Test the deployment
- ✅ Consider adding access restrictions if needed
