import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalStorage } from './storageHelpers.js';

const STORAGE_KEY = 'pokedex-route-overlay-store';

export const useRouteOverlayStore = create(
  persist(
    (set, get) => ({
      // Set of selected route IDs
      selectedRouteIds: new Set(),
      
      // Overlay bounds: position and size
      overlayBounds: {
        x: window.innerWidth - 320,
        y: 100,
        width: 300,
        height: 400,
      },
      
      // Filter mode: 'all' or 'missing' (uncaptured only)
      overlayFilter: 'all',

      // Toggle a route selection
      toggleRoute: (routeId) => {
        const { selectedRouteIds } = get();
        const next = new Set(selectedRouteIds);
        next.has(routeId) ? next.delete(routeId) : next.add(routeId);
        set({ selectedRouteIds: next });
      },

      // Set overlay bounds
      setOverlayBounds: (bounds) => {
        set({ overlayBounds: bounds });
      },

      // Set filter mode
      setOverlayFilter: (filter) => {
        set({ overlayFilter: filter });
      },

      // Toggle filter between 'all' and 'missing'
      toggleOverlayFilter: () => {
        const { overlayFilter } = get();
        set({ overlayFilter: overlayFilter === 'all' ? 'missing' : 'all' });
      },

      // Clear all selected routes
      clearAllRoutes: () => {
        set({ selectedRouteIds: new Set() });
      },

      // Check if a route is selected
      isRouteSelected: (routeId) => {
        return get().selectedRouteIds.has(routeId);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createLocalStorage(),
      partialize: (state) => ({
        selectedRouteIds: state.selectedRouteIds,
        overlayBounds: state.overlayBounds,
        overlayFilter: state.overlayFilter,
      }),
      version: 2,
    }
  )
);