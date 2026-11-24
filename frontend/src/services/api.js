import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ne_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthUrl = error.config.url.includes('/api/auth/login') || error.config.url.includes('/api/auth/register');
      if (!isAuthUrl) {
        localStorage.removeItem('ne_token');
        localStorage.removeItem('ne_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
};

// User Profile Services
export const userApi = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (profileData) => api.put('/api/users/profile', profileData),
  changePassword: (passData) => api.post('/api/users/change-password', passData),
};

// Dashboard Services
export const dashboardApi = {
  getSummary: () => api.get('/api/dashboard/summary'),
};

// Quotes Services
export const quotesApi = {
  getDaily: () => api.get('/api/quotes/daily'),
  getRandom: () => api.get('/api/quotes/random'),
  search: (query, category) => api.get('/api/quotes/search', { params: { query, category } }),
  toggleFavorite: (id) => api.post(`/api/quotes/${id}/favorite`),
  getFavorites: () => api.get('/api/quotes/favorites'),
};

// Habits Services
export const habitsApi = {
  getAll: () => api.get('/api/habits'),
  create: (data) => api.post('/api/habits', data),
  toggle: (id, date) => api.post(`/api/habits/${id}/toggle`, null, { params: { date } }),
  delete: (id) => api.delete(`/api/habits/${id}`),
};

// Tasks Services
export const tasksApi = {
  getAll: (params) => api.get('/api/tasks', { params }),
  create: (data) => api.post('/api/tasks', data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data),
  toggle: (id) => api.post(`/api/tasks/${id}/toggle`),
  delete: (id) => api.delete(`/api/tasks/${id}`),
};

// Goals Services
export const goalsApi = {
  getAll: (type) => api.get('/api/goals', { params: { type } }),
  create: (data) => api.post('/api/goals', data),
  toggleMilestone: (goalId, milestoneId) => api.post(`/api/goals/${goalId}/milestones/${milestoneId}/toggle`),
  delete: (id) => api.delete(`/api/goals/${id}`),
};

// Focus Services
export const focusApi = {
  recordSession: (data) => api.post('/api/focus/session', data),
  getStats: () => api.get('/api/focus/stats'),
};

// Journal Services
export const journalApi = {
  getAll: (params) => api.get('/api/journal/entries', { params }),
  getById: (id) => api.get(`/api/journal/entries/${id}`),
  create: (data) => api.post('/api/journal/entries', data),
  update: (id, data) => api.put(`/api/journal/entries/${id}`, data),
  toggleFavorite: (id) => api.post(`/api/journal/entries/${id}/favorite`),
  delete: (id) => api.delete(`/api/journal/entries/${id}`),
};

// Challenges & Achievements Services
export const challengesApi = {
  getAll: (type) => api.get('/api/challenges', { params: { type } }),
  join: (id) => api.post(`/api/challenges/${id}/join`),
};

export const achievementsApi = {
  getAll: () => api.get('/api/achievements'),
};

// NQT Services
export const nqtApi = {
  getPracticeQuestions: (params) => api.get('/api/nqt/practice', { params }),
  getSampleQuestions: () => api.get('/api/nqt/sample-questions'),
  getMockTest: (topic, count = 10) => api.get('/api/nqt/mock-test', { params: { topic, count } }),
  submitTest: (data) => api.post('/api/nqt/submit-test', data),
  getHistory: () => api.get('/api/nqt/history'),
};

// AI Assistant Services
export const aiApi = {
  chat: (data) => api.post('/api/ai/chat', data),
  getConversations: () => api.get('/api/ai/conversations'),
  getMessages: (id) => api.get(`/api/ai/conversations/${id}/messages`),
  deleteConversation: (id) => api.delete(`/api/ai/conversations/${id}`),
};

// Analytics Services
export const analyticsApi = {
  getAnalytics: () => api.get('/api/analytics'),
};

export default api;
