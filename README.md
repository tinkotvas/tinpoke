# tinpoke

A browser-based Pokedex tracker for Pokemon FireRed / LeafGreen. Point your Switch capture at the screen and track catches as you play.

Built as a single-file app — runs entirely in the browser with no backend. All progress is saved to localStorage.

![FireRed](https://img.shields.io/badge/FireRed-Pokemon-E3350D?logo=pokemon&logoColor=white)
![LeafGreen](https://img.shields.io/badge/LeafGreen-Pokemon-4CAF50?logo=pokemon&logoColor=white)
![Pokemon](https://img.shields.io/badge/pokemon-151-blue)
![Gen III](https://img.shields.io/badge/generation-III-orange)


## What it does

- **Switch feed** — Capture your Switch screen via USB capture card or camera. The app displays the video feed so you can play and track side by side.
- **Quick Catch** — A floating button overlay that lets you mark Pokemon as caught without leaving the video feed. Sorts uncaught Pokemon first, prioritizes the route you're on.
- **Route checklist** — Every FRLG area from Pallet Town to Cerulean Cave, including Sevii Islands. Shows which Pokemon are available and which you still need.
- **Route overlay** — A draggable, resizable overlay showing the Pokemon available on your current route(s), right on top of the video feed.
- **Badges** — Track your 8 Kanto gym badges.
- **Stats** — Type coverage grid, catch timeline, and milestone progress.
- **Shiny tracking** — Shift+click a caught Pokemon to mark it as shiny (holographic card effect).
- **Confetti** — Celebrations at 25%, 50%, 75%, and 100% completion.
- **Themes** — Fire Red (dark) and Leaf Green (light).
- **Offline** — Builds to a single HTML file. No internet required after build.

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Produces a single self-contained HTML file in `dist/` via `vite-plugin-singlefile`. Drop it anywhere and open it — no server needed.

## Controls

| Action | Input |
|---|---|
| Catch / Release | `Shift + Click` on a Pokemon |
| Toggle shiny | `Shift + Click` on a caught Pokemon |
| Open details | `Enter` or click on a Pokemon card |
| Quick Catch search | Type in the Quick Catch overlay, `Enter` to catch first match |
| Theater mode | Toggle from the header — hides UI, mouse to top to exit |
| Help | `?` |

## Data

All 151 Kanto Pokemon with:

- Encounter locations by route, method (grass, surf, rod, gift, trade), and version (FireRed / LeafGreen / both)
- Evolution chains and methods (level, stone, trade)
- Base stats (Gen III values)
- Type matchups and coverage

Special categories: legendaries, starter gifts, in-game trades, Game Corner purchases, and Mew.

## Tech

- React 18 + Vite 5
- Zustand for state
- Ant Design for UI components
- react-virtuoso for virtualized grids
- react-rnd for draggable/resizable overlays
- Web Audio API for sound effects

## Storage

Everything lives in `localStorage` — caught Pokemon, badges, settings, filters, milestones. Use the settings modal to export/import your save data.
