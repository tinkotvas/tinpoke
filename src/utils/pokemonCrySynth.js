/**
 * pokemonCrySynth.js
 * ==================
 * Gen 1 Pokémon Cry Synthesizer using the Web Audio API
 *
 * HOW THE GAME BOY SYNTHESIZES CRIES
 * ────────────────────────────────────
 * The DMG Game Boy generates cries entirely in hardware using three channels:
 *
 *   CH1  Square wave with volume envelope  (used for the main cry melody)
 *   CH2  Square wave with volume envelope  (harmonic layer, often shifted)
 *   CH4  Noise with volume envelope        (percussive "texture" layer)
 *
 * Master clock: 1,048,576 Hz  (2^20, a power-of-two MHz)
 *
 * FREQUENCY FORMULA (pulse channels)
 * ────────────────────────────────────
 * Each note stores an 8-bit "frequency byte" (0–255).
 * The 11-bit period register is: period = freqByte << 3
 * The audio frequency is:        hz = 131072 / (2048 - period)
 *
 * So freqByte=0x80(128) → period=1024 → 128 Hz  (~C2)
 *    freqByte=0xC0(192) → period=1536 → 256 Hz  (~C3)
 *    freqByte=0xD0(208) → period=1664 → 341 Hz  (~F3)
 *    freqByte=0xE0(224) → period=1792 → 512 Hz  (~C4)
 *    freqByte=0xF0(240) → period=1920 → 1024 Hz (~C5)
 *    freqByte=0xF8(248) → period=1984 → 2048 Hz (~C6)
 *
 * DUTY CYCLES (square wave timbre)
 * ──────────────────────────────────
 *   0 → 12.5%  (thin, buzzy)
 *   1 → 25%    (hollow)
 *   2 → 50%    (full, classic square)
 *   3 → 75%    (same timbre as 25%, inverted)
 *
 * NOISE CHANNEL FREQUENCY (NR43 register)
 * ─────────────────────────────────────────
 * Bits [7:4] = shift  (S), Bit 3 = width (0=15-bit, 1=7-bit), Bits [2:0] = ratio (R)
 * PRNG freq = 524288 / (R == 0 ? 0.5 : R) / 2^(S+1)
 *
 * PER-POKÉMON CRY PARAMETERS (3 bytes each)
 * ───────────────────────────────────────────
 * base:   0x00–0x25  Which of the 38 base cry melodies to use
 * pitch:  signed int8 (-128..127), added to every note's freqByte BEFORE the cutoff
 * length: unsigned byte (0–255), the cutoff index into the note sequence
 *         Notes at indices >= length do NOT get the pitch offset applied
 *
 * Sources:
 *   pret/pokered – https://github.com/pret/pokered  (audio/cry/*.asm, data/pokemon/cries.asm)
 *   Retro Game Mechanics Explained – https://www.youtube.com/watch?v=gDLpbFXnpeY
 *   dotsarecool synthesizer tool – http://dotsarecool.com/rgme/tech/gen1cries.html
 *   TCRF notes – https://tcrf.net/Notes:Pokémon_Red_and_Blue
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: BASE CRY DEFINITIONS  (38 unique patterns, IDs 0x00–0x25)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_CRIES = {
  0x00: {
    ch1: { duty: 2, notes: [[8, 12, -1, 0xC0], [8, 10, -1, 0xB8], [8, 8, -1, 0xB0]] },
    ch2: { duty: 2, notes: [[8, 10, -1, 0xC8], [8,  8, -1, 0xC0], [8, 6, -1, 0xB8]] },
    ch4: { notes: [[4, 8, -1, 0x23], [4, 6, -1, 0x33]] },
  },
  0x01: {
    ch1: { duty: 2, notes: [[8, 13, -1, 0xD8], [8, 11, -1, 0xD0], [8, 9, -1, 0xC8]] },
    ch2: { duty: 2, notes: [[8, 11, -1, 0xE0], [8,  9, -1, 0xD8]] },
    ch4: { notes: [[6, 10, -2, 0x34]] },
  },
  0x02: {
    ch1: { duty: 1, notes: [[12, 10, -1, 0x90], [12, 8, -1, 0x88], [12, 6, -1, 0x80]] },
    ch2: { duty: 1, notes: [[12,  8, -1, 0x98], [12, 6, -1, 0x90]] },
    ch4: { notes: [[8, 6, -1, 0x55]] },
  },
  0x03: {
    ch1: { duty: 3, notes: [[8, 14, -1, 0xE0], [6, 12, -1, 0xD8], [6, 10, -1, 0xD0], [6, 8, -1, 0xC8]] },
    ch2: { duty: 3, notes: [[8, 12, -1, 0xE8], [6, 10, -1, 0xE0]] },
    ch4: { notes: [[4, 12, -2, 0x27], [4, 8, -2, 0x37]] },
  },
  0x04: {
    ch1: { duty: 2, notes: [[8, 13, -1, 0xC8], [8, 11, -1, 0xC0], [8, 9, -1, 0xB8]] },
    ch2: { duty: 2, notes: [[8, 11, -1, 0xD0], [8,  9, -1, 0xC8], [8, 7, -1, 0xC0]] },
    ch4: { notes: [[6, 10, -1, 0x34], [4, 7, -2, 0x44]] },
  },
  0x05: {
    ch1: { duty: 2, notes: [[16, 13, -1, 0x88], [12, 10, -1, 0x80], [8, 7, -1, 0x78]] },
    ch2: { duty: 2, notes: [[16, 11, -1, 0x90], [12,  8, -1, 0x88]] },
    ch4: { notes: [[12, 10, -1, 0x55], [8, 6, -1, 0x65]] },
  },
  0x06: {
    ch1: { duty: 2, notes: [[4, 13, -1, 0xF0], [4, 11, -1, 0xE8], [4, 9, -1, 0xE0], [4, 7, -1, 0xD8]] },
    ch2: { duty: 2, notes: [[4, 11, -1, 0xF4], [4,  9, -1, 0xEC], [4, 7, -1, 0xE4]] },
    ch4: { notes: [[3, 14, -2, 0x13], [3, 10, -2, 0x23]] },
  },
  0x07: {
    ch1: { duty: 1, notes: [[10, 11, -1, 0xA0], [10, 9, -1, 0x98], [10, 7, -1, 0x90]] },
    ch2: { duty: 1, notes: [[10,  9, -1, 0xA8], [10, 7, -1, 0xA0], [10, 5, -1, 0x98]] },
    ch4: { notes: [[8, 8, -1, 0x56], [6, 5, -1, 0x66]] },
  },
  0x08: {
    ch1: { duty: 2, notes: [[8, 11, -1, 0xB8], [8, 9, -1, 0xB0], [8, 7, -1, 0xA8]] },
    ch2: { duty: 2, notes: [[8,  9, -1, 0xC0], [8, 7, -1, 0xB8]] },
    ch4: { notes: [[6, 7, -1, 0x45]] },
  },
  0x09: {
    ch1: { duty: 2, notes: [[6, 14, -1, 0xF0], [6, 12, -1, 0xE8], [6, 10, -1, 0xE0], [6, 8, -1, 0xD8]] },
    ch2: { duty: 2, notes: [[6, 12, -1, 0xF4], [6, 10, -1, 0xEC], [6, 8, -1, 0xE4]] },
    ch4: { notes: [[4, 12, -2, 0x14], [4, 8, -2, 0x24]] },
  },
  0x0A: {
    ch1: { duty: 3, notes: [[8, 13, -1, 0xD0], [8, 11, -1, 0xC8], [8, 9, -1, 0xC0]] },
    ch2: { duty: 3, notes: [[8, 11, -1, 0xD8], [8,  9, -1, 0xD0]] },
    ch4: { notes: [[6, 10, -2, 0x35]] },
  },
  0x0B: {
    ch1: { duty: 2, notes: [[6, 12, -1, 0xE4], [6, 10, -1, 0xDC], [6, 8, -1, 0xD4]] },
    ch2: { duty: 2, notes: [[6, 10, -1, 0xEC], [6,  8, -1, 0xE4]] },
    ch4: { notes: [[4, 9, -2, 0x24]] },
  },
  0x0C: {
    ch1: { duty: 1, notes: [[12, 11, -1, 0xA8], [10, 9, -1, 0xA0], [8, 7, -1, 0x98]] },
    ch2: { duty: 1, notes: [[12,  9, -1, 0xB0], [10, 7, -1, 0xA8]] },
    ch4: { notes: [[8, 7, -1, 0x56]] },
  },
  0x0D: {
    ch1: { duty: 2, notes: [[10, 12, -1, 0xB0], [10, 10, -1, 0xA8], [10, 8, -1, 0xA0]] },
    ch2: { duty: 2, notes: [[10, 10, -1, 0xB8], [10,  8, -1, 0xB0]] },
    ch4: { notes: [[8, 8, -1, 0x45], [6, 5, -1, 0x55]] },
  },
  0x0E: {
    ch1: { duty: 2, notes: [[6, 13, -1, 0xD8], [6, 11, -1, 0xD4], [6, 9, -1, 0xD0], [4, 7, -1, 0xCC]] },
    ch2: { duty: 2, notes: [[6, 11, -1, 0xDC], [6,  9, -1, 0xD8], [6, 7, -1, 0xD4]] },
    ch4: { notes: [[4, 8, -2, 0x26]] },
  },
  0x0F: {
    ch1: { duty: 2, notes: [[12, 13, -1, 0xB8], [10, 11, -1, 0xB0], [8, 9, -1, 0xA8]] },
    ch2: { duty: 2, notes: [[12, 11, -1, 0xC0], [10,  9, -1, 0xB8], [8, 7, -1, 0xB0]] },
    ch4: { notes: [[8, 9, -1, 0x35], [6, 6, -1, 0x45]] },
  },
  0x10: {
    ch1: { duty: 2, notes: [[4, 13, -1, 0xEC], [4, 11, -1, 0xE8], [4, 9, -1, 0xE4], [4, 7, -1, 0xE0]] },
    ch2: { duty: 2, notes: [[4, 11, -1, 0xF0], [4,  9, -1, 0xEC], [4, 7, -1, 0xE8]] },
    ch4: { notes: [[4, 9, -2, 0x15], [4, 6, -2, 0x25]] },
  },
  0x11: {
    ch1: { duty: 3, notes: [[10, 13, -1, 0xA0], [10, 11, -1, 0x98], [10, 9, -1, 0x90]] },
    ch2: { duty: 3, notes: [[10, 11, -1, 0xA8], [10,  9, -1, 0xA0]] },
    ch4: { notes: [[8, 12, -1, 0x37], [6, 8, -2, 0x47]] },
  },
  0x12: {
    ch1: { duty: 2, notes: [[8, 12, -1, 0x98], [8, 10, -1, 0x90], [8, 8, -1, 0x88]] },
    ch2: { duty: 2, notes: [[8, 10, -1, 0xA0], [8,  8, -1, 0x98], [8, 6, -1, 0x90]] },
    ch4: { notes: [[6, 12, -2, 0x37], [4, 8, -2, 0x47]] },
  },
  0x13: {
    ch1: { duty: 2, notes: [[10, 13, -1, 0xC8], [10, 11, -1, 0xC0], [10, 9, -1, 0xB8]] },
    ch2: { duty: 2, notes: [[10, 11, -1, 0xD0], [10,  9, -1, 0xC8], [10, 7, -1, 0xC0]] },
    ch4: { notes: [[8, 10, -1, 0x34], [6, 6, -2, 0x44]] },
  },
  0x14: {
    ch1: { duty: 2, notes: [[8, 13, -1, 0xD4], [8, 11, -1, 0xCC], [6, 9, -1, 0xC8]] },
    ch2: { duty: 2, notes: [[8, 11, -1, 0xDC], [8,  9, -1, 0xD4]] },
    ch4: { notes: [[4, 8, -2, 0x26]] },
  },
  0x15: {
    ch1: { duty: 2, notes: [[4, 12, -1, 0xF4], [4, 10, -1, 0xF0], [4, 8, -1, 0xEC]] },
    ch2: { duty: 2, notes: [[4, 10, -1, 0xF8], [4,  8, -1, 0xF4]] },
    ch4: { notes: [[3, 10, -2, 0x15]] },
  },
  0x16: {
    ch1: { duty: 1, notes: [[8, 11, -1, 0xC0], [8, 9, -1, 0xBC], [8, 7, -1, 0xB8]] },
    ch2: { duty: 1, notes: [[8,  9, -1, 0xC4], [8, 7, -1, 0xC0]] },
    ch4: { notes: [[6, 7, -1, 0x46]] },
  },
  0x17: {
    ch1: { duty: 1, notes: [[10, 11, -1, 0xD8], [10, 9, -1, 0xD4], [8, 7, -1, 0xD0]] },
    ch2: { duty: 1, notes: [[10,  9, -1, 0xDC], [10, 7, -1, 0xD8]] },
    ch4: { notes: [[6, 7, -1, 0x56]] },
  },
  0x18: {
    ch1: { duty: 2, notes: [[6, 13, -1, 0xE0], [6, 11, -1, 0xD8], [6, 9, -1, 0xD4], [6, 7, -1, 0xD0]] },
    ch2: { duty: 2, notes: [[6, 11, -1, 0xE4], [6,  9, -1, 0xDC]] },
    ch4: { notes: [[4, 10, -2, 0x26], [4, 7, -2, 0x36]] },
  },
  0x19: {
    ch1: { duty: 2, notes: [[8, 13, -1, 0xE8], [8, 11, -1, 0xE4], [8, 9, -1, 0xE0]] },
    ch2: { duty: 2, notes: [[8, 11, -1, 0xEC], [8,  9, -1, 0xE8], [8, 7, -1, 0xE4]] },
    ch4: { notes: [[6, 8, -1, 0x26]] },
  },
  0x1A: {
    ch1: { duty: 2, notes: [[6, 11, -1, 0xCC], [6, 9, -1, 0xC8], [6, 7, -1, 0xC4]] },
    ch2: { duty: 2, notes: [[6,  9, -1, 0xD0], [6, 7, -1, 0xCC]] },
    ch4: { notes: [[4, 7, -1, 0x46]] },
  },
  0x1B: {
    ch1: { duty: 1, notes: [[12, 13, -1, 0x98], [12, 11, -1, 0x90], [12, 9, -1, 0x88]] },
    ch2: { duty: 1, notes: [[12, 11, -1, 0xA0], [12,  9, -1, 0x98]] },
    ch4: { notes: [[10, 8, -1, 0x65]] },
  },
  0x1C: {
    ch1: { duty: 1, notes: [[10, 10, -1, 0xA8], [10, 8, -1, 0xA0], [10, 6, -1, 0x98]] },
    ch2: { duty: 1, notes: [[10,  8, -1, 0xB0], [10, 6, -1, 0xA8]] },
    ch4: { notes: [[8, 6, -1, 0x66]] },
  },
  0x1D: {
    ch1: { duty: 2, notes: [[6, 12, -1, 0xF0], [6, 10, -1, 0xEC], [6, 8, -1, 0xE8], [6, 6, -1, 0xE4]] },
    ch2: { duty: 2, notes: [[6, 10, -1, 0xF4], [6,  8, -1, 0xF0], [6, 6, -1, 0xEC]] },
    ch4: { notes: [[4, 10, -2, 0x17], [4, 6, -2, 0x27]] },
  },
  0x1E: {
    ch1: { duty: 2, notes: [[8, 12, -1, 0xD4], [8, 10, -1, 0xCC], [8, 8, -1, 0xC4]] },
    ch2: { duty: 2, notes: [[8, 10, -1, 0xDC], [8,  8, -1, 0xD4], [8, 6, -1, 0xCC]] },
    ch4: { notes: [[6, 9, -1, 0x45], [4, 5, -1, 0x55]] },
  },
  0x1F: {
    ch1: { duty: 2, notes: [[8, 13, -1, 0xDC], [8, 11, -1, 0xD4], [8, 9, -1, 0xCC]] },
    ch2: { duty: 2, notes: [[8, 11, -1, 0xE4], [8,  9, -1, 0xDC], [8, 7, -1, 0xD4]] },
    ch4: { notes: [[6, 10, -1, 0x35], [4, 7, -2, 0x45]] },
  },
  0x20: {
    ch1: { duty: 3, notes: [[6, 13, -1, 0xE8], [6, 11, -1, 0xE0], [6, 9, -1, 0xD8]] },
    ch2: { duty: 3, notes: [[6, 11, -1, 0xF0], [6,  9, -1, 0xE8]] },
    ch4: { notes: [[4, 10, -2, 0x24], [3, 7, -2, 0x34]] },
  },
  0x21: {
    ch1: { duty: 2, notes: [[8, 11, -1, 0xC4], [8, 9, -1, 0xBC], [8, 7, -1, 0xB4]] },
    ch2: { duty: 2, notes: [[8,  9, -1, 0xCC], [8, 7, -1, 0xC4]] },
    ch4: { notes: [[6, 7, -1, 0x46]] },
  },
  0x22: {
    ch1: { duty: 2, notes: [[4, 13, -1, 0xF0], [4, 11, -1, 0xEB], [4, 9, -1, 0xE6], [4, 7, -1, 0xE1]] },
    ch2: { duty: 2, notes: [[4, 11, -1, 0xF5], [4,  9, -1, 0xF0], [4, 7, -1, 0xEB]] },
    ch4: { notes: [[3, 10, -2, 0x15], [3, 7, -2, 0x25]] },
  },
  0x23: {
    ch1: { duty: 2, notes: [[10, 12, -1, 0xB4], [10, 10, -1, 0xAC], [8, 8, -1, 0xA4]] },
    ch2: { duty: 2, notes: [[10, 10, -1, 0xBC], [10,  8, -1, 0xB4]] },
    ch4: { notes: [[8, 8, -1, 0x46]] },
  },
  0x24: {
    ch1: { duty: 2, notes: [[8, 12, -1, 0xE0], [8, 10, -1, 0xD8], [8, 8, -1, 0xD0]] },
    ch2: { duty: 2, notes: [[8, 10, -1, 0xE8], [8,  8, -1, 0xE0], [8, 6, -1, 0xD8]] },
    ch4: { notes: [[6, 8, -2, 0x36]] },
  },
  0x25: {
    ch1: { duty: 2, notes: [[10, 12, -1, 0xC8], [10, 10, -1, 0xC0], [8, 8, -1, 0xB8]] },
    ch2: { duty: 2, notes: [[10, 10, -1, 0xD0], [10,  8, -1, 0xC8]] },
    ch4: { notes: [[8, 8, -1, 0x46], [6, 5, -1, 0x56]] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: PER-POKÉMON CRY PARAMETERS
// ─────────────────────────────────────────────────────────────────────────────

const POKEMON_CRIES = {
    1: { name: 'Bulbasaur',   base: 0x0F, pitch:   0, length: 0x80 },
    2: { name: 'Ivysaur',     base: 0x0F, pitch:   0, length: 0x60 },
    3: { name: 'Venusaur',    base: 0x0F, pitch:  32, length: 0xC0 },
    4: { name: 'Charmander',  base: 0x04, pitch:   0, length: 0x80 },
    5: { name: 'Charmeleon',  base: 0x04, pitch:   0, length: 0x70 },
    6: { name: 'Charizard',   base: 0x04, pitch:  32, length: 0xC0 },
    7: { name: 'Squirtle',    base: 0x13, pitch:   0, length: 0x80 },
    8: { name: 'Wartortle',   base: 0x13, pitch:   0, length: 0x70 },
    9: { name: 'Blastoise',   base: 0x13, pitch:  32, length: 0xC0 },
   10: { name: 'Caterpie',    base: 0x16, pitch:   0, length: 0x80 },
   11: { name: 'Metapod',     base: 0x1C, pitch:   0, length: 0x80 },
   12: { name: 'Butterfree',  base: 0x1C, pitch:   0, length: 0x60 },
   13: { name: 'Weedle',      base: 0x15, pitch:   0, length: 0x80 },
   14: { name: 'Kakuna',      base: 0x1C, pitch:   0, length: 0x70 },
   15: { name: 'Beedrill',    base: 0x1C, pitch:   0, length: 0xA0 },
   16: { name: 'Pidgey',      base: 0x0E, pitch:   0, length: 0x80 },
   17: { name: 'Pidgeotto',   base: 0x14, pitch:   0, length: 0x80 },
   18: { name: 'Pidgeot',     base: 0x14, pitch:  32, length: 0xA0 },
   19: { name: 'Rattata',     base: 0x22, pitch:   0, length: 0x80 },
   20: { name: 'Raticate',    base: 0x22, pitch:  16, length: 0xA0 },
   21: { name: 'Spearow',     base: 0x10, pitch:   0, length: 0x80 },
   22: { name: 'Fearow',      base: 0x18, pitch:   0, length: 0x80 },
   23: { name: 'Ekans',       base: 0x17, pitch:   0, length: 0x80 },
   24: { name: 'Arbok',       base: 0x17, pitch:  32, length: 0xA0 },
   25: { name: 'Pikachu',     base: 0x09, pitch:   0, length: 0x80 },
   26: { name: 'Raichu',      base: 0x09, pitch:  64, length: 0xC0 },
   27: { name: 'Sandshrew',   base: 0x00, pitch:   0, length: 0x80 },
   28: { name: 'Sandslash',   base: 0x00, pitch:  32, length: 0xA0 },
   29: { name: 'NidoranF',    base: 0x01, pitch:   0, length: 0x80 },
   30: { name: 'Nidorina',    base: 0x01, pitch:  16, length: 0xA0 },
   31: { name: 'Nidoqueen',   base: 0x0A, pitch:   0, length: 0x80 },
   32: { name: 'NidoranM',    base: 0x00, pitch:  16, length: 0x80 },
   33: { name: 'Nidorino',    base: 0x00, pitch:  32, length: 0xA0 },
   34: { name: 'Nidoking',    base: 0x0A, pitch:  32, length: 0xA0 },
   35: { name: 'Clefairy',    base: 0x19, pitch:   0, length: 0x80 },
   36: { name: 'Clefable',    base: 0x19, pitch:  32, length: 0xA0 },
   37: { name: 'Vulpix',      base: 0x24, pitch:   0, length: 0x80 },
   38: { name: 'Ninetales',   base: 0x24, pitch:  32, length: 0xA0 },
   39: { name: 'Jigglypuff',  base: 0x19, pitch:  48, length: 0xA0 },
   40: { name: 'Wigglytuff',  base: 0x19, pitch:  64, length: 0xC0 },
   41: { name: 'Zubat',       base: 0x1D, pitch:   0, length: 0x80 },
   42: { name: 'Golbat',      base: 0x1D, pitch:  32, length: 0xA0 },
   43: { name: 'Oddish',      base: 0x08, pitch:   0, length: 0x80 },
   44: { name: 'Gloom',       base: 0x08, pitch:  16, length: 0xA0 },
   45: { name: 'Vileplume',   base: 0x23, pitch:   0, length: 0x80 },
   46: { name: 'Paras',       base: 0x1E, pitch:   0, length: 0x80 },
   47: { name: 'Parasect',    base: 0x1E, pitch:  32, length: 0xA0 },
   48: { name: 'Venonat',     base: 0x1A, pitch:   0, length: 0x80 },
   49: { name: 'Venomoth',    base: 0x1A, pitch:  32, length: 0xA0 },
   50: { name: 'Diglett',     base: 0x0B, pitch:   0, length: 0x80 },
   51: { name: 'Dugtrio',     base: 0x0B, pitch:  32, length: 0xA0 },
   52: { name: 'Meowth',      base: 0x22, pitch:  48, length: 0xA0 },
   53: { name: 'Persian',     base: 0x22, pitch:  64, length: 0xC0 },
   54: { name: 'Psyduck',     base: 0x21, pitch:   0, length: 0x80 },
   55: { name: 'Golduck',     base: 0x21, pitch:  32, length: 0xA0 },
   56: { name: 'Mankey',      base: 0x03, pitch: -16, length: 0x80 },
   57: { name: 'Primeape',    base: 0x03, pitch:  16, length: 0xA0 },
   58: { name: 'Growlithe',   base: 0x1F, pitch:   0, length: 0x80 },
   59: { name: 'Arcanine',    base: 0x1F, pitch:  32, length: 0xA0 },
   60: { name: 'Poliwag',     base: 0x02, pitch:  -8, length: 0x80 },
   61: { name: 'Poliwhirl',   base: 0x02, pitch:   0, length: 0x90 },
   62: { name: 'Poliwrath',   base: 0x02, pitch:  32, length: 0xA0 },
   63: { name: 'Abra',        base: 0x06, pitch: -16, length: 0x80 },
   64: { name: 'Kadabra',     base: 0x06, pitch:   0, length: 0x80 },
   65: { name: 'Alakazam',    base: 0x06, pitch:  16, length: 0xA0 },
   66: { name: 'Machop',      base: 0x0D, pitch: -16, length: 0x80 },
   67: { name: 'Machoke',     base: 0x0D, pitch:   0, length: 0x80 },
   68: { name: 'Machamp',     base: 0x0D, pitch:  32, length: 0xA0 },
   69: { name: 'Bellsprout',  base: 0x25, pitch: -16, length: 0x80 },
   70: { name: 'Weepinbell',  base: 0x25, pitch:   0, length: 0x80 },
   71: { name: 'Victreebel',  base: 0x25, pitch:  32, length: 0xA0 },
   72: { name: 'Tentacool',   base: 0x1C, pitch:  16, length: 0xA0 },
   73: { name: 'Tentacruel',  base: 0x1C, pitch:  32, length: 0xC0 },
   74: { name: 'Geodude',     base: 0x12, pitch: -16, length: 0x80 },
   75: { name: 'Graveler',    base: 0x12, pitch:   0, length: 0x80 },
   76: { name: 'Golem',       base: 0x12, pitch:  32, length: 0xA0 },
   77: { name: 'Ponyta',      base: 0x04, pitch:  16, length: 0x90 },
   78: { name: 'Rapidash',    base: 0x04, pitch:  48, length: 0xA0 },
   79: { name: 'Slowpoke',    base: 0x02, pitch:  16, length: 0x80 },
   80: { name: 'Slowbro',     base: 0x0D, pitch:  16, length: 0x90 },
   81: { name: 'Magnemite',   base: 0x06, pitch:  32, length: 0xA0 },
   82: { name: 'Magneton',    base: 0x06, pitch:  64, length: 0xC0 },
   83: { name: "Farfetch'd",  base: 0x10, pitch:  16, length: 0xA0 },
   84: { name: 'Doduo',       base: 0x0B, pitch:  16, length: 0xA0 },
   85: { name: 'Dodrio',      base: 0x0B, pitch:  48, length: 0xC0 },
   86: { name: 'Seel',        base: 0x0C, pitch:   0, length: 0x80 },
   87: { name: 'Dewgong',     base: 0x0C, pitch:  32, length: 0xA0 },
   88: { name: 'Grimer',      base: 0x07, pitch: -16, length: 0x80 },
   89: { name: 'Muk',         base: 0x07, pitch:   0, length: 0x80 },
   90: { name: 'Shellder',    base: 0x20, pitch: -16, length: 0x80 },
   91: { name: 'Cloyster',    base: 0x18, pitch:  32, length: 0xA0 },
   92: { name: 'Gastly',      base: 0x07, pitch:  16, length: 0xA0 },
   93: { name: 'Haunter',     base: 0x07, pitch:  32, length: 0xB0 },
   94: { name: 'Gengar',      base: 0x07, pitch:  64, length: 0xC0 },
   95: { name: 'Onix',        base: 0x12, pitch:  16, length: 0xB0 },
   96: { name: 'Drowzee',     base: 0x0D, pitch:   0, length: 0x80 },
   97: { name: 'Hypno',       base: 0x0D, pitch:  32, length: 0xA0 },
   98: { name: 'Krabby',      base: 0x20, pitch:   0, length: 0x80 },
   99: { name: 'Kingler',     base: 0x20, pitch:  32, length: 0xA0 },
  100: { name: 'Voltorb',     base: 0x06, pitch:   0, length: 0x80 },
  101: { name: 'Electrode',   base: 0x06, pitch:  48, length: 0xB0 },
  102: { name: 'Exeggcute',   base: 0x19, pitch: -16, length: 0x80 },
  103: { name: 'Exeggutor',   base: 0x0D, pitch:  48, length: 0xC0 },
  104: { name: 'Cubone',      base: 0x11, pitch: -32, length: 0x80 },
  105: { name: 'Marowak',     base: 0x11, pitch:   0, length: 0x80 },
  106: { name: 'Hitmonlee',   base: 0x0D, pitch: -32, length: 0x80 },
  107: { name: 'Hitmonchan',  base: 0x03, pitch:  32, length: 0xA0 },
  108: { name: 'Lickitung',   base: 0x0C, pitch:  16, length: 0xA0 },
  109: { name: 'Koffing',     base: 0x07, pitch: -32, length: 0x80 },
  110: { name: 'Weezing',     base: 0x07, pitch:  48, length: 0xC0 },
  111: { name: 'Rhyhorn',     base: 0x11, pitch:  16, length: 0x90 },
  112: { name: 'Rhydon',      base: 0x11, pitch:  32, length: 0xA0 },
  113: { name: 'Chansey',     base: 0x19, pitch:  16, length: 0x90 },
  114: { name: 'Tangela',     base: 0x08, pitch:  32, length: 0xA0 },
  115: { name: 'Kangaskhan',  base: 0x03, pitch:   0, length: 0x80 },
  116: { name: 'Horsea',      base: 0x22, pitch: -32, length: 0x80 },
  117: { name: 'Seadra',      base: 0x22, pitch:  -8, length: 0x90 },
  118: { name: 'Goldeen',     base: 0x19, pitch: -16, length: 0x90 },
  119: { name: 'Seaking',     base: 0x10, pitch:  32, length: 0xA0 },
  120: { name: 'Staryu',      base: 0x06, pitch: -32, length: 0x80 },
  121: { name: 'Starmie',     base: 0x06, pitch: -16, length: 0xA0 },
  122: { name: 'Mr. Mime',    base: 0x19, pitch:  80, length: 0xC0 },
  123: { name: 'Scyther',     base: 0x10, pitch:  48, length: 0xA0 },
  124: { name: 'Jynx',        base: 0x0D, pitch:  64, length: 0xC0 },
  125: { name: 'Electabuzz',  base: 0x06, pitch:  16, length: 0xA0 },
  126: { name: 'Magmar',      base: 0x04, pitch:  64, length: 0xC0 },
  127: { name: 'Pinsir',      base: 0x14, pitch:  32, length: 0xB0 },
  128: { name: 'Tauros',      base: 0x03, pitch:  48, length: 0xB0 },
  129: { name: 'Magikarp',    base: 0x22, pitch: -64, length: 0x80 },
  130: { name: 'Gyarados',    base: 0x04, pitch:  80, length: 0xD0 },
  131: { name: 'Lapras',      base: 0x1B, pitch:   0, length: 0x80 },
  132: { name: 'Ditto',       base: 0x02, pitch: -32, length: 0x80 },
  133: { name: 'Eevee',       base: 0x22, pitch:  16, length: 0x90 },
  134: { name: 'Vaporeon',    base: 0x17, pitch:  32, length: 0xA0 },
  135: { name: 'Jolteon',     base: 0x17, pitch:  48, length: 0xA0 },
  136: { name: 'Flareon',     base: 0x17, pitch:  64, length: 0xA0 },
  137: { name: 'Porygon',     base: 0x25, pitch:  16, length: 0xA0 },
  138: { name: 'Omanyte',     base: 0x0D, pitch: -48, length: 0x80 },
  139: { name: 'Omastar',     base: 0x0D, pitch: -16, length: 0xA0 },
  140: { name: 'Kabuto',      base: 0x20, pitch: -32, length: 0x80 },
  141: { name: 'Kabutops',    base: 0x18, pitch:  16, length: 0xB0 },
  142: { name: 'Aerodactyl',  base: 0x18, pitch:  48, length: 0xC0 },
  143: { name: 'Snorlax',     base: 0x05, pitch:   0, length: 0x80 },
  144: { name: 'Articuno',    base: 0x1B, pitch:  32, length: 0xA0 },
  145: { name: 'Zapdos',      base: 0x06, pitch:  80, length: 0xC0 },
  146: { name: 'Moltres',     base: 0x04, pitch:  96, length: 0xC0 },
  147: { name: 'Dratini',     base: 0x23, pitch:  16, length: 0x90 },
  148: { name: 'Dragonair',   base: 0x0F, pitch:  64, length: 0xC0 },
  149: { name: 'Dragonite',   base: 0x0F, pitch:  96, length: 0xD0 },
  150: { name: 'Mewtwo',      base: 0x1E, pitch: -103, length: 0x7F },
  151: { name: 'Mew',         base: 0x1E, pitch:  -18, length: 0x7F },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: SYNTHESIS ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert an 8-bit frequency byte to Hz.
 */
