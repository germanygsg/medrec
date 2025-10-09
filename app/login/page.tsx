"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconBrandGoogle, IconBrandGithub, IconBrandWindows } from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data) {
          console.log("User already authenticated, redirecting to dashboard");
          router.push("/dashboard");
        }
      } catch (error) {
        console.log("No active session found");
      }
    };

    checkAuth();
  }, [router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting sign in for:", email);

      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      console.log("Sign in result:", result);
      console.log("Sign in result type:", typeof result);
      console.log("Sign in result keys:", Object.keys(result || {}));

      // Better Auth might return success differently
      if (result && result.data) {
        console.log("Sign in successful, user data:", result.data);

        // Use window.location.replace for proper redirect
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const callbackUrl = urlParams.get("callbackUrl") || "/dashboard";
          console.log("Redirecting to:", callbackUrl);
          window.location.replace(callbackUrl);
        }, 500);
        return;
      }

      if (result && result.error) {
        console.error("Sign in error:", result.error);
        alert(`Failed to sign in: ${result.error.message || "Please check your credentials."}`);
        return;
      }

      // If we get here, check if the authentication was successful by checking session
      console.log("Checking session after sign in...");
      const session = await authClient.getSession();
      console.log("Session check result:", session);

      if (session.data) {
        console.log("Session found, redirecting to dashboard");
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const callbackUrl = urlParams.get("callbackUrl") || "/dashboard";
          window.location.replace(callbackUrl);
        }, 500);
      } else {
        console.log("No session found after sign in");
        alert("Sign in appeared successful but no session was created. Please try again.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting sign up for:", email);

      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      console.log("Sign up result:", result);
      console.log("Sign up result type:", typeof result);
      console.log("Sign up result keys:", Object.keys(result || {}));

      // Better Auth might return success differently
      if (result && result.data) {
        console.log("Sign up successful, user data:", result.data);

        // Use window.location.replace for proper redirect
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const callbackUrl = urlParams.get("callbackUrl") || "/dashboard";
          console.log("Redirecting to:", callbackUrl);
          window.location.replace(callbackUrl);
        }, 500);
        return;
      }

      if (result && result.error) {
        console.error("Sign up error:", result.error);
        alert(`Failed to sign up: ${result.error.message || "Please try again."}`);
        return;
      }

      // If we get here, check if the authentication was successful by checking session
      console.log("Checking session after sign up...");
      const session = await authClient.getSession();
      console.log("Session check result:", session);

      if (session.data) {
        console.log("Session found, redirecting to dashboard");
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const callbackUrl = urlParams.get("callbackUrl") || "/dashboard";
          window.location.replace(callbackUrl);
        }, 500);
      } else {
        console.log("No session found after sign up");
        alert("Sign up appeared successful but no session was created. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github" | "microsoft") => {
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      alert(`Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isLoading}
                  type="button"
                >
                  <IconBrandGoogle className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={isLoading}
                  type="button"
                >
                  <IconBrandGithub className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("microsoft")}
                  disabled={isLoading}
                  type="button"
                >
                  <IconBrandWindows className="h-5 w-5" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isLoading}
                  type="button"
                >
                  <IconBrandGoogle className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={isLoading}
                  type="button"
                >
                  <IconBrandGithub className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn("microsoft")}
                  disabled={isLoading}
                  type="button"
                >
                  <IconBrandWindows className="h-5 w-5" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
