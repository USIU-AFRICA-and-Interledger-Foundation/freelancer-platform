'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, register as apiRegister, fetchCurrentUser } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function bootstrap() {
      try {
        const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;
        if (!storedToken) {
          setInitializing(false);
          return;
        }
        const res = await fetchCurrentUser();
        setUser(res.data.user || res.data.user || res.data.user);
        setInitializing(false);
      } catch {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('auth_token');
          window.localStorage.removeItem('auth_user');
        }
        setUser(null);
        setInitializing(false);
      }
    }

    bootstrap();
  }, []);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const res = await apiLogin(email, password);
      const { token, user: loggedInUser } = res.data;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth_token', token);
        window.localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
      }
      setUser(loggedInUser);

      if (loggedInUser.role === 'client') {
        router.push('/dashboard/client');
      } else if (loggedInUser.role === 'freelancer') {
        router.push('/dashboard/freelancer');
      } else {
        router.push('/dashboard/client');
      }
    },
    [router]
  );

  const handleRegister = useCallback(
    async (payload) => {
      const res = await apiRegister(payload);
      const { token, user: newUser } = res.data;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth_token', token);
        window.localStorage.setItem('auth_user', JSON.stringify(newUser));
      }
      setUser(newUser);

      if (newUser.role === 'client') {
        router.push('/dashboard/client');
      } else if (newUser.role === 'freelancer') {
        router.push('/dashboard/freelancer');
      } else {
        router.push('/dashboard/client');
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('auth_token');
      window.localStorage.removeItem('auth_user');
    }
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = {
    user,
    initializing,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

