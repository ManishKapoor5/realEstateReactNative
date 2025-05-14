import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PropertyView {
  propertyId: string;
  viewedAt: Date;
}

interface Property {
  _id: string;
  createdAt?: string;
}

interface PropertyStore {
  viewedProperties: PropertyView[];
  favoriteProperties: string[];
  addViewedProperty: (propertyId: string) => void;
  addFavoriteProperty: (propertyId: string) => void;
  removeFavoriteProperty: (propertyId: string) => void;
  setViewedProperties: (properties: PropertyView[]) => void;
  setFavoriteProperties: (favorites: string[]) => void;
  reset: () => void;
  isFavorite: (propertyId: string) => boolean;
  debugState: () => void;
}

const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      viewedProperties: [],
      favoriteProperties: [],

      addViewedProperty: (propertyId) => {
        set((state) => {
          const exists = state.viewedProperties.some(
            (view) => view.propertyId === propertyId
          );
          if (exists) {
            return state; // Avoid duplicates
          }
          return {
            viewedProperties: [
              { propertyId, viewedAt: new Date() },
              ...state.viewedProperties,
            ],
          };
        });
      },

      addFavoriteProperty: (propertyId) => {
        set((state) => {
          if (state.favoriteProperties.includes(propertyId)) {
            return state; // Avoid duplicates
          }
          return {
            favoriteProperties: [...state.favoriteProperties, propertyId],
          };
        });
      },

      removeFavoriteProperty: (propertyId) => {
        set((state) => ({
          favoriteProperties: state.favoriteProperties.filter(
            (id) => id !== propertyId
          ),
        }));
      },

      setViewedProperties: (properties) => {
        set({ viewedProperties: properties });
      },

      setFavoriteProperties: (favorites) => {
        set({ favoriteProperties: favorites });
      },

      reset: () => {
        set({ viewedProperties: [], favoriteProperties: [] });
      },

      isFavorite: (propertyId) => {
        return get().favoriteProperties.includes(propertyId);
      },

      debugState: () => {
        const state = get();
        console.log('Property Store State:', JSON.stringify(state, null, 2));
      },
    }),
    {
      name: 'property-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        viewedProperties: state.viewedProperties.map((view) => ({
          propertyId: view.propertyId,
          viewedAt: view.viewedAt.toISOString(),
        })),
        favoriteProperties: state.favoriteProperties,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.viewedProperties) {
          state.viewedProperties = state.viewedProperties.map((view) => ({
            ...view,
            viewedAt: new Date(view.viewedAt),
          }));
        }
      },
    }
  )
);

export default usePropertyStore;