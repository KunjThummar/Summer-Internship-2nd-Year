import api from './axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { msg, userId, jwt }
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // { msg, userId }
  }
};
