import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/axiosInstance';

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
  propertiesCount?: number;
  properties: number;
  rating: number;
  status: 'active' | 'inactive';
}

interface AgentState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  
  fetchAgents: () => Promise<void>;
  addAgent: (agent: Omit<Agent, '_id'>) => Promise<void>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  getAgents: () => Agent[];
  getAgentById: (id: string) => Agent | undefined;
  getIsLoading: () => boolean;
  getError: () => string | null;
  debugState: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [],
      isLoading: false,
      error: null,

      fetchAgents: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get('/agents');
          set({ agents: response.data.data || [], isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch agents';
          set({ error: errorMessage, isLoading: false });
        }
      },

      addAgent: async (agent) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post('/agents', agent);
          set((state) => ({
            agents: [...state.agents, response.data.data],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add agent';
          set({ error: errorMessage, isLoading: false });
        }
      },

      updateAgent: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.put(`/agents/${id}`, updates);
          set((state) => ({
            agents: state.agents.map((agent) =>
              agent._id === id ? response.data.data : agent
            ),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update agent';
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteAgent: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete(`/agents/${id}`);
          set((state) => ({
            agents: state.agents.filter((agent) => agent._id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete agent';
          set({ error: errorMessage, isLoading: false });
        }
      },

      getAgents: () => get().agents,

      getAgentById: (id) => get().agents.find((agent) => agent._id === id),

      getIsLoading: () => get().isLoading,

      getError: () => get().error,

      debugState: () => {
        const state = get();
        console.log('Agent Store State:', JSON.stringify(state, null, 2));
      },
    }),
    {
      name: 'agent-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        agents: state.agents,
      }),
    }
  )
);

export const initializeAgentStore = async () => {
  const { agents, fetchAgents } = useAgentStore.getState();

  if (!agents || agents.length === 0) {
    try {
      await fetchAgents();
    } catch (error) {
      console.error('Failed to initialize agent store:', error);
    }
  }
};