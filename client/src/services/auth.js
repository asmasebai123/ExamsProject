import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

export const register = async (userData) => {
  const response = await api.post('/api/auth/signup', userData);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};