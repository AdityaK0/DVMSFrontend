import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/auth.jsx';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          set({
            user: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          localStorage.setItem('authToken', response.token);
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed',
          });
          throw error;
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.signup(userData);
          set({
            user: response.user,
            token: response.token,
            isLoading: false,
            error: null,
          });
          localStorage.setItem('authToken', response.token);
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Signup failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
          localStorage.removeItem('authToken');
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to get user',
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
