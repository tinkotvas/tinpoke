import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalStorage } from './storageHelpers.js';

const STORAGE_KEY = 'pokedex-switch-store';
const LEGACY_VOLUME_KEY = 'pokemon-filters'; // Volume/muted were stored in filter store

export const useSwitchStore = create(
  persist(
    (set, get) => ({
      // Device preferences (persisted)
      lastVideoDeviceId: null,
      lastAudioDeviceId: null,
      lastResolution: null,  // { w, h }

      // Audio settings
      volume: 1,
      muted: false,

      // Actions
      setLastVideoDeviceId: (id) => set({ lastVideoDeviceId: id }),
      setLastAudioDeviceId: (id) => set({ lastAudioDeviceId: id }),
      setLastResolution: (res) => set({ lastResolution: res }),
      setVolume: (v) => set({ volume: v }),
      setMuted: (m) => set({ muted: m }),
      toggleMuted: () => set({ muted: !get().muted }),
    }),
    {
      name: STORAGE_KEY,
      storage: createLocalStorage(),
      partialize: (state) => ({
        lastVideoDeviceId: state.lastVideoDeviceId,
        lastAudioDeviceId: state.lastAudioDeviceId,
        lastResolution: state.lastResolution,
        volume: state.volume,
        muted: state.muted,
      }),
      version: 1,
      migrate: (persisted, _version) => {
        // Try to migrate volume/muted from old filter store
        if (!persisted || (persisted.volume === undefined && persisted.muted === undefined)) {
          try {
            const legacyFilters = localStorage.getItem(LEGACY_VOLUME_KEY);
            if (legacyFilters) {
              const parsed = JSON.parse(legacyFilters);
              const migrated = {
                lastVideoDeviceId: null,
                lastAudioDeviceId: null,
                lastResolution: null,
                volume: parsed.state?.switchVolume ?? 1,
                muted: parsed.state?.switchMuted ?? false,
              };
              return migrated;
            }
          } catch {
            // ignore
          }
        }
        return persisted || {
          lastVideoDeviceId: null,
          lastAudioDeviceId: null,
          lastResolution: null,
          volume: 1,
          muted: false,
        };
      },
    }
  )
);