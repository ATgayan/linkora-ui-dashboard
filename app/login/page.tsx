"use client";

import React, { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, BarChart3, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeProvider } from "@/components/theme-provider";

import { auth } from "@/lib/firebase";
import type { Auth } from 'firebase/auth';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!auth) {
      setError("Authentication service is not initialized. Please refresh the page.");
      setIsLoading(false);
      return;
    }

    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network and try again.");
      }

      console.log('Attempting login...');
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase auth successful');
      
      // Retry getIdToken up to 3 times
      let token;
      for (let i = 0; i < 3; i++) {
        try {
          token = await userCred.user.getIdToken(true); // Force token refresh
          break;
        } catch (error) {
          if (i === 2) throw error; // Throw on final attempt
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }
      
      if (!token) {
        throw new Error("Failed to get authentication token");
      }
      
      console.log('Got ID token');

      // Call your API to set the cookie server-side
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error('Session creation failed:', body);
        throw new Error(body?.error || "Failed to create session on server");
      }

      console.log('Session created successfully');
      router.replace("/admin");
    } catch (err: unknown) {
      // err may be a Firebase error object or generic Error
      let message: string;
      if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
        message = (err as { message: string }).message;
      } else {
        message = String(err) || "Login failed";
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Linkora Admin
              </h1>
              <p className="text-muted-foreground mt-2">Sign in to your admin dashboard</p>
            </div>

            {/* Login Form */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access the admin panel
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4" aria-describedby={error ? "login-error" : undefined}>
                  {error && (
                    <Alert variant="destructive" id="login-error">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@linkora.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="rounded-xl w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">Demo credentials: Admin@gmail.com / Admin1234</p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 Linkora. All rights reserved.</p>
              <div className="flex justify-center space-x-4 mt-2">
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
    </ThemeProvider>
  );
}

