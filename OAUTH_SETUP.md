# OAuth 2.0 Authentication Setup

## Overview

OAuth 2.0 authentication has been implemented using **better-auth** with support for:
- Email/Password authentication
- Google OAuth
- GitHub OAuth
- Microsoft OAuth

## Setup Instructions

### 1. Install Dependencies

Dependencies are already configured in `package.json`. Run:

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure the following:

```bash
# Required
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres

# Optional OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

**Generate BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

#### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to Azure Active Directory → App registrations
3. Click "New registration"
4. Configure redirect URI: `http://localhost:3000/api/auth/callback/microsoft`
5. Generate a client secret under Certificates & secrets
6. Copy Application (client) ID and Client Secret to `.env`

### 4. Database Setup

✅ **Your production database is already configured!**

The OAuth authentication tables (`user`, `session`, `account`, `verification`) already exist in your Neon database and are fully compatible with better-auth.

If you need to sync any future schema changes:

```bash
npx drizzle-kit push
```

### 5. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/login` to test authentication.

## File Structure

```
├── lib/
│   ├── auth.ts              # Better-auth server configuration
│   └── auth-client.ts       # Better-auth client utilities
├── app/
│   ├── login/
│   │   └── page.tsx         # Login page with OAuth buttons
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.ts # Auth API handler
├── db/
│   └── schema/
│       └── auth.ts          # Authentication database schema
└── middleware.ts            # Auth middleware for protected routes
```

## Database Schema

The following tables are created:

- **users** - User accounts
- **sessions** - Active user sessions
- **accounts** - OAuth provider accounts
- **verifications** - Email verification tokens

## Usage

### Client-Side Authentication

```typescript
import { authClient } from "@/lib/auth-client";

// Sign in with email
await authClient.signIn.email({
  email: "user@example.com",
  password: "password",
  callbackURL: "/dashboard",
});

// Sign in with OAuth provider
await authClient.signIn.social({
  provider: "google", // or "github", "microsoft"
  callbackURL: "/dashboard",
});

// Sign out
await authClient.signOut();

// Get session
const { data: session } = authClient.useSession();
```

### Server-Side Authentication

```typescript
import { auth } from "@/lib/auth";

// Get session
const session = await auth.api.getSession({
  headers: request.headers,
});

if (!session) {
  return new Response("Unauthorized", { status: 401 });
}
```

## Protected Routes

The middleware in `middleware.ts` automatically protects all routes except:
- `/login`
- `/api/auth/*`
- `/api/health`
- `/` (homepage)

To add more public routes, edit the `publicRoutes` array in `middleware.ts`.

## Production Deployment

For production:

1. Update `BETTER_AUTH_URL` to your production domain
2. Update OAuth redirect URIs in provider consoles
3. Use secure database connection with SSL
4. Enable HTTPS
5. Consider implementing Redis for session storage (instead of in-memory)

## Troubleshooting

**OAuth callback errors:**
- Verify redirect URIs match exactly in provider console
- Check that environment variables are set correctly

**Database errors:**
- Ensure migrations have been run
- Verify database connection string

**Session issues:**
- Clear browser cookies
- Check BETTER_AUTH_SECRET is set
- Verify session cookie is being set (check browser dev tools)
