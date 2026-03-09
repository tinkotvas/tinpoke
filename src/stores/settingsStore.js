import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'pokedex-settings-store';
const LEGACY_THEME_KEY = 'pokedex-theme';
const LEGACY_SOUND_KEY = 'pokedex-sound-enabled';

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',  // 'dark' | 'light'
      soundEnabled: false,
      showCaughtInQuickCatch: false,

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setShowCaughtInQuickCatch: (show) => set({ showCaughtInQuickCatch: show }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        showCaughtInQuickCatch: state.showCaughtInQuickCatch,
      }),
      version: 2,
      migrate: (persisted, _version) => {
        // If no persisted data, try loading from legacy keys
        if (!persisted) {
          try {
            const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
            const legacySound = localStorage.getItem(LEGACY_SOUND_KEY);
            
            const theme = legacyTheme === 'light' ? 'light' : 'dark';
            const soundEnabled = legacySound === 'true';
            
            // Clean up old keys
            if (legacyTheme) localStorage.removeItem(LEGACY_THEME_KEY);
            if (legacySound) localStorage.removeItem(LEGACY_SOUND_KEY);
            
            return { theme, soundEnabled, showCaughtInQuickCatch: false };
          } catch {
            return { theme: 'dark', soundEnabled: false, showCaughtInQuickCatch: false };
          }
        }
        // Ensure new fields have defaults when migrating
        return {
          theme: persisted.theme || 'dark',
          soundEnabled: persisted.soundEnabled ?? false,
          showCaughtInQuickCatch: persisted.showCaughtInQuickCatch ?? false,
        };
      },
    }
  )
);

// Apply theme on load (runs once when module is imported)
const initialTheme = useSettingsStore.getState().theme;
document.documentElement.setAttribute('data-theme', initialTheme);