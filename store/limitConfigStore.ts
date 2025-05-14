import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LimitConfigState, LimitConfig, TierLimit, UserTier } from '../types';
import { useAuthStore } from './authStore';

// Define development mode constant (replace with react-native-dotenv if needed)
const IS_DEVELOPMENT = true; // Set to false for production or use environment config

const API_BASE_URL = 'https://realestatesite-backend.onrender.com/api/v1';

// Create a consistent axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add a request interceptor to include authorization headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/RealEstateUser/refresh-token'
    ) {
      originalRequest._retry = true;
      console.log('401 Unauthorized, attempting to refresh token');

      try {
        const refreshToken = useAuthStore.getState().getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post(
          `${API_BASE_URL}/RealEstateUser/refresh-token`,
          { refreshToken },
          {
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        console.log('Token refreshed successfully:', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(new Error('Session expired, please log in again'));
      }
    }

    const errorDetails = {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };

    if (typeof errorDetails.data === 'string' && errorDetails.data.includes('<html')) {
      const match = errorDetails.data.match(/<pre>(.*?)<\/pre>/s);
      errorDetails.data = match ? match[1] : 'HTML error response';
    }

    console.error('API Error:', errorDetails);
    return Promise.reject(error);
  }
);

// Default configuration with properly typed UserTier values
const defaultLimitConfig: LimitConfig = {
  tiers: [
    {
      id: 'free',
      name: 'Free Tier',
      propertyLimit: 5,
      description: 'Basic account with limited access',
    },
    {
      id: 'standard',
      name: 'Standard Tier',
      propertyLimit: 15,
      description: 'Paid subscription with moderate access',
      price: 499,
    },
    {
      id: 'premium',
      name: 'Premium Tier',
      propertyLimit: 30,
      description: 'Premium subscription with expanded access',
      price: 999,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Tier',
      propertyLimit: 100,
      description: 'Full access for enterprise clients',
      price: 2499,
    },
    {
      id: 'agent',
      name: 'Agent Partnership',
      propertyLimit: 50,
      description: 'For partnered real estate agents',
      price: 1499,
    },
  ],
  showLimitExceededNotice: true,
  allowWaitlist: true,
};

export const useLimitConfigStore = create<LimitConfigState>((set, get) => ({
  limitConfig: defaultLimitConfig,
  isLoading: false,
  error: null,

  fetchLimitConfig: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching limit config from API');

      const response = await apiClient.get<LimitConfig>('/config/property-limits');
      console.log('Fetched limit config:', response.data);
      set({ limitConfig: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch property limit configuration';
      console.error('Error fetching limit config:', error);
      set({ isLoading: false, error: errorMessage });

      if (IS_DEVELOPMENT) {
        console.log('Development mode: Attempting to load from AsyncStorage');
        const savedConfig = await AsyncStorage.getItem('devLimitConfig');
        if (savedConfig) {
          try {
            const parsedConfig: LimitConfig = JSON.parse(savedConfig);
            console.log('Loaded saved config from AsyncStorage:', parsedConfig);
            set({ limitConfig: parsedConfig });
            return parsedConfig;
          } catch (e) {
            console.error('Failed to parse saved config:', e);
          }
        }
      }

      return get().limitConfig;
    }
  },

  updateLimitConfig: async (config: LimitConfig) => {
    try {
      const userRole = useAuthStore.getState().getUserRole();
      console.log('userRole value----->', userRole);
      useAuthStore.getState().debugState();

      if (userRole !== 'admin') {
        throw new Error('Unauthorized: Only admins can update limit configuration');
      }

      set({ isLoading: true, error: null });
      console.log('Updating limit config:', config);

      const response = await apiClient.put<LimitConfig>('/config/property-limits', config);
      console.log('Updated limit config response:', response.data);
      set({ limitConfig: response.data, isLoading: false });

      if (IS_DEVELOPMENT) {
        await AsyncStorage.setItem('devLimitConfig', JSON.stringify(response.data));
        console.log('Development mode: Saved updated config to AsyncStorage');
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message.includes('token failed')
            ? 'Authentication failed: Invalid token'
            : error.message
          : 'Failed to update property limit configuration';
      console.error('Error updating limit config:', error);
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),

  getTierById: (tierId: UserTier) => {
    return get().limitConfig.tiers.find((tier) => tier.id === tierId);
  },

  getUserPropertyLimit: (tierId: UserTier) => {
    const tier = get().getTierById(tierId);
    return tier ? tier.propertyLimit : 0;
  },

  initialize: async () => {
    if (IS_DEVELOPMENT) {
      const savedConfig = await AsyncStorage.getItem('devLimitConfig');
      if (savedConfig) {
        try {
          const parsedConfig: LimitConfig = JSON.parse(savedConfig);
          console.log('Initialized with config from AsyncStorage:', parsedConfig);
          set({ limitConfig: parsedConfig });
          return;
        } catch (e) {
          console.error('Failed to parse saved config:', e);
        }
      }
    }

    await get().fetchLimitConfig();
  },

  initializeFromLocalStorage: async () => {
    if (IS_DEVELOPMENT) {
      const savedConfig = await AsyncStorage.getItem('devLimitConfig');
      if (savedConfig) {
        try {
          const parsedConfig: LimitConfig = JSON.parse(savedConfig);
          console.log('Loaded saved config from AsyncStorage:', parsedConfig);
          set({ limitConfig: parsedConfig });
        } catch (e) {
          console.error('Failed to parse saved config:', e);
        }
      }
    }
  },
}));