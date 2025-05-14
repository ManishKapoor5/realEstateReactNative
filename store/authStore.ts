import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  _id: string;
  fullName?: string;
  email: string;
  contactNumber: string | number;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  tier: UserTier;
  status?: 'pending' | 'active' | 'inactive';
}

export type UserTier = 'free' | 'standard' | 'premium' | 'enterprise' | 'agent';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
  getUserRole: () => string | null;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  debugState: () => void;
}

interface PersistedAuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const persistOptions: PersistOptions<AuthState, PersistedAuthState> = {
  name: 'auth-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }),
  onRehydrateStorage: () => (state) => {
    if (state && !state.accessToken) {
      state.isAuthenticated = false;
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (accessToken, refreshToken, user) => {
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: !!accessToken,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        });
      },

      setAccessToken: (accessToken) => {
        set({ accessToken, isAuthenticated: !!accessToken });
      },

      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },

      logout: async () => {
        try {
          await AsyncStorage.removeItem('auth-storage');
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },

      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },

      getAccessToken: () => get().accessToken,

      getRefreshToken: () => get().refreshToken,

      debugState: () => {
        const state = get();
        console.log('Auth Store State:', JSON.stringify(state, null, 2));
      },
    }),
    persistOptions
  )
);

export const initializeAuth = async () => {
  try {
    const { accessToken, user } = useAuthStore.getState();
    if (accessToken && user) {
      useAuthStore.setState({ isAuthenticated: true });
    } else {
      useAuthStore.setState({ isAuthenticated: false });
    }
  } catch (error) {
    console.error('Error initializing auth store:', error);
    useAuthStore.setState({ isAuthenticated: false });
  }
};