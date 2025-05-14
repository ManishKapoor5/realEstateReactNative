import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

// Define types for auth store
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `https://realestatesite-backend.onrender.com/api/v1`,
  withCredentials: true,
});

// Add request interceptor to attach the Authorization header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    try {
      // Add try/catch and fallback for safety
      const state = useAuthStore.getState() as AuthState;
      const token = state?.accessToken;
      
      console.log("access token---->", token);
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Error accessing auth store:", error);
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | void> => {
    // Type assertion for config with custom property
    interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
      _retry?: boolean;
    }
    
    const originalRequest = error.config as ExtendedInternalAxiosRequestConfig;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token from the store
        const state = useAuthStore.getState() as AuthState;
        const refreshToken = state.refreshToken;
        
        if (!refreshToken) {
          // If no refresh token, redirect to login
          state.logout();
          throw new Error('No refresh token available');
        }
        
        // Make a real refresh token API call
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );
        
        // Update token in store with new tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        state.setTokens(accessToken, newRefreshToken);
        
        // Update header and retry original request
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        
        // Return the new request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure - redirect to login
        const state = useAuthStore.getState() as AuthState;
        state.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;