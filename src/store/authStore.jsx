import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../api/auth.jsx";
import { useVendorStore } from "./vendorStore.jsx";
import toast from "react-hot-toast";   // ✅ add toast

export function extractErrorMessage(error) {
  if (error.response?.data) {
    const data = error.response.data;

    // Case 1: Backend gives { "message": "..." }
    if (typeof data === "string") return data;
    if (data.message) return data.message;

    // Case 2: DRF-style { "field": ["error1", "error2"] }
    if (typeof data === "object") {
      return Object.values(data).flat().join(" "); 
      // e.g. "A user with that username already exists."
    }
  }

  return error.message || "Something went wrong";
}


export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      vendor_profile:null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          set({
            user: response.user,
            token: response.access,
            accessToken: response.access,
            refreshToken: response.refresh,
            isLoading: false,
            error: null,

            vendor_profile:response.user.vendor_profile,
          });

          localStorage.setItem("authToken", response.access);
          localStorage.setItem("refreshToken", response.refresh);
          useVendorStore.getState().setVendorProfile(response.user.vendor_profile);


          toast.success("Login successful 🎉");   // ✅ success toast
          return response;
        } catch (error) {
          const msg = extractErrorMessage(error); 
          set({ isLoading: false, error: msg });
          toast.error(msg);                       // ✅ error toast
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
          localStorage.setItem("authToken", response.token);

          toast.success("Signup successful 🎉");  // ✅ success toast
          return response;
        } catch (error) {
          console.log(error);
          const msg = extractErrorMessage(error); 
          set({ isLoading: false, error: msg });
          toast.error(msg);                       // ✅ error toast
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
          toast.success("Logged out 👋");         // ✅ success toast
        } catch (error) {
          console.error("Logout error:", error);
          const msg = extractErrorMessage(error); 
          set({ isLoading: false, error: msg });
          toast.error(msg);                       // ✅ error toast
          throw error;
        } finally {
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            accessToken: null,
            refreshToken: null,
          });
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");

        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          set({ user: response.user, isLoading: false, error: null });
          return response;
        } catch (error) {
          const msg = extractErrorMessage(error); 
          set({ isLoading: false, error: msg });
          toast.error(msg);                       // ✅ error toast
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
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);



// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { authAPI } from '../api/auth.jsx';

// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isLoading: false,
//       error: null,

//       // Actions
//       login: async (credentials) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await authAPI.login(credentials);
//           set({
//             user: response.user,
//             token: response.token,
//             isLoading: false,
//             error: null,
//           });
//           localStorage.setItem('authToken', response.token);
//           return response;
//         } catch (error) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || 'Login failed',
//           });
//           throw error;
//         }
//       },

//       signup: async (userData) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await authAPI.signup(userData);
//           set({
//             user: response.user,
//             token: response.token,
//             isLoading: false,
//             error: null,
//           });
//           localStorage.setItem('authToken', response.token);
//           return response;
//         } catch (error) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || 'Signup failed',
//           });
//           throw error;
//         }
//       },

//       logout: async () => {
//         try {
//           await authAPI.logout();
//         } catch (error) {
//           console.error('Logout error:', error);
//         } finally {
//           set({
//             user: null,
//             token: null,
//             isLoading: false,
//             error: null,
//           });
//           localStorage.removeItem('authToken');
//         }
//       },

//       getCurrentUser: async () => {
//         set({ isLoading: true });
//         try {
//           const response = await authAPI.getCurrentUser();
//           set({
//             user: response.user,
//             isLoading: false,
//             error: null,
//           });
//           return response;
//         } catch (error) {
//           set({
//             isLoading: false,
//             error: error.response?.data?.message || 'Failed to get user',
//           });
//           throw error;
//         }
//       },

//       clearError: () => set({ error: null }),

//       isAuthenticated: () => {
//         const { token } = get();
//         return !!token;
//       },
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({
//         user: state.user,
//         token: state.token,
//       }),
//     }
//   )
// );
