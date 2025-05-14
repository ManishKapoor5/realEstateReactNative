import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const axiosBuyerInstance = axios.create({
  baseURL: 'https://realestatesite-backend.onrender.com/api/v1',
  withCredentials: true,
});

// Add request interceptor to attach the Authorization header
axiosBuyerInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
axiosBuyerInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token from the store
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          // If no refresh token, redirect to login
          useAuthStore.getState().logout();
          throw new Error('No refresh token available');
        }
        
        // Make a real refresh token API call
        const response = await axios.post(
          'https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token',
          { refreshToken },
          { withCredentials: true }
        );
        
        // Update token in store with new tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        
        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure - redirect to login
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosBuyerInstance;