"use client";

import { createAuthClient } from "better-auth/react";

// Get the base URL for the auth client
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // For server-side or build time, use environment variable
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://medrec-ev2ee4x17-germanygsgs-projects.vercel.app";
  }

  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
