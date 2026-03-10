import { useCallback, useRef } from 'react';
import { useSettingsStore } from '../stores/settingsStore.js';
import { playCry } from '../utils/pokemonCrySynth.js';

export function useSound() {
  const audioContextRef = useRef(null);
  
  // Read sound preference from store
  const enabled = useSettingsStore((s) => s.soundEnabled);
  const setEnabledState = useSettingsStore((s) => s.setSoundEnabled);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const setEnabled = useCallback((value) => {
    setEnabledState(value);
  }, [setEnabledState]);

  /**
   * Play a Pokémon's cry when caught
   * @param {number} pokedexId - Pokémon ID (1-151)
   */
  const playCatch = useCallback((pokedexId) => {
    if (!enabled) return;
    
    try {
      const ctx = getAudioContext();
      playCry(ctx, pokedexId, 0.6);
    } catch {
      // Audio not supported or blocked
    }
  }, [enabled, getAudioContext]);

  /**
   * Play a faded/reversed Pokémon cry when released
   * @param {number} pokedexId - Pokémon ID (1-151)
   */
  const playUncatch = useCallback((pokedexId) => {
    if (!enabled) return;
    
    try {
      const ctx = getAudioContext();
      playCry(ctx, pokedexId, 0.5, { reversed: true });
    } catch {
      // Audio not supported or blocked
    }
  }, [enabled, getAudioContext]);

  /**
   * Play shiny sparkle sound
   */
  const playShiny = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Rapid sparkle notes
      const notes = [1047, 1319, 1568, 2093]; // C6, E6, G6, C7
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.2, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.08);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.08);
      });
    } catch {
      // Audio not supported
    }
  }, [enabled, getAudioContext]);

  /**
   * Play victory fanfare
   */
  const playVictory = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Victory arpeggio
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
        gain.gain.setValueAtTime(0.15, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.2);
      });
    } catch {
      // Audio not supported
    }
  }, [enabled, getAudioContext]);

  return {
    enabled,
    setEnabled,
    playCatch,
    playUncatch,
    playShiny,
    playVictory,
  };
}