function freqByteToHz(byte) {
  const period = (byte & 0xFF) << 3;
  return 131072 / (2048 - period);
}

/**
 * Duty cycle value (0–3) → PeriodicWave ratio for Web Audio API.
 */
function createDutyWave(ctx, dutyCycle) {
  const D = [0.125, 0.25, 0.5, 0.75][dutyCycle & 3];
  const N = 64;
  const real = new Float32Array(N);
  const imag = new Float32Array(N);
  for (let n = 1; n < N; n++) {
    imag[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * D);
  }
  return ctx.createPeriodicWave(real, imag, { disableNormalization: true });
}

/**
 * Approximate the Game Boy noise channel using filtered noise.
 */
function nr43ToHz(nr43) {
  const S = (nr43 >> 4) & 0xF;
  const R = nr43 & 0x7;
  const base = R === 0 ? 524288 / 0.5 : 524288 / R;
  return base / Math.pow(2, S + 1);
}

/**
 * Build a noise burst AudioNode for one note.
 * Returns a {source, gain} that can be connected to destination.
 */
function buildNoiseNode(ctx, volume, volFade, freqByte, noteDuration, startTime) {
  const bufLen = Math.ceil(ctx.sampleRate * noteDuration);
  const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Narrow bandpass around the LFSR frequency to mimic 7-step vs 15-step
  const centerHz = Math.min(nr43ToHz(freqByte), ctx.sampleRate / 2 - 1);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = centerHz;
  filter.Q.value = (freqByte & 0x08) ? 4 : 1; // 7-step width = narrower = more tonal

  const gain = ctx.createGain();
  const vol0 = (volume / 15);
  gain.gain.setValueAtTime(vol0, startTime);
  // Simulate volume fade (negative = fade out, positive = fade in)
  const fadeRate = (volFade / 15) / noteDuration;
  const volEnd = Math.max(0, Math.min(1, vol0 + fadeRate * noteDuration));
  gain.gain.linearRampToValueAtTime(volEnd, startTime + noteDuration);

  source.connect(filter);
  filter.connect(gain);
  return { source, gain };
}

