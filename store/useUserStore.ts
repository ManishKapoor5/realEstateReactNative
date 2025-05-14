// import { create } from 'zustand';
// import axios from 'axios';
// import { UserTier } from '../types';
// import { useAuthStore } from '@/store/authStore';
// import axiosBuyerInstance from '@/services/axiosBuyerInstance';

// interface UserTierState {
//   currentTier: UserTier;
//   requestedTier: UserTier | null;
//   isLoading: boolean;
//   error: string | null;
  
//   // Fetch current user tier from API
//   fetchUserTier: () => Promise<UserTier>;
  
//   // Request tier upgrade for the current user
//   requestTierUpgrade: (newTier: UserTier, paymentMethod?: string) => Promise<boolean>;
  
//   // Admin functions to approve tier changes
//   approveTierChange: (userId: string, newTier: UserTier) => Promise<boolean>;
  
//   // Cancel pending tier upgrade request
//   cancelTierRequest: () => Promise<boolean>;
  
//   // Get eligible tier upgrades for current user
//   getEligibleTierUpgrades: () => Promise<UserTier[]>;
  
//   // Clear error state
//   clearError: () => void;
// }

// const API_BASE_URL = process.env.NODE_ENV === 'development'
//   ? 'https://realestatesite-backend.onrender.com/api'
//   : '/api';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });

// // Get authentication headers from authStore
// const getAuthHeaders = () => {
//   const token = useAuthStore.getState().getAccessToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // Refresh token using authStore
// const refreshAccessToken = async () => {
//   try {
//     const refreshToken = useAuthStore.getState().getRefreshToken();
//     if (!refreshToken) {
//       throw new Error('No refresh token available');
//     }
    
//     const response = await apiClient.post('/v1/RealEstateUser/refresh-token', { refreshToken });
//     const { accessToken, refreshToken: newRefreshToken } = response.data;
//     useAuthStore.getState().setTokens(accessToken, newRefreshToken);
//     return accessToken;
//   } catch (error) {
//     console.error('Failed to refresh token:', error);
//     useAuthStore.getState().logout();
//     throw new Error('Session expired, please log in again');
//   }
// };

// // Handle API request with token refresh on 401
// const secureApiRequest = async (requestFn) => {
//   try {
//     return await requestFn();
//   } catch (error) {
//     if (error.response?.status === 401) {
//       await refreshAccessToken();
//       return await requestFn(); // Retry with new token
//     }
//     throw error;
//   }
// };

// export const useUserTierStore = create<UserTierState>((set, get) => ({
//   currentTier: 'free' as UserTier, // Default to free tier
//   requestedTier: null,
//   isLoading: false,
//   error: null,
  
//   fetchUserTier: async () => {
//     try {
//       set({ isLoading: true, error: null });
      
//       const response = await secureApiRequest(() => 
//         axiosBuyerInstance.get<{ tier: UserTier }>('/v1/user/tier', {
//           headers: getAuthHeaders()
//         })
//       );
      
//       set({ 
//         currentTier: response.data.tier, 
//         isLoading: false 
//       });
      
//       return response.data.tier;
//     } catch (error) {
//       const errorMessage = error instanceof Error 
//         ? error.message 
//         : 'Failed to fetch user tier information';
      
//       console.error('Error fetching user tier:', error);
//       set({ isLoading: false, error: errorMessage });
      
//       // Return current tier as fallback
//       return get().currentTier;
//     }
//   },
  
//   requestTierUpgrade: async (newTier: UserTier, paymentMethod?: string) => {
//     try {
//       set({ isLoading: true, error: null });
      
//       // Prepare request payload
//       const payload = {
//         requestedTier: newTier,
//         paymentMethod: paymentMethod || 'default'
//       };
      
//       const response = await secureApiRequest(() =>
//         axiosBuyerInstance.post('/v1/user/tier/request', payload, {
//           headers: getAuthHeaders()
//         })
//       );
      
//       set({ 
//         requestedTier: newTier, 
//         isLoading: false 
//       });
      
//       return true;
//     } catch (error) {
//       const errorMessage = error instanceof Error 
//         ? error.message 
//         : 'Failed to request tier upgrade';
      
//       console.error('Error requesting tier upgrade:', error);
//       set({ isLoading: false, error: errorMessage });
      
//       return false;
//     }
//   },
  
//   approveTierChange: async (userId: string, newTier: UserTier) => {
//     try {
//       const userRole = useAuthStore.getState().getUserRole();
      
//       if (userRole !== 'admin') {
//         throw new Error('Unauthorized: Only admins can approve tier changes');
//       }
      
//       set({ isLoading: true, error: null });
      
//       const response = await secureApiRequest(() =>
//         axiosBuyerInstance.post('/admin/users/tier/approve', {
//           userId,
//           newTier
//         }, {
//           headers: getAuthHeaders()
//         })
//       );
      
//       set({ isLoading: false });
      
//       return true;
//     } catch (error) {
//       const errorMessage = error instanceof Error 
//         ? error.message 
//         : 'Failed to approve tier change';
      
//       console.error('Error approving tier change:', error);
//       set({ isLoading: false, error: errorMessage });
      
//       return false;
//     }
//   },
  
//   cancelTierRequest: async () => {
//     try {
//       if (!get().requestedTier) {
//         return true; // No pending request to cancel
//       }
      
//       set({ isLoading: true, error: null });
      
//       await secureApiRequest(() =>
//         axiosBuyerInstance.delete('/v1/user/tier/request', {
//           headers: getAuthHeaders()
//         })
//       );
      
//       set({ 
//         requestedTier: null, 
//         isLoading: false 
//       });
      
//       return true;
//     } catch (error) {
//       const errorMessage = error instanceof Error 
//         ? error.message 
//         : 'Failed to cancel tier upgrade request';
      
//       console.error('Error canceling tier request:', error);
//       set({ isLoading: false, error: errorMessage });
      
//       return false;
//     }
//   },
  
//   getEligibleTierUpgrades: async () => {
//     try {
//       set({ isLoading: true, error: null });
      
//       const response = await secureApiRequest(() =>
//         axiosBuyerInstance.get<{ eligibleTiers: UserTier[] }>('/v1/user/tier/eligible', {
//           headers: getAuthHeaders()
//         })
//       );
      
//       set({ isLoading: false });
      
//       return response.data.eligibleTiers;
//     } catch (error) {
//       const errorMessage = error instanceof Error 
//         ? error.message 
//         : 'Failed to fetch eligible tier upgrades';
      
//       console.error('Error fetching eligible tiers:', error);
//       set({ isLoading: false, error: errorMessage });
      
//       return []; // Return empty array as fallback
//     }
//   },
  
//   clearError: () => set({ error: null })
// }));