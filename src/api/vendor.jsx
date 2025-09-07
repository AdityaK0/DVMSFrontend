import api from './config.jsx';

export const vendorAPI = {
  create: async (vendorData) => {
    const response = await api.post('/vendors/create/', vendorData);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vendors/${id}/`);
    return response.data;
  },

  update: async (id, vendorData) => {
    const response = await api.put(`/vendors/${id}/`, vendorData);
    return response.data;
  },

  getAnalytics: async (id) => {
    const response = await api.get(`/vendors/${id}/analytics/`);
    return response.data;
  },
};
