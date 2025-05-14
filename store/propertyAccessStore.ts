// import { create } from 'zustand';
// import PropertyAccessService, {
//   User,
//   BuyerTier,
//   PropertyLimitConfig,
// } from '@/services/PropertyAccessService';

// export interface PropertyAccessState {
//   config: PropertyLimitConfig | null;
//   currentUser: User | null;
//   currentTier: BuyerTier | null;
//   isLoading: boolean;
//   error: string | null;
//   loadData: () => Promise<void>;
//   saveConfig: (config: PropertyLimitConfig) => Promise<void>;
//   refreshConfig: () => Promise<void>;
//   updateUserTier: (tierId: string) => Promise<void>;
// }

// export const usePropertyAccessStore = create<PropertyAccessState>((set, get) => ({
//   config: null,
//   currentUser: null,
//   currentTier: null,
//   isLoading: false,
//   error: null,

//   loadData: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const [configData, userData] = await Promise.all([
//         PropertyAccessService.getConfig(),
//         PropertyAccessService.getCurrentUser(),
//       ]);

//       const userTier = configData.buyerTiers.find(
//         (tier) => tier.id === userData.tierId
//       ) || null;

//       set({
//         config: configData,
//         currentUser: userData,
//         currentTier: userTier,
//       });
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : 'Failed to load configuration data';
//       console.error('Error loading data:', err);
//       set({ error: errorMessage });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   saveConfig: async (newConfig: PropertyLimitConfig) => {
//     set({ isLoading: true, error: null });
//     try {
//       const updatedConfig = await PropertyAccessService.saveConfig(newConfig);
//       const { currentUser } = get();

//       const updatedTier = currentUser
//         ? updatedConfig.buyerTiers.find((tier) => tier.id === currentUser.tierId) || null
//         : null;

//       set({
//         config: updatedConfig,
//         currentTier: updatedTier,
//       });
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : 'Failed to save configuration';
//       console.error('Error saving config:', err);
//       set({ error: errorMessage });
//       throw err; // Rethrow for component-level error handling
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   refreshConfig: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const configData = await PropertyAccessService.getConfig();
//       const { currentUser } = get();

//       const userTier = currentUser
//         ? configData.buyerTiers.find((tier) => tier.id === currentUser.tierId) || null
//         : null;

//       set({
//         config: configData,
//         currentTier: userTier,
//       });
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : 'Failed to refresh configuration';
//       console.error('Error refreshing config:', err);
//       set({ error: errorMessage });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   updateUserTier: async (tierId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       const updatedUser = await PropertyAccessService.updateUserTier(tierId);
//       const { config } = get();

//       const updatedTier = config
//         ? config.buyerTiers.find((tier) => tier.id === tierId) || null
//         : null;

//       set({
//         currentUser: updatedUser,
//         currentTier: updatedTier,
//       });
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : 'Failed to update user tier';
//       console.error('Error updating user tier:', err);
//       set({ error: errorMessage });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));

// import { create } from 'zustand';
// import PropertyAccessService, { User, Tier } from '../services/PropertyAccessService';

// export interface PropertyAccessState {
//   currentUser: User | null;
//   currentTier: Tier | null;
//   isLoading: boolean;
//   error: string | null;
//   loadData: () => Promise<void>;
//   clearError: () => void;
// }

// export const usePropertyAccessStore = create<PropertyAccessState>((set) => ({
//   currentUser: null,
//   currentTier: null,
//   isLoading: false,
//   error: null,
  
//   loadData: async () => {
//     set({ isLoading: true, error: null });
    
//     try {
//       const { user, tier } = await PropertyAccessService.getUserData();
//       set({ currentUser: user, currentTier: tier });
//     } catch (err: any) {
//       console.error('Failed to load user data:', err);
//       set({ error: err.message || 'Failed to load user data' });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
  
//   clearError: () => set({ error: null })
// }));

import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface Tier {
  id: string;
  name: string;
  propertyLimit: number;
  price: number;
}

interface PropertyAccessState {
  currentUser: User | null;
  currentTier: Tier | null;
  isLoading: boolean;
  error: string | null;

  loadData: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  setCurrentTier: (tier: Tier | null) => void;
  setError: (error: string | null) => void;
}

export const usePropertyAccessStore = create<PropertyAccessState>((set) => ({
  currentUser: null,
  currentTier: null,
  isLoading: false,
  error: null,

  loadData: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        set({ currentUser: null, currentTier: null, isLoading: false });
        return;
      }

      const response = await fetch('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const userData = await response.json();

      set({
        currentUser: userData.user || null,
        currentTier: userData.tier || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Failed to load user data:', message);
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentTier: (tier) => set({ currentTier: tier }),
  setError: (error) => set({ error }),
}));
