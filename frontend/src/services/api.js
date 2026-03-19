import axios from 'axios';

// Dùng '/api' để Vite proxy chuyển tới backend (localhost:5000). Production thì set VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/products/search', { params: { q: query } });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getPending: async () => {
    const response = await api.get('/products/pending');
    return response.data;
  },

  approve: async (id) => {
    const response = await api.put(`/products/${id}/approve`);
    return response.data;
  },
};

export const orderService = {
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },
};

export const aiService = {
  chat: async (message) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  },

  recommend: async (params) => {
    const response = await api.post('/ai/recommend', params);
    return response.data;
  },

  trackView: async (productId) => {
    const response = await api.post('/ai/track-view', { product_id: productId });
    return response.data;
  },
};

export const reviewService = {
  getByProduct: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  getAverageRating: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}/rating`);
    return response.data;
  },

  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  update: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  getAll: async (status) => {
    const response = await api.get('/reviews', { params: { status } });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/reviews/${id}/status`, { status });
    return response.data;
  },
};

export default api;
