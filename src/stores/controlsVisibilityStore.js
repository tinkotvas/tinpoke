import { create } from 'zustand';

export const useControlsVisibilityStore = create((set, get) => ({
  showControls: true,
  showControlsRef: { current: true },

  setShowControls: (value) => {
    set({ showControls: value, showControlsRef: { current: value } });
  },

  // Getter for use in event handlers
  getShowControls: () => get().showControlsRef.current,
}));