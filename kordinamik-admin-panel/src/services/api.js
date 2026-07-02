import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').trim();
console.log('API URL:', API_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token is sent automatically via httpOnly cookie
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — send to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    return response.data;
  },
};

// Admin services
export const adminService = {
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.post('/admin/change-password', data);
    return response.data;
  },
};

// Product services
export const productService = {
  getAllProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  uploadProductImage: async (id, imageData) => {
    const formData = new FormData();
    formData.append('image', imageData.file);
    formData.append('is_primary', imageData.isPrimary);
    
    const response = await api.post(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteProductImage: async (productId, imageId) => {
    const response = await api.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  },
  uploadCoverPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('cover_photo', file);
    
    const response = await api.post(`/products/${id}/cover-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadTechnicalDetailsImage: async (id, file) => {
    const formData = new FormData();
    formData.append('technical_details_image', file);
    
    const response = await api.post(`/products/${id}/technical-details-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Category services
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Dealer application services
export const dealerApplicationService = {
  getAllApplications: async (params) => {
    const response = await api.get('/dealer-applications', { params });
    return response.data;
  },
  getApplicationById: async (id) => {
    const response = await api.get(`/dealer-applications/${id}`);
    return response.data;
  },
  approveApplication: async (id) => {
    const response = await api.post(`/dealer-applications/${id}/approve`);
    return response.data;
  },
  rejectApplication: async (id) => {
    const response = await api.post(`/dealer-applications/${id}/reject`);
    return response.data;
  }
};

// Dealers (registered) services
export const dealerService = {
  getAllDealers: async () => {
    const response = await api.get('/admin/dealers');
    return response.data;
  },
  deleteDealer: async (id) => {
    const response = await api.delete(`/admin/dealers/${id}`);
    return response.data;
  }
};

// Order services
export const orderService = {
  listOrders: async (params) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },
  summary: async (params) => {
    const response = await api.get('/admin/orders/summary', { params });
    return response.data;
  },
  getOrder: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.post(`/admin/orders/${id}/status`, { status });
    return response.data;
  }
};

// Warranty services
export const warrantyService = {
  list: async (params) => {
    const response = await api.get('/warranty', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/warranty/${id}`);
    return response.data;
  }
};

export default api;
