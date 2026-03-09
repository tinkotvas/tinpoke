import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalStorage } from './storageHelpers.js';

const STORAGE_KEY = 'pokedex-filters-store';
const LEGACY_KEY = 'pokemon-filters';

export const useFilterStore = create(
  persist(
    (set) => ({
      filter: 'pokedex',
      setFilter: (filter) => set({ filter }),

      statusFilter: 'all',
      setStatusFilter: (statusFilter) => set({ statusFilter }),

      sortBy: 'dex',
      setSortBy: (sortBy) => set({ sortBy }),

      selectedTypes: new Set(),
      setSelectedTypes: (selectedTypes) => set({ selectedTypes }),

      showFilters: false,
      setShowFilters: (showFilters) => set({ showFilters }),

      // Route expansion state (persisted for UX continuity)
      expandedRoutes: [],
      setExpandedRoutes: (expandedRoutes) => set({ expandedRoutes }),

      expandedSpecial: [],
      setExpandedSpecial: (expandedSpecial) => set({ expandedSpecial }),
    }),
    {
      name: STORAGE_KEY,
      storage: createLocalStorage(),
      partialize: (state) => ({
        filter: state.filter,
        statusFilter: state.statusFilter,
        sortBy: state.sortBy,
        selectedTypes: state.selectedTypes,
        expandedRoutes: state.expandedRoutes,
        expandedSpecial: state.expandedSpecial,
      }),
      version: 2,
      migrate: (persisted, version) => {
        // Try to migrate from old key
        if (!persisted || version < 2) {
          try {
            const legacy = localStorage.getItem(LEGACY_KEY);
            if (legacy) {
              const parsed = JSON.parse(legacy);
              const state = parsed.state || parsed;
              return {
                filter: state.filter || 'pokedex',
                statusFilter: state.statusFilter || 'all',
                sortBy: state.sortBy || 'dex',
                selectedTypes: state.selectedTypes ? new Set(state.selectedTypes) : new Set(),
                expandedRoutes: [],
                expandedSpecial: [],
              };
            }
          } catch {
            // ignore
          }
        }
        return persisted || {
          filter: 'pokedex',
          statusFilter: 'all',
          sortBy: 'dex',
          selectedTypes: new Set(),
          expandedRoutes: [],
          expandedSpecial: [],
        };
      },
    }
  )
);