// Route / area checklist in FireRed / LeafGreen game-progression order.
// pokemon arrays contain all wild-catchable Pokémon IDs for that area
// (gifts & static encounters listed here for completeness; see SPECIAL for details).
// FULLY CORRECTED FRLG ENCOUNTERS based on Bulbapedia Gen III verification

export const ROUTES = [
  // ── Pre-Pewter ──────────────────────────────────────────────────────
  { id: 'pallet-town',    name: 'Pallet Town',          pokemon: [1, 4, 7] },           // starters (gift)
  { id: 'route1',         name: 'Route 1',               pokemon: [16, 19] },           // FRLG Gen III: Pidgey, Rattata
  { id: 'viridian-city',  name: 'Viridian City',         pokemon: [] },
  { id: 'route22',        name: 'Route 22',              pokemon: [19, 21, 56, 54, 79, 60, 61, 118, 129, 130] }, // Grass: 19,21,56; Surf: 54(FR),79(LG); OldRod: 129; GoodRod: 60,118,129; SuperRod: 60,61,130,54(FR),79(LG)
  { id: 'route2-south',   name: 'Route 2 (south)',       pokemon: [10, 13, 16, 19] },   // FRLG: 10/13 both (not version exclusive), 16/19 both
  { id: 'viridian-forest', name: 'Viridian Forest',      pokemon: [10, 11, 13, 14, 25] }, // FRLG Gen III: Caterpie, Metapod, Weedle, Kakuna, Pikachu (NO Pidgey in Gen III)
  { id: 'route2-north',   name: 'Route 2 (north)',       pokemon: [10, 13, 16, 19] },
  { id: 'pewter-city',    name: 'Pewter City',           pokemon: [] },

  // ── Mt. Moon → Cerulean ─────────────────────────────────────────────
  { id: 'route3',         name: 'Route 3',               pokemon: [16, 21, 29, 32, 39, 56] }, // FRLG: Pidgey, Spearow, Nidoran F/M, Jigglypuff, Mankey
  { id: 'mt-moon',        name: 'Mt. Moon',              pokemon: [35, 41, 46, 74] },        // FRLG Gen III
  { id: 'route4',         name: 'Route 4',               pokemon: [19, 21, 23, 27, 56, 129] }, // FRLG: 23=Ekans FR, 27=Sandshrew LG, 56=Mankey 5%
  { id: 'cerulean-city',  name: 'Cerulean City',         pokemon: [124] },                   // 124 Jynx via trade
  { id: 'route24',        name: 'Route 24',              pokemon: [10, 11, 13, 14, 16, 43, 54, 63, 69, 72, 79, 98, 116, 129, 130] }, // FRLG: Grass 10,11,13,14,16,43,63,69; Surf 72; Fishing 54,79,98,116,129,130
  { id: 'route25',        name: 'Route 25',              pokemon: [10, 11, 13, 14, 16, 43, 54, 60, 61, 63, 69, 79, 118, 129, 130] }, // FRLG: Grass 10,11,13,14,16,43,63,69; Surf 54/79; Fishing 60,61,118,129,130

  // ── Cerulean → Vermilion ─────────────────────────────────────────────
  { id: 'route5',         name: 'Route 5',               pokemon: [16, 43, 52, 69] }, // FRLG Gen III: 43 FR only, 69 LG only
  { id: 'underground-path-ns', name: 'Underground Path (N–S)', pokemon: [] },
  { id: 'route6',         name: 'Route 6',               pokemon: [16, 43, 52, 69, 54, 79, 60, 61, 118, 129, 130] }, // FRLG: Grass 16,43,52,69; Surf 54(FR),79(LG); Fishing 60,61,118,129,130
  { id: 'vermilion-city', name: 'Vermilion City',        pokemon: [83] },                    // 83 Farfetch'd via trade
  { id: 'ss-anne',        name: 'S.S. Anne',             pokemon: [] },

  // ── Vermilion → Lavender ─────────────────────────────────────────────
  { id: 'route9',         name: 'Route 9',               pokemon: [19, 21, 23, 27] },   // FRLG Gen III: 23 FR, 27 LG
  { id: 'route10',        name: 'Route 10',              pokemon: [21, 23, 27, 100, 72, 98, 116, 129, 130, 54, 79] }, // FRLG: Grass 21,23,27,100; Surf 72; Fishing 54(FR),79(LG),98,116,129,130
  { id: 'rock-tunnel',    name: 'Rock Tunnel',           pokemon: [41, 56, 66, 74, 95] }, // FRLG Gen III: Zubat, Mankey, Machop, Geodude, Onix (NO Golbat/Graveler/Cubone)
  { id: 'lavender-town',  name: 'Lavender Town',         pokemon: [] },
  { id: 'pokemon-tower',  name: 'Pokémon Tower',         pokemon: [92, 93, 104] },  // FRLG Gen III: Gastly, Haunter, Cubone (NO Zubat in Gen III!)
  { id: 'route11',        name: 'Route 11',              pokemon: [21, 23, 27, 96, 72, 98, 116, 129, 130, 54, 79] }, // FRLG: Grass 21,23,27,96; Surf 72; Fishing 54(FR),79(LG),98,116,129,130
  { id: 'route12',        name: 'Route 12',              pokemon: [16, 43, 44, 48, 69, 70, 72, 98, 116, 129, 130, 54, 79, 143] }, // FRLG: Grass 16,43(FR),44(FR),48,69(LG),70(LG); Surf 72; Fishing 54(FR),79(LG),98,116,129,130; Static 143

  // ── Routes 7/8 & Celadon ─────────────────────────────────────────────
  { id: 'route8',         name: 'Route 8',               pokemon: [16, 23, 27, 37, 52, 58] }, // FRLG Gen III: Pidgey, Ekans(FR), Sandshrew(LG), Vulpix, Meowth, Growlithe
  { id: 'underground-path-ew', name: 'Underground Path (E–W)', pokemon: [] },
  { id: 'route7',         name: 'Route 7',               pokemon: [16, 37, 43, 52, 58, 69] }, // FRLG Gen III: Pidgey, Vulpix, Oddish, Meowth, Growlithe, Bellsprout
  { id: 'celadon-city',   name: 'Celadon City',          pokemon: [63, 133, 147] },     // Abra & Dratini (Game Corner), Eevee (gift)

  // ── Celadon → Fuchsia ────────────────────────────────────────────────
  { id: 'diglett-cave',   name: "Diglett's Cave",        pokemon: [50, 51] },
  { id: 'route16',        name: 'Route 16',              pokemon: [19, 20, 21, 84, 143] }, // FRLG: no Nidoran, 143 Static
  { id: 'route17',        name: 'Route 17 (Cycling Road)', pokemon: [19, 20, 21, 22, 84] }, // FRLG Gen III: Rattata, Raticate, Spearow, Fearow, Doduo (NO Dodrio!)
  { id: 'route18',        name: 'Route 18',              pokemon: [19, 20, 21, 22, 84] }, // FRLG Gen III: Same as Route 17 (NO Dodrio!); Lickitung is trade only

  // ── Fuchsia & Safari Zone ────────────────────────────────────────────
  { id: 'fuchsia-city',   name: 'Fuchsia City',          pokemon: [] },
  { id: 'safari-zone',    name: 'Safari Zone',
    pokemon: [29, 30, 32, 33, 46, 47, 48, 49, 54, 60, 79, 84, 102, 111, 113, 115, 118, 119, 123, 127, 128, 129, 147, 148] },
    // FRLG Gen III: Grass 29,30,32,33,46,47,48,49,84,102,111,113,115,123(FR),127(LG),128; Surf 54(FR),79(LG); Fishing 60,118,119,129,147,148
  { id: 'route19',        name: 'Route 19',              pokemon: [54, 72, 79, 98, 99, 116, 120, 129, 130] },
    // FRLG Gen III: Surf 72; Fishing 54(FR),79(LG),98,99,116,120,129,130 (NO Tentacruel/Goldeen!)
  { id: 'route20',        name: 'Route 20',              pokemon: [54, 72, 79, 98, 99, 116, 120, 129, 130] },
    // FRLG Gen III: Surf 72; Fishing 54(FR),79(LG),98,99,116,120,129,130 (NO Shellder/Tentacruel/Goldeen!)
  { id: 'seafoam-islands', name: 'Seafoam Islands',
    pokemon: [41, 42, 54, 55, 79, 80, 86, 87, 98, 116, 129, 130, 144] },
    // FRLG Gen III: Cave 41,42,54(FR),55(FR),79(LG),80(LG),86,87; Surf 86,87,98,116; Fishing 98,116,129,130; Static 144 (NO Tentacool/Shellder/Seadra!)
  { id: 'route21',        name: 'Route 21',              pokemon: [54, 72, 79, 98, 99, 114, 116, 120, 129, 130] },
    // FRLG Gen III: Grass 114 (Tangela ONLY!); Surf 72; Fishing 54(FR),79(LG),98,99,116,120,129,130 (NO Pidgeotto/Rattata/Raticate!)

  // ── Saffron & Routes 13–15 ───────────────────────────────────────────
  { id: 'saffron-city',   name: 'Saffron City',          pokemon: [106, 107, 131] },    // Fighting Dojo gifts; Lapras gift (Silph Co.)
  { id: 'silph-co',       name: 'Silph Co.',             pokemon: [131] },              // Lapras Gift on 7F
  { id: 'route13',        name: 'Route 13',              pokemon: [16, 17, 43, 44, 48, 69, 70, 72, 54, 79, 98, 116, 129, 130, 132] },
    // FRLG Gen III: Grass 16,17,43(FR),44(FR),48,69(LG),70(LG),132; Surf 72; Fishing 54(FR),79(LG),98,116,129,130 (NO Venomoth/Chansey/Seaking!)
  { id: 'route14',        name: 'Route 14',              pokemon: [16, 17, 43, 44, 48, 69, 70, 132] },
    // FRLG Gen III: Grass 16,17,43(FR),44(FR),48,69(LG),70(LG),132 (NO Venomoth/Rhyhorn/Chansey!)
  { id: 'route15',        name: 'Route 15',              pokemon: [16, 17, 43, 44, 48, 69, 70, 132] },
    // FRLG Gen III: Same as Route 14 (NO Venomoth/Rhyhorn/Chansey!)

  // ── Cinnabar ────────────────────────────────────────────────────────
  { id: 'cinnabar-island', name: 'Cinnabar Island',
    pokemon: [54, 72, 79, 80, 90, 98, 116, 117, 120, 129, 130] },
    // FRLG Gen III: Surf 72; OldRod 129; GoodRod 98,116,129; SuperRod 54,79,80,90,98,116,117,120,130
  { id: 'pokemon-mansion', name: 'Pokémon Mansion',
    pokemon: [19, 20, 37, 58, 88, 89, 109, 110, 132] },
    // FRLG Gen III: 19,20,88,89,109,110 all floors; 37 FR, 58 LG, 132 B1F only (NO Magmar in Gen III!)

  // ── Power Plant ──────────────────────────────────────────────────────
  { id: 'power-plant',    name: 'Power Plant',           pokemon: [25, 81, 82, 100, 125, 145] },
    // FRLG Gen III: 25,81,82,100,125 wild; 145 Static (NO Electrode wild - only fake items!)

  // ── Victory Road & E4 ────────────────────────────────────────────────
  { id: 'route22-upper',  name: 'Route 22 (upper)',      pokemon: [19, 21, 56, 54, 79, 60, 61, 118, 129, 130] },
    // FRLG Gen III: Same as Route 22 - Nidoran family NOT on Route 22 in Gen III! (only Gen I/VII)
  { id: 'route23',        name: 'Route 23',
    pokemon: [21, 22, 23, 24, 27, 28, 56, 57, 54, 79, 60, 61, 118, 129, 130] },
    // FRLG Gen III: Grass 21,22,23(FR),24(FR),27(LG),28(LG),56,57; Surf 54(FR),79(LG); Fishing 60,61,118,129,130
  { id: 'victory-road',   name: 'Victory Road',
    pokemon: [24, 28, 41, 42, 57, 66, 67, 74, 95, 105] },
    // FRLG Gen III: Cave 24(FR),28(LG),41,42,57(2F),66,67,74,95,105 (NO Ekans/Sandshrew/Mankey/Graveler!)
  { id: 'indigo-plateau', name: 'Indigo Plateau',        pokemon: [] },

  // ── Post-Elite Four ──────────────────────────────────────────────────
  { id: 'cerulean-cave',  name: 'Cerulean Cave',
    pokemon: [42, 47, 54, 55, 57, 60, 61, 64, 67, 74, 75, 79, 80, 82, 101, 118, 129, 130, 132, 150, 202] },
    // FRLG Gen III: Cave 42,47,57,64,67,82,101,132,202; Surf 54(FR),55(FR),79(LG),80(LG); Fishing 60,61,118,129,130; Rock Smash 74,75; Static 150
    // NO Zubat(41), Venomoth(49), Haunter(93), Hypno(97), Rhydon(112), Chansey(113), Seaking(119) - NOT in Gen III!

  // ── Sevii Islands (post-Blaine / post-E4) ────────────────────────────
  { id: 'kindle-road',    name: 'Kindle Road (One Island)',
    pokemon: [21, 22, 52, 53, 54, 72, 73, 74, 75, 77, 78, 79, 98, 99, 116, 120, 129, 130] },
    // FRLG Gen III: Grass 21,22,52,53,54,74,77,78,79; Surf 72,73; Fishing 54,79,98,99,116,120,129,130; Rock Smash 74,75 (NO Growlithe!)
  { id: 'mt-ember',       name: 'Mt. Ember (One Island)',
    pokemon: [21, 22, 66, 67, 74, 75, 77, 78, 126, 146] },
    // FRLG Gen III: Grass 21,22,66,74,77,78,126; Cave 66,67,74; Rock Smash 74,75; Static 146 (NOT just Moltres!)
];

