// services/adminService.ts

import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://realestatesite-backend.onrender.com/api';

// Types
export interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'available' | 'sold' | 'rented';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'inactive';
}

export interface Dashboard {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  totalUsers: number;
  activeAgents: number;
  totalPropertyValue: number;
  recentSales: Property[];
  recentActivities: {
    id: string;
    message: string;
    timestamp: Date;
  }[];
}

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin Service
export const AdminService = {
  // Dashboard
  getDashboardData: async (): Promise<Dashboard> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Properties
  getProperties: async (filters?: any): Promise<Property[]> => {
    const response = await api.get('/admin/properties', { params: filters });
    return response.data.map((property: any) => ({
      ...property,
      createdAt: new Date(property.createdAt),
      updatedAt: new Date(property.updatedAt),
    }));
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/admin/properties/${id}`);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  },

  createProperty: async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
    const response = await api.post('/admin/properties', property);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  },

  updateProperty: async (id: string, property: Partial<Property>): Promise<Property> => {
    const response = await api.put(`/admin/properties/${id}`, property);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/admin/properties/${id}`);
  },

  // Users
  getUsers: async (filters?: any): Promise<User[]> => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    }));
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const response = await api.post('/admin/users', user);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, user);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  // Agents
  getAgents: async (filters?: any): Promise<Agent[]> => {
    const response = await api.get('/admin/agents', { params: filters });
    return response.data;
  },

  getAgent: async (id: string): Promise<Agent> => {
    const response = await api.get(`/admin/agents/${id}`);
    return response.data;
  },

  createAgent: async (agent: Omit<Agent, 'id'>): Promise<Agent> => {
    const response = await api.post('/admin/agents', agent);
    return response.data;
  },

  updateAgent: async (id: string, agent: Partial<Agent>): Promise<Agent> => {
    const response = await api.put(`/admin/agents/${id}`, agent);
    return response.data;
  },

  deleteAgent: async (id: string): Promise<void> => {
    await api.delete(`/admin/agents/${id}`);
  },

  // Settings
  getSettings: async (): Promise<any> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings: any): Promise<any> => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  // Authentication
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },

  // File Upload
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export default AdminService;