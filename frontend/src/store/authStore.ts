import { create } from 'zustand';
import { User, AuthResponse } from '@/types/api.types';
import { StorageUtil } from '@/utils/storage.utils';
import { AUTH_STORAGE_KEY, REFRESH_TOKEN_KEY } from '@/constants/api.constants';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setAuth: (response: AuthResponse) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setAuth: (response: AuthResponse) => {
    StorageUtil.set(AUTH_STORAGE_KEY, response);
    StorageUtil.set(REFRESH_TOKEN_KEY, response.refreshToken);
    set({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      error: null,
    });
  },

  clearAuth: () => {
    StorageUtil.remove(AUTH_STORAGE_KEY);
    StorageUtil.remove(REFRESH_TOKEN_KEY);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: () => {
    const auth = StorageUtil.get(AUTH_STORAGE_KEY);
    if (auth) {
      set({
        user: auth.user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        isAuthenticated: true,
      });
    }
  },
}));
