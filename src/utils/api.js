import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smart-hire-ai-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smarthire_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('smarthire_token');
      localStorage.removeItem('smarthire_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;