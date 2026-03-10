# Coding Fighter

A browser-based coding game where players solve programming puzzles to fight enemies. Write correct JavaScript or TypeScript solutions to deal damage and progress through increasingly difficult levels.

## Features

- **Code Editor** — Monaco Editor with full JavaScript and TypeScript support, syntax highlighting, autocompletion, and real-time error diagnostics
- **Sandboxed Execution** — User code runs in an isolated Web Worker with dangerous globals stripped for safety
- **TypeScript Support** — In-browser TypeScript transpilation via esbuild-wasm (no server required)
- **Game Progression** — 3 levels of increasing difficulty with 7 total challenges covering algorithms, strings, arrays, and debugging
- **Animations** — 2D sprite-based battle animations powered by PixiJS
- **Leaderboard** — Global rankings backed by Supabase with offline queue and sync
- **PWA / Offline** — Installable as a Progressive Web App with full offline gameplay support, including iOS Safari

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Editor | Monaco Editor (self-hosted, no CDN) |
| Game Rendering | PixiJS 8 + @pixi/react |
| Transpiler | esbuild-wasm |
| State | Zustand 5 |
| Persistence | Dexie.js 4 (IndexedDB) |
| Backend | Supabase (leaderboard + anonymous auth) |
| Animations | Framer Motion 12 |
| Routing | React Router 7 |
| PWA | vite-plugin-pwa + Workbox |
| Testing | Vitest |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── editor/       # Monaco Editor integration
│   ├── game/         # PixiJS game scene and animations
│   └── ui/           # Menu, battle screen, leaderboard UI
├── data/             # Level and challenge definitions
├── services/
│   ├── data/         # IndexedDB persistence (Dexie.js)
│   └── execution/    # Transpiler, sandbox worker, code runner
├── store/            # Zustand game state
├── types/            # TypeScript type definitions
└── sw.ts             # Service Worker (Workbox precaching)
```

## How It Works

1. **Choose a level** from the main menu
2. **Read the challenge** description and constraints
3. **Write your solution** in the Monaco Editor (JavaScript or TypeScript)
4. **Submit** — your code is transpiled (if TS), then executed in a sandboxed Web Worker against test cases
5. **Pass all tests** to deal damage to the enemy; fail and you take damage
6. **Defeat the enemy** by solving all challenges in the level to advance

## License

MIT
