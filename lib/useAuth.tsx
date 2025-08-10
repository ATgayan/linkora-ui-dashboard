"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";

import { AuthError } from "firebase/auth";


import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
} from "react";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook for handling auth errors
const useAuthError = () => {
  const [error, setError] = useState<string | null>(null);
  
  const handleAuthError = useCallback((error: AuthError) => {
    switch (error.code) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }, []);

  const setAuthError = useCallback((error: AuthError) => {
    setError(handleAuthError(error));
  }, [handleAuthError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, setAuthError, clearError };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { error, setAuthError, clearError } = useAuthError();
  const router = useRouter();

  // Memoize the base URL to avoid recreating it on every render
  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL, []);

  const refreshUserToken = useCallback(async (user: User): Promise<void> => {
    if (!baseUrl) {
      console.warn("API base URL not configured");
      return;
    }

    try {
      const token = await user.getIdToken(true);
      
      const response = await fetch(`${baseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      // Don't throw here to avoid disrupting the auth flow
    }
  }, [baseUrl]);

  const signup = useCallback(async (email: string, password: string): Promise<UserCredential> => {
    clearError();
    setLoading(true);
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError, setAuthError]);

  const login = useCallback(async (email: string, password: string): Promise<UserCredential> => {
    clearError();
    setLoading(true);
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError, setAuthError]);

  const logout = useCallback(async (): Promise<void> => {
    clearError();
    try {
      await signOut(auth);
      // Clear any server-side session
      if (baseUrl) {
        await fetch(`${baseUrl}/auth/logout`, {
          method: "POST",
          credentials: "include",
        }).catch(console.error); // Don't throw if this fails
      }
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError(error as AuthError);
      throw error;
    }
  }, [clearError, setAuthError, baseUrl, router]);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      try {
        if (user) {
          await refreshUserToken(user);
        } else {
          // User signed out - redirect to auth page
          router.push('/auth');
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        if (isMounted) {
          setUser(user);
          setLoading(false);
        }
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router, refreshUserToken]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextProps>(() => ({
    user,
    loading,
    error,
    signup,
    login,
    logout,
    clearError,
  }), [user, loading, error, signup, login, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}