import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalStorage } from './storageHelpers.js';

const STORAGE_KEY = 'pokedex-milestones-store';

export const useMilestonesStore = create(
  persist(
    (set, get) => ({
      celebrated: new Set(),

      markCelebrated: (milestone) => {
        const next = new Set(get().celebrated);
        next.add(milestone);
        set({ celebrated: next });
      },

      hasCelebrated: (milestone) => get().celebrated.has(milestone),
    }),
    {
      name: STORAGE_KEY,
      storage: createLocalStorage(),
      partialize: (state) => ({ celebrated: state.celebrated }),
      version: 1,
    }
  )
);