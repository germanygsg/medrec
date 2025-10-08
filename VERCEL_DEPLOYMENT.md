# Vercel Deployment Guide - OAuth Authentication

## Production Domain
**URL**: https://kasirbsp.vercel.app

## ✅ Database Already Configured
Your Neon PostgreSQL database is ready with OAuth tables.

## 🚀 Deployment Steps

### 1. Generate Authentication Secret (Required)

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**Copy the output** - you'll need it for Vercel environment variables.

### 2. Configure Vercel Environment Variables

Go to your Vercel project settings and add these environment variables:

**Required:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_b5zHwExS7AgM@ep-purple-violet-a1nd5u6y-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

BETTER_AUTH_SECRET=<paste-your-generated-secret>
BETTER_AUTH_URL=https://kasirbsp.vercel.app

NODE_ENV=production
```

**Optional OAuth Providers** (add when ready):
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### 3. Configure OAuth Provider Redirect URIs

When setting up OAuth providers, use these production callback URLs:

**Google OAuth Console:**
- Authorized redirect URI: `https://kasirbsp.vercel.app/api/auth/callback/google`

**GitHub OAuth App:**
- Authorization callback URL: `https://kasirbsp.vercel.app/api/auth/callback/github`

**Microsoft Azure Portal:**
- Redirect URI: `https://kasirbsp.vercel.app/api/auth/callback/microsoft`

### 4. Deploy to Vercel

```bash
# Using Vercel CLI
vercel --prod

# Or push to your connected git repository
git add .
git commit -m "Add OAuth authentication"
git push origin main
```

### 5. Verify Deployment

After deployment:

1. Visit: https://kasirbsp.vercel.app/login
2. Test email/password registration
3. Test OAuth provider sign-in (if configured)
4. Verify redirect to dashboard after login
5. Test sign-out functionality

## 📋 Pre-Deployment Checklist

- [ ] Generated `BETTER_AUTH_SECRET`
- [ ] Added all environment variables to Vercel
- [ ] Verified `DATABASE_URL` is correct
- [ ] Set `BETTER_AUTH_URL=https://kasirbsp.vercel.app`
- [ ] (Optional) Configured OAuth provider credentials
- [ ] (Optional) Updated OAuth redirect URIs to production domain
- [ ] Tested login flow in production
- [ ] Verified protected routes work

## 🔒 Security Considerations

### Environment Variables
- ✅ Never commit `.env` to git
- ✅ Use different `BETTER_AUTH_SECRET` for production vs development
- ✅ Keep OAuth credentials secure

### OAuth Providers
- ✅ Use production credentials (separate from dev)
- ✅ Verify redirect URIs match exactly
- ✅ Enable HTTPS (automatic on Vercel)

### Database
- ✅ Connection uses SSL (`sslmode=require`)
- ✅ Neon database in production mode
- ✅ Connection pooling enabled

## 🧪 Testing Production Authentication

### Test Email/Password Flow:
1. Visit https://kasirbsp.vercel.app/login
2. Click "Sign Up" tab
3. Create an account with email/password
4. Verify redirect to dashboard
5. Test sign out

### Test OAuth Flow (if configured):
1. Visit https://kasirbsp.vercel.app/login
2. Click OAuth provider button (Google/GitHub/Microsoft)
3. Complete OAuth authorization
4. Verify redirect to dashboard
5. Test sign out

### Test Protected Routes:
1. Sign out if logged in
2. Try to access https://kasirbsp.vercel.app/dashboard
3. Should redirect to login page
4. Sign in and verify access granted

## 🔧 Troubleshooting

### "Unauthorized" or session errors
**Solution:**
- Verify `BETTER_AUTH_SECRET` is set in Vercel
- Check `BETTER_AUTH_URL` matches your domain exactly
- Clear browser cookies and try again

### OAuth callback fails
**Solution:**
- Verify redirect URI in provider console matches exactly:
  - Must be: `https://kasirbsp.vercel.app/api/auth/callback/{provider}`
- Check OAuth credentials are correct in Vercel
- Ensure provider app is not in sandbox/test mode

### Database connection errors
**Solution:**
- Verify `DATABASE_URL` environment variable in Vercel
- Check Neon database is active
- Confirm SSL mode is set to `require`

### Routes not protected
**Solution:**
- Verify `middleware.ts` is deployed
- Check build logs for any errors
- Ensure `BETTER_AUTH_URL` is set

## 📊 Monitoring

Check your Vercel dashboard for:
- Build logs
- Function logs (for API routes)
- Error tracking
- Analytics

## 🔄 Updating Authentication

### Adding New OAuth Provider:
1. Configure provider in their console
2. Add credentials to Vercel environment variables
3. Redeploy (or wait for automatic deployment)

### Rotating Secrets:
1. Generate new `BETTER_AUTH_SECRET`
2. Update in Vercel environment variables
3. Redeploy application
4. **Note:** This will invalidate all existing sessions

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Better Auth Docs**: https://www.better-auth.com/
- **Neon Docs**: https://neon.tech/docs
- **OAuth Setup**: See `OAUTH_SETUP.md` in this repo

## ✨ Next Steps

After successful deployment:

1. ✅ Monitor logs for any errors
2. ✅ Test all authentication flows
3. ✅ Configure additional OAuth providers (optional)
4. ✅ Set up error monitoring (Sentry, LogRocket, etc.)
5. ✅ Enable analytics if needed
6. ✅ Document any custom configurations

## 🎉 You're Live!

Once deployed with the correct environment variables, your OAuth authentication will be fully functional at:

**https://kasirbsp.vercel.app**

Users can:
- Sign up with email/password
- Sign in with OAuth providers (if configured)
- Access protected routes
- Maintain secure sessions
