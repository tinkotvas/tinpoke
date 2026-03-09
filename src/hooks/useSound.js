import { useCallback, useRef } from 'react';
import { useSettingsStore } from '../stores/settingsStore.js';

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

  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.3) => {
    if (!enabled) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked
    }
  }, [enabled, getAudioContext]);

  const playCatch = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Two ascending tones
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523, now); // C5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc1.start(now);
      osc1.stop(now + 0.08);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659, now + 0.06); // E5
      gain2.gain.setValueAtTime(0.3, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.15);
    } catch {
      // Audio not supported
    }
  }, [enabled, getAudioContext]);

  const playUncatch = useCallback(() => {
    if (!enabled) return;
    playTone(330, 0.12, 'sine', 0.2); // Descending tone
    setTimeout(() => {
      playTone(262, 0.1, 'sine', 0.15);
    }, 50);
  }, [enabled, playTone]);

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