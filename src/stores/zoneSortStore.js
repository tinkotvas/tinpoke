import { create } from 'zustand';
import { ROUTES } from '../data/routes.js';

/**
 * Build a precomputed position map: pokemonId -> global zone position.
 * Walks through ROUTES in order, assigning sequential positions to Pokemon
 * as they first appear. This gives O(1) lookup for zone-based sorting.
 */
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

export const useZoneSortStore = create((set, get) => ({
  zoneOrder: buildZoneOrder(),
  
  /**
   * Safe accessor: returns the zone position for a given Pokemon ID.
   * Missing Pokemon (not found in any route) return Infinity.
   */
  getZonePosition: (id) => {
    return get().zoneOrder.get(id) ?? Infinity;
  },
}));
