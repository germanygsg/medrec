# ⚡ OAuth Authentication - 30 Second Quick Start

## 🎯 You're ONE Step Away!

### The ONLY Thing You Need to Do:

**Generate a secret key and add it to your `.env` file.**

## Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Mac/Linux (Terminal):
```bash
openssl rand -base64 32
```

## Then:
1. Copy the output
2. Open `.env` file
3. Replace this line:
   ```env
   BETTER_AUTH_SECRET=REPLACE_THIS_WITH_SECURE_GENERATED_SECRET
   ```
   With:
   ```env
   BETTER_AUTH_SECRET=<paste-your-secret-here>
   ```
4. Save the file

## Verify:
```bash
node verify-auth-setup.js
```

## Deploy to Vercel:
1. Add same secret to Vercel environment variables
2. Push to git or run `vercel --prod`

## Done! 🎉

Visit: **https://kasirbsp.vercel.app/login**

---

## What You Get:

✅ Email/Password authentication
✅ Google OAuth (configure to enable)
✅ GitHub OAuth (configure to enable)
✅ Microsoft OAuth (configure to enable)
✅ Secure sessions (7 days)
✅ Protected routes
✅ Production-ready security

---

## More Info:

- 📘 **Full Setup**: `setup-auth.md`
- 🚀 **Deploy Guide**: `VERCEL_DEPLOYMENT.md`
- 📊 **Status**: `DEPLOYMENT_STATUS.md`
- 🔐 **OAuth Config**: `OAUTH_SETUP.md`