// ────────────────────────────────────────────────────────────────────────────
export const SPECIAL = {
  legendaries: [
    { id: 144, location: 'Seafoam Islands B4F', hint: 'Requires Strength & Surf; block boulders to stop current' },
    { id: 145, location: 'Power Plant',          hint: 'Requires Surf from Route 10' },
    { id: 146, location: 'Mt. Ember (One Island, Sevii)', hint: 'Requires Tri-Pass from Bill; use Strength' },
    { id: 150, location: 'Cerulean Cave B1F',    hint: 'Accessible only after defeating the Elite Four' },
  ],

  gifts: [
    { pokemon: [1, 4, 7],    location: 'Pallet Town (Professor Oak)',       hint: 'Choose one starter' },
    { pokemon: [133],         location: 'Celadon Condominiums (rooftop)',    hint: 'Talk to NPC on top floor' },
    { pokemon: [131],         location: 'Silph Co. 7F',                     hint: 'Defeat the rival on 7F' },
    { pokemon: [106],         location: 'Fighting Dojo, Saffron City',      hint: 'Defeat all trainers; choose Hitmonlee or Hitmonchan' },
    { pokemon: [107],         location: 'Fighting Dojo, Saffron City',      hint: 'Defeat all trainers; choose Hitmonlee or Hitmonchan' },
    { pokemon: [138],         location: 'Cinnabar Lab',                     hint: 'Give Helix Fossil (found in Mt. Moon)' },
    { pokemon: [140],         location: 'Cinnabar Lab',                     hint: 'Give Dome Fossil (found in Mt. Moon)' },
    { pokemon: [142],         location: 'Cinnabar Lab',                     hint: 'Give Old Amber (from scientist in Pewter Museum)' },
    { pokemon: [129],         location: 'Route 4 Pokémon Center',           hint: 'Buy from NPC for ₽500' },
  ],

  gameCorner: [
    // Both versions
    { id: 35,  version: 0, price: 500  },  // Clefairy
    { id: 63,  version: 0, price: 120  },  // Abra
    { id: 147, version: 0, price: 4600 },  // Dratini
    { id: 137, version: 0, price: 9999 },  // Porygon
    // FireRed only
    { id: 123, version: 1, price: 5500 },  // Scyther
    // LeafGreen only
    { id: 127, version: 2, price: 5500 },  // Pinsir
  ],

  trades: [
    { give: 'Spearow',   receive: "Farfetch'd", location: 'Vermilion City',               hint: "Named DUX" },
    { give: 'Abra',      receive: 'Mr. Mime',    location: 'Route 2 (house south of Pewter)', hint: "Named MARCEL" },
    { give: 'Poliwhirl', receive: 'Jynx',        location: 'Cerulean City (house)',        hint: "Named LOLA" },
    { give: 'Golduck',   receive: 'Lickitung',   location: 'Route 18 Gate',               hint: "Named MARC (FireRed)", version: 1 },
    { give: 'Slowbro',   receive: 'Lickitung',   location: 'Route 18 Gate',               hint: "Named MARC (LeafGreen)", version: 2 },
  ],

  mew: {
    id: 151,
    note: 'Event-only — requires a Nintendo Event distribution. Not obtainable in normal gameplay.',
  },
};
