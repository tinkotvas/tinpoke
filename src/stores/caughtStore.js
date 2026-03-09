import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalStorage } from './storageHelpers.js';

const STORAGE_KEY = 'pokedex-caught-store';
const LEGACY_CAUGHT_KEY = 'pokedex-caught';
const LEGACY_SHINY_KEY = 'pokedex-shiny';

export const useCaughtStore = create(
  persist(
    (set, get) => ({
      caught: new Map(),   // Map<pokemonId, timestamp|null>
      shiny: new Set(),    // Set<pokemonId>

      toggle: (id) => {
        const { caught, shiny } = get();
        const nextCaught = new Map(caught);
        let nextShiny = shiny;

        if (nextCaught.has(id)) {
          nextCaught.delete(id);
          // Also remove shiny status when uncatching
          if (shiny.has(id)) {
            nextShiny = new Set(shiny);
            nextShiny.delete(id);
          }
        } else {
          nextCaught.set(id, Date.now());
        }

        set({ caught: nextCaught, shiny: nextShiny });
      },

      toggleShiny: (id) => {
        const { caught, shiny } = get();
        if (!caught.has(id)) return;

        const next = new Set(shiny);
        next.has(id) ? next.delete(id) : next.add(id);
        set({ shiny: next });
      },

      getCaughtTime: (id) => get().caught.get(id) ?? null,

      isCaught: (id) => get().caught.has(id),

      isShiny: (id) => get().shiny.has(id),

      importData: (importedCaught, importedShiny) => {
        const { caught, shiny } = get();

        const nextCaught = new Map(caught);
        importedCaught.forEach((timestamp, id) => {
          if (!nextCaught.has(id) || timestamp !== null) {
            nextCaught.set(id, timestamp);
          }
        });

        const nextShiny = new Set(shiny);
        importedShiny.forEach((id) => {
          if (nextCaught.has(id)) {
            nextShiny.add(id);
          }
        });

        set({ caught: nextCaught, shiny: nextShiny });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createLocalStorage(),
      partialize: (state) => ({
        caught: state.caught,
        shiny: state.shiny,
      }),
      version: 1,
      migrate: (persisted, _version) => {
        // If no persisted data or empty, try loading from legacy keys
        if (!persisted || (!persisted.caught?.size && !persisted.shiny?.size)) {
          try {
            const legacyCaught = localStorage.getItem(LEGACY_CAUGHT_KEY);
            const legacyShiny = localStorage.getItem(LEGACY_SHINY_KEY);
            
            const caught = legacyCaught ? new Map(JSON.parse(legacyCaught)) : new Map();
            const shiny = legacyShiny ? new Set(JSON.parse(legacyShiny)) : new Set();
            
            // Clean up old keys after migration
            if (legacyCaught || legacyShiny) {
              localStorage.removeItem(LEGACY_CAUGHT_KEY);
              localStorage.removeItem(LEGACY_SHINY_KEY);
            }
            
            return { caught, shiny };
          } catch {
            return { caught: new Map(), shiny: new Set() };
          }
        }
        return persisted;
      },
    }
  )
);