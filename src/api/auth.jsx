import api from './config.jsx';
import { publicAPI } from './config.jsx';

export const authAPI = {
  signup: async (userData) => {
    const response = await publicAPI.post('/auth/register/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await publicAPI.post('/auth/login/', credentials);
    return response.data;
  },

  // logout: async () => {
  //   const response = await api.post('/auth/logout/');
  //   return response.data;
  // },
  logout: async () => {
    let refreshToken = localStorage.getItem("refreshToken");
  
    if (!refreshToken) {
      try {
        const persisted = JSON.parse(localStorage.getItem("auth-storage"));
        refreshToken = persisted?.state?.refreshToken || null;
      } catch (e) {
        console.warn("Could not parse auth-storage:", e);
      }
    }
    if (!refreshToken) {
      console.warn("No refresh token found for logout");
      return null;
    }
  
    const response = await api.post("/auth/logout/", {
      refresh: refreshToken,
    });
  
    return response.data;
  },
  

  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};
