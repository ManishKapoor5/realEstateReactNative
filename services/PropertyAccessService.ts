// // Interfaces for type definitions
// export interface BuyerTier {
//   id: string;
//   name: string;
//   propertyLimit: number;
//   description: string;
// }

// export interface PropertyLimitConfig {
//   buyerTiers: BuyerTier[];
//   showLimitExceededNotice: boolean;
//   allowWaitlist: boolean;
// }

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   tierId: string;
//   viewedProperties: string[];
// }

// export interface Property {
//   id: string;
//   address: string;
//   price: number;
//   bedrooms: number;
//   bathrooms: number;
//   sqft: number;
//   imageUrl: string;
//   favorite: boolean;
//   status: 'available' | 'pending' | 'sold';
// }

// // Simulated API service to handle data persistence
// class PropertyAccessService {
//   // In-memory storage for demo purposes
//   private static config: PropertyLimitConfig = {
//     buyerTiers: [
//       { id: 'free', name: 'Free Tier', propertyLimit: 5, description: 'Basic account with limited access' },
//       { id: 'standard', name: 'Standard Tier', propertyLimit: 15, description: 'Paid subscription with moderate access' },
//       { id: 'premium', name: 'Premium Tier', propertyLimit: 30, description: 'Premium subscription with expanded access' },
//       { id: 'enterprise', name: 'Enterprise Tier', propertyLimit: 100, description: 'Full access for enterprise clients' },
//       { id: 'agent', name: 'Agent Partnership', propertyLimit: 50, description: 'For partnered real estate agents' },
//     ],
//     showLimitExceededNotice: true,
//     allowWaitlist: true,
//   };

//   private static currentUser: User = {
//     id: 'user123',
//     name: 'John Doe',
//     email: 'john@example.com',
//     tierId: 'free',
//     viewedProperties: [],
//   };

//   // Sample properties data
//   private static properties: Property[] = Array.from({ length: 50 }, (_, i) => ({
//     id: `prop-${i + 1}`,
//     address: `${i + 100} Main Street, City ${i % 10 + 1}`,
//     price: 200000 + (i * 25000),
//     bedrooms: (i % 3) + 2,
//     bathrooms: (i % 2) + 1.5,
//     sqft: 1000 + (i * 100),
//     imageUrl: `/api/placeholder/400/320`,
//     favorite: i % 7 === 0,
//     status: i % 10 === 0 ? 'sold' : i % 5 === 0 ? 'pending' : 'available',
//   }));

//   // Get configuration
//   static async getConfig(): Promise<PropertyLimitConfig> {
//     // Simulate API delay
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(this.config), 300);
//     });
//   }

//   // Save configuration
//   static async saveConfig(config: PropertyLimitConfig): Promise<PropertyLimitConfig> {
//     // Validate configuration
//     if (config.buyerTiers.some((tier) => tier.propertyLimit === 0 || tier.propertyLimit > 500)) {
//       throw new Error('Property limits must be between 1 and 500');
//     }

//     // Simulate API delay
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         this.config = config;
//         resolve(this.config);
//       }, 500);
//     });
//   }

//   // Get current user
//   static async getCurrentUser(): Promise<User> {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(this.currentUser), 300);
//     });
//   }

//   // Get user's tier
//   static async getUserTier(): Promise<BuyerTier | undefined> {
//     const user = await this.getCurrentUser();
//     const config = await this.getConfig();
//     return config.buyerTiers.find((tier) => tier.id === user.tierId);
//   }

//   // Get properties with access control
//   static async getProperties(): Promise<{
//     properties: Property[];
//     totalAvailable: number;
//     userLimit: number;
//     limitReached: boolean;
//   }> {
//     const user = await this.getCurrentUser();
//     const userTier = await this.getUserTier();

//     if (!userTier) {
//       throw new Error('User tier not found');
//     }

//     // Apply limit based on user tier
//     const propertyLimit = userTier.propertyLimit;
//     const accessibleProperties = this.properties.slice(0, propertyLimit);

//     return {
//       properties: accessibleProperties,
//       totalAvailable: this.properties.length,
//       userLimit: propertyLimit,
//       limitReached: accessibleProperties.length < this.properties.length,
//     };
//   }

//   // Track property view
//   static async trackPropertyView(propertyId: string): Promise<boolean> {
//     // In a real app, this would track which properties a user has viewed
//     if (!this.currentUser.viewedProperties.includes(propertyId)) {
//       this.currentUser.viewedProperties.push(propertyId);
//     }
//     return true;
//   }

