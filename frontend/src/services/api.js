import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't override Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  register: (userData) => api.post('/auth/register/', userData).then(res => res.data),
  login: (credentials) => api.post('/auth/login/', credentials).then(res => res.data),
  getProfile: () => api.get('/auth/profile/').then(res => res.data),
  updateProfile: (profileData) => api.patch('/auth/profile/update/', profileData).then(res => res.data),
};

// Books API
export const booksAPI = {
  getAll: (params = {}) => api.get('/books/', { params }).then(res => res.data),
  getById: (id) => api.get(`/books/${id}/`).then(res => res.data),
  create: (bookData) => {
    return api.post('/books/', bookData).then(res => res.data);
  },
  update: (id, bookData) => {
    return api.put(`/books/${id}/`, bookData).then(res => res.data);
  },
  delete: (id) => api.delete(`/books/${id}/`).then(res => res.data),
  deleteImage: (id) => api.delete(`/books/${id}/delete_image/`).then(res => res.data),
  getMyBooks: () => api.get('/books/my_books/').then(res => res.data),
  getAvailableBooks: () => api.get('/books/available_books/').then(res => res.data),
};

// Trades API
export const tradesAPI = {
  getAll: (params = {}) => api.get('/trades/', { params }).then(res => res.data),
  getById: (id) => api.get(`/trades/${id}/`).then(res => res.data),
  create: (tradeData) => api.post('/trades/', tradeData).then(res => res.data),
  update: (id, tradeData) => api.patch(`/trades/${id}/`, tradeData).then(res => res.data),
  delete: (id) => api.delete(`/trades/${id}/`).then(res => res.data),
  getSentTrades: () => api.get('/trades/sent_trades/').then(res => res.data),
  getReceivedTrades: () => api.get('/trades/received_trades/').then(res => res.data),
  getPendingTrades: () => api.get('/trades/pending_trades/').then(res => res.data),
  getCompletedTrades: () => api.get('/trades/completed_trades/').then(res => res.data),
  getDonations: () => api.get('/trades/donations/').then(res => res.data),
  
  // New enhanced trade methods
  acceptTrade: (id, acceptanceData) => api.post(`/trades/${id}/accept_trade/`, acceptanceData).then(res => res.data),
  confirmTrade: (id, confirmationData) => api.post(`/trades/${id}/confirm_trade/`, confirmationData).then(res => res.data),
  getMessages: (id) => api.get(`/trades/${id}/messages/`).then(res => res.data),
  sendMessage: (id, messageData) => api.post(`/trades/${id}/send_message/`, messageData).then(res => res.data),
};

export default api; 