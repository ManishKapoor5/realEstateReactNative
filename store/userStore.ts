// src/stores/userStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface UserState {
  realestateusers: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

// Mock API function
const mockFetchUsers = async (): Promise<User[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@legacyland.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2024-12-01')
    },
    {
      id: '2',
      name: 'Ankit Joshi',
      email: 'ankit@example.com',
      role: 'buyer',
      status: 'active',
      createdAt: new Date('2025-04-15')
    },
    {
      id: '3',
      name: 'Neha Verma',
      email: 'neha@example.com',
      role: 'agent',
      status: 'active',
      createdAt: new Date('2025-03-10')
    },
    {
      id: '4',
      name: 'Suresh Reddy',
      email: 'suresh@example.com',
      role: 'agent',
      status: 'active',
      createdAt: new Date('2025-04-19')
    }
  ];
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        realestateusers: [],
        isLoading: false,
        error: null,

        fetchUsers: async () => {
          set({ isLoading: true, error: null });
          try {
            const realestateusers = await mockFetchUsers();
            set({ realestateusers, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
          }
        },

        addUser: async (user) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const newUser: User = {
              ...user,
              id: Date.now().toString(),
              createdAt: new Date()
            };
            
            set(state => ({
              users: [...state.realestateusers, newUser],
              isLoading: false
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
          }
        },

        updateUser: async (id, updates) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            set(state => ({
              users: state.realestateusers.map(user => 
                user.id === id ? { ...user, ...updates } : user
              ),
              isLoading: false
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
          }
        },

        deleteUser: async (id) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            set(state => ({
              users: state.realestateusers.filter(user => user.id !== id),
              isLoading: false
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
          }
        }
      }),
      {
        name: 'user-storage'
      }
    )
  )
);