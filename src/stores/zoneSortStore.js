import { create } from 'zustand';
import { ROUTES } from '../data/routes.js';
import { LOCATIONS } from '../data/locations.js';

const WILD_METHODS = new Set(['Grass', 'Surf', 'Old Rod', 'Good Rod', 'Super Rod', 'Static', 'Fossil']);

const buildZoneOrder = () => {
  const zoneOrder = new Map();
  let position = 0;
  
  for (const route of ROUTES) {
    for (const id of route.pokemon) {
      if (!zoneOrder.has(id)) {
        zoneOrder.set(id, position++);
      }
    }
  }
  
  return zoneOrder;
};

/**
 * Pokemon whose only obtain method is 'Gift' (starters, Eevee, Lapras, etc.)
 * can't be caught in the wild — deprioritized in QuickCatch.
 */
const buildGiftOnly = () => {
  const giftOnly = new Set();
  
  for (const [id, entries] of Object.entries(LOCATIONS)) {
    const numId = Number(id);
    const hasWild = entries.some(([, method]) => WILD_METHODS.has(method));
    if (!hasWild) {
      const isGiftOnly = entries.every(([, method]) => method === 'Gift' || method === 'Evolve');
      if (isGiftOnly) giftOnly.add(numId);
    }
  }
  
  return giftOnly;
};

export const useZoneSortStore = create((set, get) => ({
  zoneOrder: buildZoneOrder(),
  giftOnly: buildGiftOnly(),
  
  getZonePosition: (id) => {
    return get().zoneOrder.get(id) ?? Infinity;
  },
}));
