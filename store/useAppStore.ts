import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  currentUser: User | null;
  currentTier: string;
  loadData: () => void;
  setCurrentUser: (user: User) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  currentTier: '',
  loadData: () => {
    // Simulate loading logic
    console.log('Loading data...');
    set({ currentTier: 'Gold' });
  },
  setCurrentUser: (user) => set({ currentUser: user }),
}));