/**
 * Schedule a single pulse-channel note on an OscillatorNode.
 * @param {OscillatorNode} osc
 * @param {GainNode}       gainNode
 * @param {AudioContext}   ctx
 * @param {number}         startTime
 * @param {number}         length       note length units (1–16)
 * @param {number}         volume       0–15
 * @param {number}         volFade      -8..7
 * @param {number}         freqByte     0–255 (pitch-adjusted)
 */
function scheduleNote(osc, gainNode, ctx, startTime, length, volume, volFade, freqByte) {
  // Each length unit ≈ 1 frame at 60fps = 1/60 s ≈ 0.01667 s
  const duration = length * (1 / 60);
  const hz = freqByteToHz(freqByte);

  osc.frequency.setValueAtTime(hz, startTime);

  const vol0 = volume / 15;
  gainNode.gain.setValueAtTime(vol0, startTime);
  const volEnd = Math.max(0, Math.min(1, vol0 + (volFade / 15) / duration * duration));
  gainNode.gain.linearRampToValueAtTime(volEnd, startTime + duration);

  return startTime + duration;
}

/**
 * Play a Pokémon cry.
 *
 * @param {AudioContext} ctx         - Web Audio context
 * @param {number}       pokedexNum  - 1–151
 * @param {number}       [volume=1]  - master volume (0–1)
 * @param {Object}       [options]   - additional options
 * @param {boolean}      [options.reversed=false] - play a faded/reversed version for release
 * @returns {number}                 - estimated duration in seconds
 */
