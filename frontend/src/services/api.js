import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Banner API
export const bannerAPI = {
  generateDesigns: (requirements) => api.post('/banners/generate-designs', { requirements }),
  createBanner: (data) => api.post('/banners', data),
  getBanners: () => api.get('/banners'),
  getBanner: (id) => api.get(`/banners/${id}`),
  updateBanner: (id, data) => api.put(`/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/banners/${id}`)
};

export default api;
