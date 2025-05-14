// src/types/index.ts
// export interface User {
//   _id: string;
//   fullName: string;
//   email: string;
//   contactNumber: number;
//   role: 'buyer' | 'seller' | 'agent' | 'admin';
//   isVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
// }




export interface TierLimit {
  id: UserTier;
  name: string;
  propertyLimit: number;
  description: string;
  price?: number;
}

export interface LimitConfig {
  tiers: TierLimit[];
  showLimitExceededNotice: boolean;
  allowWaitlist: boolean;
}

export interface LimitConfigState {
  limitConfig: LimitConfig;
  isLoading: boolean;
  error: string | null;
  fetchLimitConfig: () => Promise<LimitConfig>;
  updateLimitConfig: (config: LimitConfig) => Promise<LimitConfig>;
  clearError: () => void;
  getTierById: (tierId: UserTier) => TierLimit | undefined;
  getUserPropertyLimit: (tierId: UserTier) => number;
  initializeFromLocalStorage: () => void;
  initialize: () => Promise<void>;
}
// src/types/user.ts or similar file
export type RootStackParamList = {
  // Authentication screens
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  
  // Main screens
  Index: undefined;
  PropertyListings: undefined;
  PropertyDetails: { id: string } | undefined;
  PropertyDetailPage: { id: string };
  UserDashboard: undefined;
  Contact: undefined;
  AboutUs: undefined;
  SearchBox: undefined;
  
  // Property related screens
  Property: { id: string };
  IndividualProperty: { id: string };
  AddProperty: undefined;
  EditProperty: { id: string };
  
  // Dashboard screens
  BuyerDashboard: undefined;
  SellerDashboard: undefined;
  AgentDashboard: undefined;
  Admin: undefined;
  
  // Admin dashboard tabs
  Properties: undefined;
  Users: undefined;
  BuyerTierLimit: undefined;
  Settings: undefined;
  
  // Account related
  Profile: undefined;
  UpgradeTier: undefined;
  
  // Error screens
  NotFound: undefined;
};

export interface Notification {
  id: number;
  message: string;
  read: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  tier: UserTier;
  status: 'pending' | 'active' | 'inactive'; // Add this line
}


export interface Property {
  _id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number | string;
  type: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area?: number;
    parking: boolean;
    furnished: boolean;
  };
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  images?: Array<{ uri: string; type: string; name: string } | string>;
  status: string;
  isNew?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  approval?: string;
  createdAt?: string; 
}

export interface PropertyView {
  propertyId: string;
  viewedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  contactNumber: number;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
export interface LimitConfig {
  tiers: TierLimit[];
  showLimitExceededNotice: boolean;
  allowWaitlist: boolean;
}

// export interface LimitConfigState {
//   limitConfig: {
//     tiers: Array<{
//       id: string;
//       name: string;
//       propertyLimit: number;
//       description: string;
//       price?: number;
//     }>;
//     showLimitExceededNotice: boolean;
//     allowWaitlist: boolean;
//   };
//   isLoading: boolean;
//   error: string | null;
//   fetchLimitConfig: () => Promise<void>;
//   updateLimitConfig: (config: LimitConfig) => Promise<LimitConfig>;
//   clearError: () => void;
//   getTierById: (tierId: string) => { id: string; name: string; propertyLimit: number; description: string; price?: number } | undefined;
// }

export interface LimitConfigState {
  limitConfig: LimitConfig;
  isLoading: boolean;
  error: string | null;
  fetchLimitConfig: () => Promise<LimitConfig>;
  updateLimitConfig: (config: LimitConfig) => Promise<LimitConfig>;
  clearError: () => void;
  getTierById: (tierId: UserTier) => TierLimit | undefined;
  getUserPropertyLimit: (tierId: UserTier) => number;
  initializeFromLocalStorage: () => void;
  initialize: () => Promise<void>;
}

export type UserTier = 'free' | 'standard' | 'premium' | 'enterprise' | 'agent';

export interface TierLimit {
  id: UserTier;
  name: string;
  propertyLimit: number;
  description: string;
  price?: number;
}


// Individual tier definition
export interface Tier {
  id: UserTier;
  name: string;
  description: string;
  price?: number; // Optional for free tier
}

// Overall tier configuration object
export interface TierConfig {
  tiers: Tier[];
}

// Zustand store state for the tier system
export interface TierState {
  tierConfig: TierConfig;
  isLoading: boolean;
  error: string | null;
  currentUserTier: UserTier | null;
  
  // CRUD operations for tier configuration
  fetchTierConfig: () => Promise<TierConfig>;
  updateTierConfig: (config: TierConfig) => Promise<TierConfig>;
  
  // User tier management
  fetchCurrentUserTier: () => Promise<UserTier | null>;
  updateUserTier: (userId: string, newTier: UserTier) => Promise<{ success: boolean, message: string }>;
  upgradeUserTier: (newTier: UserTier, paymentDetails: any) => Promise<{ success: boolean, tier: UserTier }>;
  
  // Helper methods
  getTierById: (tierId: UserTier) => Tier | undefined;
  clearError: () => void;
  initialize: () => Promise<void>;
  initializeFromLocalStorage: () => void;
}