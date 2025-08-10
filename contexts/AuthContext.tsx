"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User, Auth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'logged in' : 'logged out');
      
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch('/api/verify-session', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            },
            credentials: 'include',
            body: JSON.stringify({ token }),
          });
          
          if (!response.ok) {
            console.error('Session verification failed');
            if (auth) await signOut(auth);
            setUser(null);
          } else {
            setUser(user);
            // If we're on the login page, redirect to admin
            if (window.location.pathname === '/login') {
              router.replace('/admin');
            }
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          if (auth) await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
        // If we're not on the login page, redirect to login
        if (window.location.pathname !== '/login') {
          router.replace('/login');
        }
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      // Clear server-side session
      await fetch('/api/logout', {
        method: 'POST',
      });
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if there's an error
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};