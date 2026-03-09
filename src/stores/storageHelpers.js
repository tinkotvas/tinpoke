/**
 * Shared localStorage helper for zustand persist middleware.
 * Handles Map and Set serialization with tagged-object pattern.
 */
import { createJSONStorage } from 'zustand/middleware';

export const createLocalStorage = () =>
  createJSONStorage(() => localStorage, {
    replacer: (key, value) => {
      if (value instanceof Map) return { __type: 'Map', entries: [...value] };
      if (value instanceof Set) return { __type: 'Set', values: [...value] };
      return value;
    },
    reviver: (key, value) => {
      if (value?.__type === 'Map') return new Map(value.entries);
      if (value?.__type === 'Set') return new Set(value.values);
      return value;
    },
  });