import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalStorage } from './storageHelpers.js';

const STORAGE_KEY = 'pokedex-switch-store';
const LEGACY_FILTER_STORE_KEY = 'pokemon-filters'; // switchVolume/switchMuted were previously stored in filter store

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

      // Video display settings
      alignment: 'center',  // 'left' | 'center' | 'right'
      crop: { top: 0, right: 0, bottom: 0, left: 0 },  // pixels

      // Actions
      setLastVideoDeviceId: (id) => set({ lastVideoDeviceId: id }),
      setLastAudioDeviceId: (id) => set({ lastAudioDeviceId: id }),
      setLastResolution: (res) => set({ lastResolution: res }),
      setVolume: (v) => set({ volume: v }),
      setMuted: (m) => set({ muted: m }),
      toggleMuted: () => set({ muted: !get().muted }),
      setAlignment: (a) => set({ alignment: a }),
      setCrop: (crop) => set((s) => ({ crop: { ...s.crop, ...crop } })),
      resetCrop: () => set({ crop: { top: 0, right: 0, bottom: 0, left: 0 } }),
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
        alignment: state.alignment,
        crop: state.crop,
      }),
      version: 2,
      migrate: (persisted, version) => {
        // Try to migrate volume/muted from old filter store (version 0 -> 1)
        if (!persisted || (persisted.volume === undefined && persisted.muted === undefined)) {
          try {
            const legacyFilters = localStorage.getItem(LEGACY_FILTER_STORE_KEY);
            if (legacyFilters) {
              const parsed = JSON.parse(legacyFilters);
              persisted = {
                lastVideoDeviceId: null,
                lastAudioDeviceId: null,
                lastResolution: null,
                volume: parsed.state?.switchVolume ?? 1,
                muted: parsed.state?.switchMuted ?? false,
              };
            }
          } catch {
            // ignore
          }
        }
        const base = persisted || {
          lastVideoDeviceId: null,
          lastAudioDeviceId: null,
          lastResolution: null,
          volume: 1,
          muted: false,
        };
        // version 1 -> 2: add alignment and crop defaults
        return {
          ...base,
          alignment: base.alignment ?? 'center',
          crop: base.crop ?? { top: 0, right: 0, bottom: 0, left: 0 },
        };
      },
    }
  )
);