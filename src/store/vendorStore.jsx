import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { vendorAPI } from '../api/vendor.jsx';
import { extractErrorMessage } from './authStore.jsx';
import toast from 'react-hot-toast';
import { useAuthStore } from './authStore.jsx';

export const useVendorStore = create(
  persist(
    (set, get) => ({
      vendorProfile: null,
      isLoading: false,
      error: null,
      isOnboarded: false,

      setVendorProfile: (profile) => {
        set({
          vendorProfile: profile,
          isOnboarded: profile?.is_onboarded || false,
        });
      },

      createVendor: async (vendorData) => {
        set({ isLoading: true, error: null });
        try {

          const response = await vendorAPI.create(vendorData);
          
          set({
            vendorProfile: response,
            isOnboarded: response?.is_onboarded || false,
            isLoading: false,
            error: null,
          });
          toast.success('Vendor profile created successfully!');
          return response;  
        } catch (error) {
          let msg = extractErrorMessage(error)
          toast.error(msg)
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to create vendor profile',
          });
          throw error;
        }
      },

      updateVendor: async (id, vendorData) => {
        set({ isLoading: true, error: null });
        try {
          const { vendorProfile } = useVendorStore.getState();
          if (!vendorProfile?.id) throw new Error('User not logged in');

          const response = await vendorAPI.update(vendorProfile.id, vendorData);
          set({
            vendorProfile: response,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update vendor profile',
          });
          throw error;
        }
      },

      getVendor: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await vendorAPI.getById(id);
          set({
            vendorProfile: response,
            isOnboarded: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to get vendor profile',
          });
          throw error;
        }
      },

      getAnalytics: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await vendorAPI.getAnalytics(id);
          set({
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to get analytics',
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      resetVendor: () => set({
        vendorProfile: null,
        isOnboarded: false,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'vendor-storage',
      partialize: (state) => ({
        vendorProfile: state.vendorProfile,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);