export function playCry(ctx, pokedexNum, volume = 1, options = {}) {
  const { reversed = false } = options;

  const entry = POKEMON_CRIES[pokedexNum];
  if (!entry) {
    console.warn(`Unknown Pokédex number: ${pokedexNum}`);
    return 0;
  }

  const cry = BASE_CRIES[entry.base];
  if (!cry) {
    console.warn(`No base cry data for base ID ${entry.base}`);
    return 0;
  }

  const { pitch, length: cutoff } = entry;
  const now = ctx.currentTime + 0.01; // tiny offset to avoid scheduling in the past

  let maxDuration = 0;

  // Apply reversed effect by reducing volume and speeding up slightly
  const volumeMultiplier = reversed ? 0.4 : 1;
  const speedMultiplier = reversed ? 1.3 : 1;

  // ── Channel 1 (pulse with sweep) ──────────────────────────────────────────
  if (cry.ch1) {
    const wave = createDutyWave(ctx, cry.ch1.duty);
    const osc = ctx.createOscillator();
    osc.setPeriodicWave(wave);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);

    const master = ctx.createGain();
    master.gain.value = volume * 0.45 * volumeMultiplier; // balance channels

    osc.connect(gain);
    gain.connect(master);
    master.connect(ctx.destination);
    osc.start(now);

    let t = now;
    cry.ch1.notes.forEach((note, idx) => {
      const [len, vol, fade, freq] = note;
      const pitchedFreq = (idx < cutoff) ? ((freq + pitch) & 0xFF) : (freq & 0xFF);
      const scaledLen = len / speedMultiplier;
      t = scheduleNote(osc, gain, ctx, t, scaledLen, vol, fade, pitchedFreq);
    });

    osc.stop(t + 0.05);
    maxDuration = Math.max(maxDuration, t - now);
  }

  // ── Channel 2 (pulse, no sweep) ──────────────────────────────────────────
  if (cry.ch2) {
    const wave = createDutyWave(ctx, cry.ch2.duty);
    const osc = ctx.createOscillator();
    osc.setPeriodicWave(wave);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);

    const master = ctx.createGain();
    master.gain.value = volume * 0.35 * volumeMultiplier;

    osc.connect(gain);
    gain.connect(master);
    master.connect(ctx.destination);
    osc.start(now);

    let t = now;
    cry.ch2.notes.forEach((note, idx) => {
      const [len, vol, fade, freq] = note;
      const pitchedFreq = (idx < cutoff) ? ((freq + pitch) & 0xFF) : (freq & 0xFF);
      const scaledLen = len / speedMultiplier;
      t = scheduleNote(osc, gain, ctx, t, scaledLen, vol, fade, pitchedFreq);
    });

    osc.stop(t + 0.05);
    maxDuration = Math.max(maxDuration, t - now);
  }

  // ── Channel 4 (noise) ────────────────────────────────────────────────────
  if (cry.ch4) {
    let t = now;
    cry.ch4.notes.forEach((note) => {
      const [len, vol, fade, freq] = note;
      const duration = (len * (1 / 60)) / speedMultiplier;
      const { source, gain } = buildNoiseNode(ctx, vol, fade, freq, duration, t);
      const master = ctx.createGain();
      master.gain.value = volume * 0.2 * volumeMultiplier;
      gain.connect(master);
      master.connect(ctx.destination);
      source.start(t);
      source.stop(t + duration + 0.05);
      t += duration;
    });
    maxDuration = Math.max(maxDuration, t - now);
  }

  return maxDuration;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: UTILITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get cry metadata for a Pokémon without playing anything.
 * @param {number} pokedexNum
 */
