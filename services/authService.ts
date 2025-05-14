// src/services/authService.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = 'https://realestatesite-backend.onrender.com/api/v1/RealEstateUser';

// Create an axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
    
    // If error is 401 (Unauthorized) and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token from store
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          // No refresh token available, clear auth and reject
         
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/refresh-token`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        
        // Update access token in store
       
        
        // Update the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, log out
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth methods
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  
  try {
    await api.post('/logout', { refreshToken });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    useAuthStore.getState().logout();
  }
};

export const getCurrentUser = async () => {
  if (!useAuthStore.getState().isAuthenticated) {
    return null;
  }
  
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export default api;