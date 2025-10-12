import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Banners API
export const bannersAPI = {
  create: (bannerData) => api.post('/banners', bannerData),
  getAll: () => api.get('/banners'),
  getById: (id) => api.get(`/banners/${id}`),
  update: (id, bannerData) => api.put(`/banners/${id}`, bannerData),
  delete: (id) => api.delete(`/banners/${id}`),
  getPlatformSpecs: () => api.get('/banners/specs/platforms'),
};

// AI API
export const aiAPI = {
  generateDesignSuggestions: (requirements) => 
    api.post('/ai/design-suggestions', requirements),
  optimizeText: (textData) => 
    api.post('/ai/optimize-text', textData),
};

// Unsplash API
export const unsplashAPI = {
  searchImages: (query, page = 1, perPage = 12) => 
    api.get('/unsplash/search', { params: { query, page, per_page: perPage } }),
  getCuratedImages: (category, page = 1, perPage = 12) => 
    api.get(`/unsplash/curated/${category}`, { params: { page, per_page: perPage } }),
  getRandomImage: (purpose = 'business') => 
    api.get('/unsplash/random', { params: { purpose } }),
  getSuggestions: (purpose, audience) => 
    api.get('/unsplash/suggestions', { params: { purpose, audience } }),
  downloadImage: (imageUrl) => 
    api.post('/unsplash/download', { imageUrl }),
  getCategories: () => 
    api.get('/unsplash/categories'),
};

export default api;