'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    store.initializeAuth();
  }, []);

  return {
    user: store.user,
    accessToken: store.accessToken,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    setAuth: store.setAuth,
    clearAuth: store.clearAuth,
    setUser: store.setUser,
    setAccessToken: store.setAccessToken,
    setError: store.setError,
    setIsLoading: store.setIsLoading,
  };
};