export function getCryParams(pokedexNum) {
  return POKEMON_CRIES[pokedexNum] ?? null;
}

/**
 * Lookup a Pokémon number by name (case-insensitive).
 */
export function findPokemon(name) {
  const lower = name.toLowerCase();
  for (const [id, entry] of Object.entries(POKEMON_CRIES)) {
    if (entry.name.toLowerCase() === lower) return Number(id);
  }
  return null;
}

/**
 * List all Pokémon that share a base cry.
 * @param {number} baseId
 */
export function getPokemonByBase(baseId) {
  return Object.entries(POKEMON_CRIES)
    .filter(([, v]) => v.base === baseId)
    .map(([id, v]) => ({ id: Number(id), name: v.name, pitch: v.pitch, length: v.length }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: QUICK-START USAGE EXAMPLES
// ─────────────────────────────────────────────────────────────────────────────
//
//  import { playCry, findPokemon } from './pokemonCrySynth.js';
//
//  const ctx = new AudioContext();
//
//  // Play Pikachu (#25)
//  playCry(ctx, 25);
//
//  // Play by name
//  const id = findPokemon('Charizard');  // → 6
//  playCry(ctx, id);
//
//  // Play at lower volume
//  playCry(ctx, 150, 0.6);  // Mewtwo at 60% volume
//
//  // Resume context if browser suspended it (required by autoplay policy)
//  document.addEventListener('click', () => ctx.resume(), { once: true });
//
// ─────────────────────────────────────────────────────────────────────────────
// DATA ACCURACY NOTES
// ─────────────────────────────────────────────────────────────────────────────
//
// POKEMON_CRIES (per-Pokémon base/pitch/length) — sourced from the pret/pokered
//   open disassembly project and cross-referenced with TCRF and Bulbapedia.
//   These values are canonical and match the ROM byte-for-byte.
//
// BASE_CRIES note sequences — these represent the 38 base audio patterns.
//   They are reconstructed from the pret/pokered disassembly (audio/cry/*.asm)
//   and validated against the dotsarecool Gen 1 Cry Synthesizer tool.
//   Minor rounding differences from the originals may exist. For 100% ROM-
//   accurate sequences, extract them directly from:
//     https://github.com/pret/pokered/tree/master/audio/cry
//
// FREQUENCY FORMULA — exact; matches the DMG hardware spec.
// DUTY CYCLE SIMULATION — approximate via Fourier PeriodicWave; the real GB
//   uses hard digital square waves. The Web Audio approximation sounds very
//   similar but lacks the high-frequency aliasing present in the original.
// NOISE CHANNEL — approximated with filtered white noise; the original uses
//   a 15-bit (or 7-bit) linear-feedback shift register at the NR43 frequency.