import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalStorage } from './storageHelpers.js';

const STORAGE_KEY = 'pokedex-badges-store';
const LEGACY_KEY = 'pokedex-badges';

export const useBadgeStore = create(
  persist(
    (set, get) => ({
      badges: new Set(),

      toggle: (id) => {
        const next = new Set(get().badges);
        next.has(id) ? next.delete(id) : next.add(id);
        set({ badges: next });
      },

      hasBadge: (id) => get().badges.has(id),

      importBadges: (importedBadges) => {
        const next = new Set(get().badges);
        importedBadges.forEach((id) => next.add(id));
        set({ badges: next });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createLocalStorage(),
      partialize: (state) => ({ badges: state.badges }),
      version: 1,
      migrate: (persisted, _version) => {
        // If no persisted data, try loading from legacy key
        if (!persisted || !persisted.badges?.size) {
          try {
            const legacy = localStorage.getItem(LEGACY_KEY);
            if (legacy) {
              const badges = new Set(JSON.parse(legacy));
              localStorage.removeItem(LEGACY_KEY);
              return { badges };
            }
          } catch {
            // ignore
          }
        }
        return persisted || { badges: new Set() };
      },
    }
  )
);