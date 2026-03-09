// Encounter locations for all 151 Kanto Pokémon — FireRed / LeafGreen CORRECTED
// Based on comprehensive Bulbapedia Gen III data verification
// Key: Pokédex ID
// Value: [[areaName, encounterMethod, version], ...]
//   version: 0 = both FR & LG | 1 = FireRed only | 2 = LeafGreen only
// Methods: 'Grass' | 'Surf' | 'Old Rod' | 'Good Rod' | 'Super Rod'
//        | 'Gift' | 'Trade' | 'Fossil' | 'Game Corner' | 'Evolve'
//        | 'Roaming' | 'Static'

export const LOCATIONS = {
  // ── Starters ───────────────────────────────────────────────────────
  1:   [['Pallet Town', 'Gift', 0]],
  2:   [['Evolve Bulbasaur', 'Evolve', 0]],
  3:   [['Evolve Ivysaur', 'Evolve', 0]],

  4:   [['Pallet Town', 'Gift', 0]],
  5:   [['Evolve Charmander', 'Evolve', 0]],
  6:   [['Evolve Charmeleon', 'Evolve', 0]],

  7:   [['Pallet Town', 'Gift', 0]],
  8:   [['Evolve Squirtle', 'Evolve', 0]],
  9:   [['Evolve Wartortle', 'Evolve', 0]],

  // ── Bugs ────────────────────────────────────────────────────────────
  // Caterpie (10) - Viridian Forest, Route 2
  10:  [
    ['Viridian Forest', 'Grass', 0],
    ['Route 2', 'Grass', 0],
  ],
  11:  [
    ['Viridian Forest', 'Grass', 0],
    ['Route 2', 'Grass', 0],
  ],
  12:  [['Evolve Metapod', 'Evolve', 0]],

  // Weedle (13) - Viridian Forest, Route 2 (LG only)
  13:  [
    ['Viridian Forest', 'Grass', 2],
    ['Route 2', 'Grass', 2],
  ],
  14:  [
    ['Viridian Forest', 'Grass', 2],
    ['Route 2', 'Grass', 2],
  ],
  15:  [['Evolve Kakuna', 'Evolve', 0]],

  // ── Birds ────────────────────────────────────────────────────────────
  16:  [
    ['Route 1', 'Grass', 0],
    ['Route 2', 'Grass', 0],
    ['Route 3', 'Grass', 0],
    ['Viridian Forest', 'Grass', 0],
  ],
  17:  [
    ['Route 14', 'Grass', 0],
    ['Route 15', 'Grass', 0],
    ['Route 21', 'Grass', 0],
  ],
  18:  [['Evolve Pidgeotto', 'Evolve', 0]],

  19:  [
    ['Route 1', 'Grass', 0],
    ['Route 2', 'Grass', 0],
    ['Route 3', 'Grass', 0],
    ['Route 4', 'Grass', 0],
    ['Route 5', 'Grass', 0],
    ['Route 6', 'Grass', 0],
    ['Route 9', 'Grass', 0],
    ['Route 10', 'Grass', 0],
    ['Route 22', 'Grass', 0],
  ],
  20:  [
    ['Route 16', 'Grass', 0],
    ['Route 17', 'Grass', 0],
    ['Route 18', 'Grass', 0],
    ['Route 21', 'Grass', 0],
  ],

  21:  [
    ['Route 3', 'Grass', 0],
    ['Route 4', 'Grass', 0],
    ['Route 10', 'Grass', 0],
    ['Route 11', 'Grass', 0],
    ['Route 22', 'Grass', 0],
  ],
  22:  [
    ['Route 17', 'Grass', 0],
    ['Route 18', 'Grass', 0],
  ],

  // ── Ekans / Sandshrew lines (version-exclusive) ──────────────────────
  23:  [
    ['Route 3', 'Grass', 1],
    ['Route 4', 'Grass', 1],
    ['Route 10', 'Grass', 1],
    ['Route 11', 'Grass', 1],
  ],
  24:  [
    ['Route 23', 'Grass', 1],
    ['Victory Road', 'Grass', 1],
  ],

  27:  [
    ['Route 3', 'Grass', 2],
    ['Route 4', 'Grass', 2],
    ['Route 10', 'Grass', 2],
    ['Route 11', 'Grass', 2],
  ],
  28:  [
    ['Route 23', 'Grass', 2],
    ['Victory Road', 'Grass', 2],
  ],

  // ── Pikachu / Raichu ─────────────────────────────────────────────────
  25:  [
    ['Viridian Forest', 'Grass', 0],
    ['Power Plant', 'Grass', 0],
  ],
  26:  [['Evolve Pikachu', 'Evolve', 0]],

  // ── Nidoran lines ────────────────────────────────────────────────────
  29:  [
    ['Route 3', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  30:  [
    ['Route 23', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  31:  [['Evolve Nidorina', 'Evolve', 0]],

  32:  [
    ['Route 3', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  33:  [
    ['Route 23', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  34:  [['Evolve Nidorino', 'Evolve', 0]],

  // ── Clefairy / Clefable ──────────────────────────────────────────────
  35:  [
    ['Mt. Moon', 'Grass', 0],
    ['Celadon Game Corner', 'Game Corner', 0],
  ],
  36:  [['Evolve Clefairy', 'Evolve', 0]],

  // ── Vulpix / Ninetales (LeafGreen only) ──────────────────────────────
  37:  [
    ['Route 7', 'Grass', 2],
    ['Route 8', 'Grass', 2],
    ['Pokémon Mansion', 'Grass', 2],
  ],
  38:  [['Evolve Vulpix', 'Evolve', 0]],

  // ── Jigglypuff / Wigglytuff ──────────────────────────────────────────
  39:  [
    ['Route 3', 'Grass', 0],
    ['Route 5', 'Grass', 0],
    ['Route 6', 'Grass', 0],
    ['Route 7', 'Grass', 0],
    ['Route 8', 'Grass', 0],
  ],
  40:  [['Evolve Jigglypuff', 'Evolve', 0]],

  // ── Zubat / Golbat ───────────────────────────────────────────────────
  41:  [
    ['Mt. Moon', 'Grass', 0],
    ['Rock Tunnel', 'Grass', 0],
    ['Seafoam Islands', 'Grass', 0],
    ['Victory Road', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],
  42:  [
    ['Rock Tunnel', 'Grass', 0],
    ['Seafoam Islands', 'Grass', 0],
    ['Victory Road', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],

  // ── Oddish line (FireRed only) ───────────────────────────────────────
  43:  [
    ['Route 5', 'Grass', 1],
    ['Route 6', 'Grass', 1],
    ['Route 7', 'Grass', 1],
    ['Route 8', 'Grass', 1],
    ['Route 12', 'Grass', 1],
    ['Route 13', 'Grass', 1],
  ],
  44:  [
    ['Route 12', 'Grass', 1],
    ['Route 13', 'Grass', 1],
    ['Route 14', 'Grass', 1],
    ['Route 15', 'Grass', 1],
  ],
  45:  [['Evolve Gloom', 'Evolve', 0]],

  // ── Paras / Parasect ─────────────────────────────────────────────────
  46:  [
    ['Mt. Moon', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  47:  [
    ['Safari Zone', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],

  // ── Venonat / Venomoth ───────────────────────────────────────────────
  48:  [
    ['Route 12', 'Grass', 0],
    ['Route 13', 'Grass', 0],
    ['Route 14', 'Grass', 0],
    ['Route 15', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  49:  [
    ['Route 14', 'Grass', 0],
    ['Route 15', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],

  // ── Diglett / Dugtrio ────────────────────────────────────────────────
  50:  [["Diglett's Cave", 'Grass', 0]],
  51:  [["Diglett's Cave", 'Grass', 0]],

  // ── Meowth / Persian (LeafGreen only) ────────────────────────────────
  52:  [
    ['Route 5', 'Grass', 2],
    ['Route 6', 'Grass', 2],
    ['Route 7', 'Grass', 2],
    ['Route 8', 'Grass', 2],
  ],
  53:  [['Evolve Meowth', 'Evolve', 0]],

  // ── Psyduck / Golduck (FireRed only) ─────────────────────────────────
  54:  [
    ['Route 22', 'Surf', 1],
    ['Seafoam Islands', 'Surf', 1],
  ],
  55:  [
    ['Evolve Psyduck', 'Evolve', 0],
    ['Cerulean Cave', 'Surf', 0],
  ],

  // ── Mankey / Primeape ────────────────────────────────────────────────
  56:  [
    ['Route 3', 'Grass', 0],
    ['Route 5', 'Grass', 0],
    ['Route 6', 'Grass', 0],
    ['Route 7', 'Grass', 0],
    ['Route 8', 'Grass', 0],
    ['Route 22', 'Grass', 0],
  ],
  57:  [
    ['Route 23', 'Grass', 0],
    ['Victory Road', 'Grass', 0],
  ],

  // ── Growlithe / Arcanine (FireRed only) ──────────────────────────────
  58:  [
    ['Route 7', 'Grass', 1],
    ['Route 8', 'Grass', 1],
    ['Pokémon Mansion', 'Grass', 1],
  ],
  59:  [['Evolve Growlithe', 'Evolve', 0]],

  // ── Poliwag line ─────────────────────────────────────────────────────
  60:  [
    ['Route 22', 'Good Rod', 0],
    ['Route 23', 'Surf', 0],
    ['Route 25', 'Surf', 0],
    ['Pallet Town', 'Surf', 0],
    ['Cerulean Cave', 'Surf', 0],
  ],
  61:  [
    ['Evolve Poliwag', 'Evolve', 0],
    ['Route 22', 'Super Rod', 0],
    ['Cerulean Cave', 'Surf', 0],
  ],
  62:  [['Evolve Poliwhirl', 'Evolve', 0]],

  // ── Abra line ────────────────────────────────────────────────────────
  63:  [
    ['Route 5', 'Grass', 0],
    ['Route 6', 'Grass', 0],
    ['Route 7', 'Grass', 0],
    ['Route 8', 'Grass', 0],
    ['Celadon Game Corner', 'Game Corner', 0],
  ],
  64:  [
    ['Evolve Abra', 'Evolve', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],
  65:  [['Evolve Kadabra (trade)', 'Trade', 0]],

  // ── Machop line ──────────────────────────────────────────────────────
  66:  [
    ['Rock Tunnel', 'Grass', 0],
    ['Victory Road', 'Grass', 0],
  ],
  67:  [
    ['Evolve Machop', 'Evolve', 0],
    ['Victory Road', 'Grass', 0],
  ],
  68:  [['Evolve Machoke (trade)', 'Trade', 0]],

  // ── Bellsprout line (LeafGreen only) ─────────────────────────────────
  69:  [
    ['Route 5', 'Grass', 2],
    ['Route 6', 'Grass', 2],
    ['Route 7', 'Grass', 2],
    ['Route 8', 'Grass', 2],
    ['Route 12', 'Grass', 2],
    ['Route 13', 'Grass', 2],
  ],
  70:  [
    ['Route 12', 'Grass', 2],
    ['Route 13', 'Grass', 2],
    ['Route 14', 'Grass', 2],
    ['Route 15', 'Grass', 2],
  ],
  71:  [['Evolve Weepinbell', 'Evolve', 0]],

  // ── Tentacool / Tentacruel ───────────────────────────────────────────
  72:  [
    ['Route 19', 'Surf', 0],
    ['Route 20', 'Surf', 0],
    ['Route 21', 'Surf', 0],
    ['Seafoam Islands', 'Surf', 0],
    ['Cinnabar Island', 'Surf', 0],
  ],
  73:  [
    ['Route 19', 'Surf', 0],
    ['Route 20', 'Surf', 0],
    ['Seafoam Islands', 'Surf', 0],
  ],

  // ── Geodude line ─────────────────────────────────────────────────────
  74:  [
    ['Mt. Moon', 'Grass', 0],
    ['Rock Tunnel', 'Grass', 0],
    ['Victory Road', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],
  75:  [
    ['Rock Tunnel', 'Grass', 0],
    ['Victory Road', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],
  76:  [['Evolve Graveler (trade)', 'Trade', 0]],

  // ── Ponyta / Rapidash (Sevii Islands only in FRLG) ──────────────────
  77:  [['Kindle Road (One Island, Sevii)', 'Grass', 0]],
  78:  [['Kindle Road (One Island, Sevii)', 'Grass', 0]],

  // ── Slowpoke / Slowbro (LeafGreen only) ──────────────────────────────
  79:  [
    ['Route 22', 'Surf', 2],
    ['Seafoam Islands', 'Surf', 2],
  ],
  80:  [['Evolve Slowpoke', 'Evolve', 0]],

  // ── Magnemite / Magneton ─────────────────────────────────────────────
  81:  [['Power Plant', 'Grass', 0]],
  82:  [
    ['Power Plant', 'Grass', 0],
    ['Evolve Magnemite', 'Evolve', 0],
  ],

  // ── Farfetch'd ────────────────────────────────────────────────────────
  83:  [['Vermilion City', 'Trade', 0]],  // trade Spearow for Farfetch'd

  // ── Doduo / Dodrio ───────────────────────────────────────────────────
  84:  [
    ['Route 16', 'Grass', 0],
    ['Route 17', 'Grass', 0],
    ['Route 18', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  85:  [
    ['Route 17', 'Grass', 0],
    ['Route 18', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],

  // ── Seel / Dewgong ───────────────────────────────────────────────────
  86:  [['Seafoam Islands', 'Grass', 0]],
  87:  [
    ['Seafoam Islands', 'Grass', 0],
    ['Evolve Seel', 'Evolve', 0],
  ],

  // ── Grimer / Muk ─────────────────────────────────────────────────────
  88:  [['Pokémon Mansion', 'Grass', 0]],
  89:  [
    ['Pokémon Mansion', 'Grass', 0],
    ['Evolve Grimer', 'Evolve', 0],
  ],

  // ── Shellder / Cloyster (FireRed only, fishing) ──────────────────────
  90:  [
    ['Route 12', 'Super Rod', 1],
    ['Route 13', 'Super Rod', 1],
    ['Route 19', 'Super Rod', 1],
    ['Route 20', 'Super Rod', 1],
    ['Seafoam Islands', 'Super Rod', 1],
  ],
  91:  [['Evolve Shellder', 'Evolve', 0]],

  // ── Gastly line ──────────────────────────────────────────────────────
  92:  [
    ['Pokémon Tower', 'Grass', 0],
  ],
  93:  [
    ['Pokémon Tower', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],
  94:  [['Evolve Haunter (trade)', 'Trade', 0]],

  // ── Onix ─────────────────────────────────────────────────────────────
  95:  [
    ['Rock Tunnel', 'Grass', 0],
    ['Victory Road', 'Grass', 0],
  ],

  // ── Drowzee / Hypno ──────────────────────────────────────────────────
  96:  [
    ['Route 11', 'Grass', 0],
    ['Route 12', 'Grass', 0],
  ],
  97:  [
    ['Evolve Drowzee', 'Evolve', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],

  // ── Krabby / Kingler ─────────────────────────────────────────────────
  98:  [
    ['Route 10', 'Super Rod', 0],
    ['Route 11', 'Super Rod', 0],
    ['Route 12', 'Super Rod', 0],
    ['Seafoam Islands', 'Super Rod', 0],
    ['Cinnabar Island', 'Good Rod', 0],
  ],
  99:  [['Evolve Krabby', 'Evolve', 0]],

  // ── Voltorb / Electrode ──────────────────────────────────────────────
  100: [
    ['Route 10', 'Grass', 0],
    ['Power Plant', 'Grass', 0],
  ],
  101: [
    ['Power Plant', 'Grass', 0],
    ['Evolve Voltorb', 'Evolve', 0],
  ],

  // ── Exeggcute / Exeggutor ────────────────────────────────────────────
  102: [['Safari Zone', 'Grass', 0]],
  103: [['Evolve Exeggcute', 'Evolve', 0]],

  // ── Cubone / Marowak ─────────────────────────────────────────────────
  104: [
    ['Pokémon Tower', 'Grass', 0],
    ['Rock Tunnel', 'Grass', 0],
  ],
  105: [['Evolve Cubone', 'Evolve', 0]],

  // ── Fighting Dojo ────────────────────────────────────────────────────
  106: [['Fighting Dojo, Saffron City', 'Gift', 0]],
  107: [['Fighting Dojo, Saffron City', 'Gift', 0]],

  // ── Lickitung (in-game trade only) ───────────────────────────────────
  108: [
    ['Route 18 Gate', 'Trade', 1],   // trade Golduck for Lickitung (FR)
    ['Route 18 Gate', 'Trade', 2],   // trade Slowbro for Lickitung (LG)
  ],

  // ── Koffing / Weezing ────────────────────────────────────────────────
  109: [['Pokémon Mansion', 'Grass', 0]],
  110: [
    ['Pokémon Mansion', 'Grass', 0],
    ['Evolve Koffing', 'Evolve', 0],
  ],

  // ── Rhyhorn / Rhydon ─────────────────────────────────────────────────
  111: [
    ['Route 14', 'Grass', 0],
    ['Route 15', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
  ],
  112: [
    ['Evolve Rhyhorn', 'Evolve', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],

  // ── Chansey ──────────────────────────────────────────────────────────
  113: [
    ['Route 13', 'Grass', 0],
    ['Route 14', 'Grass', 0],
    ['Route 15', 'Grass', 0],
    ['Safari Zone', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],

  // ── Tangela ──────────────────────────────────────────────────────────
  114: [['Route 21', 'Grass', 0]],

  // ── Kangaskhan ───────────────────────────────────────────────────────
  115: [['Safari Zone', 'Grass', 0]],

  // ── Horsea / Seadra ──────────────────────────────────────────────────
  116: [
    ['Route 19', 'Super Rod', 0],
    ['Route 20', 'Super Rod', 0],
    ['Seafoam Islands', 'Super Rod', 0],
    ['Cinnabar Island', 'Good Rod', 0],
  ],
  117: [['Evolve Horsea', 'Evolve', 0]],

  // ── Goldeen / Seaking ────────────────────────────────────────────────
  118: [
    ['Route 12', 'Good Rod', 0],
    ['Route 13', 'Good Rod', 0],
    ['Route 22', 'Good Rod', 0],
    ['Route 19', 'Good Rod', 0],
    ['Route 20', 'Good Rod', 0],
    ['Safari Zone', 'Good Rod', 0],
    ['Cerulean Cave', 'Good Rod', 0],
  ],
  119: [
    ['Route 12', 'Super Rod', 0],
    ['Route 13', 'Super Rod', 0],
    ['Safari Zone', 'Super Rod', 0],
    ['Cerulean Cave', 'Super Rod', 0],
  ],

  // ── Staryu / Starmie (LeafGreen only) ────────────────────────────────
  120: [
    ['Seafoam Islands', 'Surf', 2],
    ['Cinnabar Island', 'Surf', 2],
  ],
  121: [['Evolve Staryu', 'Evolve', 0]],

  // ── Mr. Mime ─────────────────────────────────────────────────────────
  122: [['Route 2 (house south of Pewter)', 'Trade', 0]],  // trade Abra for Mr. Mime

  // ── Scyther (FireRed only) ────────────────────────────────────────────
  123: [
    ['Safari Zone', 'Grass', 1],
    ['Celadon Game Corner', 'Game Corner', 1],
  ],

  // ── Jynx ─────────────────────────────────────────────────────────────
  124: [['Cerulean City (house)', 'Trade', 0]],  // trade Poliwhirl for Jynx

  // ── Electabuzz (FireRed only) ─────────────────────────────────────────
  125: [['Power Plant', 'Grass', 1]],

  // ── Magmar (LeafGreen only) ───────────────────────────────────────────
  126: [['Pokémon Mansion', 'Grass', 2]],

  // ── Pinsir (LeafGreen only) ───────────────────────────────────────────
  127: [
    ['Safari Zone', 'Grass', 2],
    ['Celadon Game Corner', 'Game Corner', 2],
  ],

  // ── Tauros ───────────────────────────────────────────────────────────
  128: [['Safari Zone', 'Grass', 0]],

  // ── Magikarp / Gyarados ──────────────────────────────────────────────
  129: [
    ['Route 4 Pokémon Center', 'Gift', 0],  // NPC sells for ₽500
    ['Route 22', 'Good Rod', 0],
    ['Route 10', 'Old Rod', 0],
    ['Route 12', 'Old Rod', 0],
    ['Route 19', 'Old Rod', 0],
    ['Cinnabar Island', 'Old Rod', 0],
    ['Seafoam Islands', 'Old Rod', 0],
    ['Safari Zone', 'Old Rod', 0],
    ['Cerulean Cave', 'Old Rod', 0],
  ],
  130: [
    ['Evolve Magikarp', 'Evolve', 0],
    ['Route 22', 'Super Rod', 0],
    ['Cerulean Cave', 'Super Rod', 0],
  ],

  // ── Lapras ───────────────────────────────────────────────────────────
  131: [['Silph Co. 7F', 'Gift', 0]],

  // ── Ditto ────────────────────────────────────────────────────────────
  132: [
    ['Pokémon Mansion', 'Grass', 0],
    ['Cerulean Cave', 'Grass', 0],
  ],

  // ── Eevee & eeveelutions ─────────────────────────────────────────────
  133: [['Celadon Condominiums (rooftop)', 'Gift', 0]],
  134: [['Evolve Eevee (Water Stone)', 'Evolve', 0]],
  135: [['Evolve Eevee (Thunder Stone)', 'Evolve', 0]],
  136: [['Evolve Eevee (Fire Stone)', 'Evolve', 0]],

  // ── Porygon ──────────────────────────────────────────────────────────
  137: [['Celadon Game Corner', 'Game Corner', 0]],

  // ── Fossils ──────────────────────────────────────────────────────────
  138: [['Cinnabar Lab (Helix Fossil, Mt. Moon)', 'Fossil', 0]],
  139: [['Evolve Omanyte', 'Evolve', 0]],
  140: [['Cinnabar Lab (Dome Fossil, Mt. Moon)', 'Fossil', 0]],
  141: [['Evolve Kabuto', 'Evolve', 0]],
  142: [['Cinnabar Lab (Old Amber, Pewter Museum)', 'Fossil', 0]],

  // ── Snorlax ──────────────────────────────────────────────────────────
  143: [
    ['Route 12', 'Static', 0],
    ['Route 16', 'Static', 0],
  ],

  // ── Legendary birds ──────────────────────────────────────────────────
  144: [['Seafoam Islands', 'Static', 0]],
  145: [['Power Plant', 'Static', 0]],
  146: [['Mt. Ember (One Island, Sevii)', 'Static', 0]],

  // ── Dragon line ──────────────────────────────────────────────────────
  147: [
    ['Safari Zone', 'Super Rod', 0],
    ['Celadon Game Corner', 'Game Corner', 0],
  ],
  148: [
    ['Safari Zone', 'Super Rod', 0],
    ['Evolve Dratini', 'Evolve', 0],
  ],
  149: [['Evolve Dragonair', 'Evolve', 0]],

  // ── Mewtwo ───────────────────────────────────────────────────────────
  150: [['Cerulean Cave B1F', 'Static', 0]],

  // ── Mew (event only) ─────────────────────────────────────────────────
  151: [['Event only — not obtainable in normal gameplay', 'Static', 0]],
};
