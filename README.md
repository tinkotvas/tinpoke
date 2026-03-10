# tinpoke

> A browser-based Pokédex tracker for Pokémon FireRed / LeafGreen. Track your catches in real-time while playing.

![FireRed](https://img.shields.io/badge/FireRed-E3350D?logo=pokemon&logoColor=white)
![LeafGreen](https://img.shields.io/badge/LeafGreen-4CAF50?logo=pokemon&logoColor=white)
![Kanto](https://img.shields.io/badge/Kanto-151-blue)
![Offline](https://img.shields.io/badge/works-offline-orange)

Point your Switch capture card at the browser, mark Pokemon as caught, and track your progress — all in one screen.

---

## ✨ Features

| 🎮 Video Feed | Live video from USB capture card or camera |
|---|---|
| ⚡ Quick Catch | Floating overlay to mark catches without leaving gameplay |
| 🗺️ Routes | Every FRLG area from Pallet Town to Cerulean Cave + Sevii Islands |
| 📋 Route Overlay | Draggable, resizable panel showing Pokemon on your current route |
| 🏅 Badges | Track all 8 Kanto gym badges |
| 📊 Stats | Type coverage grid, catch timeline, milestone progress |
| ✨ Shiny Tracking | Shift+click a caught Pokemon to mark it shiny |
| 🎉 Celebrations | Confetti at 25%, 50%, 75%, and 100% completion |
| 🎨 Themes | Fire Red (dark) and Leaf Green (light) color schemes |
| 🔊 Sound | Catch, release, shiny, and victory sound effects |
| 💾 Offline | Builds to a single HTML file — no server needed |

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## 📦 Build

```bash
npm run build
```

Produces a single self-contained HTML file in `dist/` via `vite-plugin-singlefile`. Drop it anywhere and open it.

---

## 🎮 Controls

| Action | Input |
|---|---|
| Catch / Release | `Shift + Click` |
| Toggle Shiny | `Shift + Click` on a caught Pokemon |
| Open Details | `Enter` or click |
| Quick Catch Search | Type in overlay, `Enter` catches first match |
| Theater Mode | Toggle from header — mouse to top edge to exit |
| Help | `?` |

---

<details>
<summary><strong>📍 Data Coverage</strong></summary>

All 151 Kanto Pokemon with:

- Encounter locations by route, method (grass, surf, rod, gift, trade), and version (FireRed / LeafGreen / both)
- Evolution chains and methods (level, stone, trade)
- Base stats (Gen III values)
- Type matchups and coverage

Special categories: legendaries, starter gifts, in-game trades, Game Corner purchases, and Mew.

</details>

<details>
<summary><strong>🛠️ Tech Stack</strong></summary>

- React 18 + Vite 5
- Zustand for state management
- Ant Design for UI components
- react-virtuoso for virtualized grids
- react-rnd for draggable/resizable overlays
- Web Audio API for sound effects
- vite-plugin-singlefile for standalone HTML builds

</details>

<details>
<summary><strong>💾 Storage</strong></summary>

Everything lives in `localStorage`:

- Caught Pokemon
- Shiny markers
- Badge progress
- Settings and filters
- Milestone tracking

Use the settings modal to export/import your save data.

</details>

---

## Screenshot

> Add a screenshot or GIF demo here

---

Made by and for Pokemon fans.

## License

The code is released under the [MIT License](LICENSE) — do whatever you want with it.

---

## Disclaimer

Pokémon and all related names, characters, and imagery are trademarks of Nintendo, Game Freak, and The Pokémon Company. Pokémon sprites used in this project are the property of their respective owners. This project is unofficial, non-commercial, and not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company in any way.