//   // Join waitlist for more properties
//   static async joinWaitlist(email: string): Promise<boolean> {
//     // In a real app, this would add the user to a waitlist
//     console.log(`Adding ${email} to property waitlist`);
//     return true;
//   }

//   // For testing: update current user's tier
//   static async updateUserTier(tierId: string): Promise<User> {
//     this.currentUser.tierId = tierId;
//     return this.currentUser;
//   }

//   // Toggle favorite status for a property
//   static async toggleFavorite(propertyId: string): Promise<boolean> {
//     const property = this.properties.find((prop) => prop.id === propertyId);
//     if (!property) {
//       throw new Error('Property not found');
//     }
//     property.favorite = !property.favorite;
//     return property.favorite;
//   }
// }

// export default PropertyAccessService;

// import axiosInstance from './axiosInstance';

// export interface Property {
//   id: string;
//   address: string;
//   price: number;
//   bedrooms: number;
//   bathrooms: number;
//   sqft: number;
//   imageUrl?: string;
//   status?: 'available' | 'pending' | 'sold';
//   favorite?: boolean;
// }

// export interface User {
//   id: string;
//   email: string;
//   role: string;
// }

// export interface Tier {
//   id: string;
//   name: string;
//   propertyLimit: number;
// }

// class PropertyAccessService {
//   async getProperties(): Promise<{
//     properties: Property[];
//     totalAvailable: number;
//     userLimit: number;
//     limitReached: boolean;
//   }> {
//     const response = await axiosInstance.get('/properties');
//     return {
//       properties: response.data.properties || [],
//       totalAvailable: response.data.totalAvailable || 0,
//       userLimit: response.data.userLimit || 0,
//       limitReached: response.data.limitReached || false
//     };
//   }

//   async getPropertyById(id: string): Promise<Property> {
//     const response = await axiosInstance.get(`/properties/${id}`);
//     return response.data.property;
//   }

//   async getUserData(): Promise<{
//     user: User;
//     tier: Tier;
//   }> {
//     const response = await axiosInstance.get('/users/me');
//     return {
//       user: response.data.user,
//       tier: response.data.tier
//     };
//   }

//   async trackPropertyView(propertyId: string): Promise<void> {
//     await axiosInstance.post('/properties/track-view', { propertyId });
//   }

//   async toggleFavorite(propertyId: string): Promise<{ success: boolean }> {
//     const response = await axiosInstance.post('/properties/toggle-favorite', { propertyId });
//     return {
//       success: response.data.success
//     };
//   }

//   async joinWaitlist(email: string): Promise<{ success: boolean }> {
//     const response = await axiosInstance.post('/waitlist/join', { email });
//     return {
//       success: response.data.success
//     };
//   }
// }

// export default new PropertyAccessService();

// src/services/PropertyAccessService.ts
import axios from 'axios';

// Define the Property interface
export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl?: string;
  status: 'available' | 'pending' | 'sold';
  favorite: boolean;
}

// Define the Inquiry interface
export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  propertyId: {
    id: string;
    title: string;
  };
  message: string;
  createdAt: string;
  status: string;
}

// Base API URL - update this to match your environment
const API_URL = 'https://realestatesite-backend.onrender.com/api/v1';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const PropertyAccessService = {
  // Get properties with pagination
  async getProperties(page = 1, limit = 20) {
    const response = await api.get(`/properties?page=${page}&limit=${limit}`);
    return {
      properties: response.data.properties,
      totalAvailable: response.data.totalAvailable,
      userLimit: response.data.userLimit,
      limitReached: response.data.limitReached,
    };
  },

  // Track property view
  async trackPropertyView(propertyId: string) {
    return api.post('/properties/track-view', { propertyId });
  },

  // Toggle property favorite status
  async toggleFavorite(propertyId: string) {
    return api.post('/properties/toggle-favorite', { propertyId });
  },

  // Join waitlist
  async joinWaitlist(email: string) {
    return api.post('/waitlist/join', { email });
  },

  // Get buyer inquiries
  async getBuyerInquiries() {
    const response = await api.get('/inquiries');
    return {
      inquiries: response.data.inquiries,
    };
  },

  // Update inquiry status
  async updateInquiryStatus(inquiryId: string, status: string) {
    return api.put(`/inquiries/${inquiryId}/status`, { status });
  },

  // Submit new inquiry
  async submitInquiry(inquiryData: {
    propertyId: string;
    fullName: string;
    email: string;
    contactNumber: string;
    message: string;
  }) {
    return api.post('/inquiries', inquiryData);
  },
};

export default PropertyAccessService;