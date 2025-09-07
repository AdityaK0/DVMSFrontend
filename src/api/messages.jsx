import api from './config.jsx';

export const messagesAPI = {
  send: async (messageData) => {
    const response = await api.post('/messages/send/', messageData);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/messages/history/');
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/messages/templates/');
    return response.data;
  },

  createTemplate: async (templateData) => {
    const response = await api.post('/messages/templates/', templateData);
    return response.data;
  },

  updateTemplate: async (id, templateData) => {
    const response = await api.put(`/messages/templates/${id}/`, templateData);
    return response.data;
  },

  deleteTemplate: async (id) => {
    const response = await api.delete(`/messages/templates/${id}/`);
    return response.data;
  },
};
