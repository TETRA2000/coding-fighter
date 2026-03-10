# Research & Design Decisions

## Summary
- **Feature**: `coding-fighter-game`
- **Discovery Scope**: New Feature (greenfield)
- **Key Findings**:
  - PixiJS v8 with @pixi/react is optimal over R3F/Phaser for 2D sprite animations alongside Monaco Editor
  - Web Worker + esbuild-wasm provides the best sandboxed code execution with TypeScript transpilation
  - iOS Safari PWA has no Background Sync; manual sync on `online` event required for leaderboard

## Research Log

### Monaco Editor in React
- **Context**: Need an embedded code editor with JS/TS support in a React app
- **Sources**: npm (@monaco-editor/react), Monaco Editor GitHub, official ESM integration docs
- **Findings**:
  - `@monaco-editor/react` v4.7.0 is the community standard (380K+ weekly downloads)
  - `monaco-editor` v0.55.1 is latest stable
  - Default CDN loading (jsDelivr) fails offline; must self-host via `loader.config({ monaco })`
  - Vite integration via `vite-plugin-monaco-editor` v1.1.0 or manual worker setup
  - JS/TS syntax highlighting, autocompletion, and diagnostics work out of the box
  - Bundle size: ~2-4 MB; mitigate by limiting languages to JS/TS only
- **Implications**: Must self-host Monaco for PWA offline support. Worker configuration needed for Vite.

### Browser Code Sandboxing
- **Context**: Execute user-submitted JS/TS safely without blocking UI or compromising security
- **Sources**: MDN (Worker.terminate), esbuild-wasm npm, security CVE research
- **Findings**:
  - Web Worker via Blob URL is best for compute-only sandboxing (no DOM needed)
  - `worker.terminate()` provides hard kill for infinite loops
  - esbuild-wasm v0.27.3 transpiles TS to JS at 10-100x speed vs tsc (~1.5 MB WASM)
  - Sucrase v3.35.x is lighter alternative (~200 KB, pure JS, no type checking)
  - Must strip dangerous globals (fetch, XMLHttpRequest, importScripts) in worker
  - Create fresh worker per execution to avoid state leakage
- **Implications**: Custom Web Worker + esbuild-wasm is recommended over Sandpack (avoids external dependency).

### 2D/3D Game Graphics
- **Context**: Character animations (idle, attack, damage) alongside Monaco Editor
- **Sources**: PixiJS docs, @pixi/react GitHub, R3F docs, Phaser React template
- **Findings**:
  - **PixiJS v8.17.0** + `@pixi/react` v8.0.5 is optimal: WebGL2 canvas separate from DOM, native AnimatedSprite, `useTick` hook
  - R3F is overkill for 2D sprites; higher GPU cost with 3D pipeline overhead
  - Phaser creates "two worlds" architecture with event bus; adds unnecessary complexity
  - Framer Motion v12.35.2 is best for UI animations (menus, transitions, health bars)
  - Spine skeletal animation available via `@esotericsoftware/spine-pixi-v8` if needed
  - PixiJS canvas and Monaco DOM render on separate GPU composition layers (no interference)
- **Implications**: PixiJS for game scene + Framer Motion for UI transitions. No 3D engine needed.

### PWA on iOS Safari
- **Context**: Offline support with home screen installation on iOS devices
- **Sources**: WebKit blog, MDN Storage API, firt.dev PWA iOS compatibility
- **Findings**:
  - Service Workers fully supported; Cache API limited to ~50 MB practical
  - IndexedDB generous (up to 60% of disk for browser-context apps)
  - No Background Sync API on Safari; must listen to `online` event for manual sync
  - ITP 7-day rule evicts data for inactive origins; Home Screen apps exempt if used
  - `vite-plugin-pwa` v0.17+ with Workbox handles service worker generation
  - Must use `navigator.storage.persist()` to reduce eviction risk
- **Implications**: Keep precache under 50 MB. Manual sync pattern required for iOS.

### Leaderboard Storage
- **Context**: Shared leaderboard with offline-first capability
- **Sources**: Supabase docs, Firebase comparison articles, Dexie.js docs
- **Findings**:
  - Supabase preferred over Firebase: SQL queries for ranking, predictable pricing, no vendor lock-in
  - Supabase free tier: 500 MB DB, 50K MAU
  - Dexie.js for local IndexedDB storage (scores + sync queue)
  - Pattern: write locally first, queue for sync, drain on `online` event
  - Anonymous auth supported by Supabase for score submission without sign-up
- **Implications**: Hybrid offline-first pattern with Supabase backend for shared rankings.

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Component-Based SPA | React SPA with feature-based module organization | Natural fit for React; clear separation of game, editor, and UI concerns | Must manage cross-cutting state carefully | Selected |
| Micro-Frontend | Independent game and editor modules | Strong isolation | Overkill for single-team project | Rejected |
| Full Game Engine | Phaser or similar as primary | Rich game features built-in | Two-worlds architecture; event bus overhead | Rejected |

## Design Decisions

### Decision: PixiJS over React Three Fiber for Game Rendering
- **Context**: Need character animations (idle, attack, damage) at 30+ FPS alongside Monaco Editor
- **Alternatives Considered**:
  1. React Three Fiber — full 3D pipeline with R3F
  2. PixiJS with @pixi/react — 2D WebGL canvas rendering
  3. Phaser — full game engine
  4. CSS/SVG animations — pure DOM-based
- **Selected Approach**: PixiJS v8 with @pixi/react
- **Rationale**: 2D sprite animations are sufficient for game characters. PixiJS renders to a separate canvas, avoiding DOM interference with Monaco. Native React integration via @pixi/react eliminates the event bus complexity of Phaser.
- **Trade-offs**: No built-in 3D support if needed later; but 2D is the right fidelity for a coding game
- **Follow-up**: Evaluate Spine skeletal animation if simple sprite sheets prove insufficient

### Decision: Web Worker + esbuild-wasm for Code Execution
- **Context**: Must safely execute user code with time limits and TS support
- **Alternatives Considered**:
  1. Sandpack (@codesandbox/sandpack-react) — iframe-based with external bundler
  2. Custom Web Worker + esbuild-wasm — Blob URL worker with TS transpilation
  3. SES/Compartments — capability-based sandboxing
- **Selected Approach**: Custom Web Worker with esbuild-wasm
- **Rationale**: Full control over execution lifecycle, no external service dependency, works offline. esbuild-wasm provides fast TS transpilation at reasonable bundle size.
- **Trade-offs**: Must implement sandbox security manually (global stripping, CSP)
- **Follow-up**: Verify esbuild-wasm WASM file caching in Service Worker for offline use

### Decision: Supabase for Shared Leaderboard
- **Context**: Need persistent shared rankings with offline-first support
- **Alternatives Considered**:
  1. localStorage only — personal scores, no sharing
  2. Firebase Firestore — NoSQL with real-time sync
  3. Supabase — PostgreSQL with real-time subscriptions
- **Selected Approach**: Supabase with Dexie.js local cache
- **Rationale**: SQL enables trivial leaderboard queries. Predictable pricing. Real-time subscriptions for live updates. Free tier sufficient for initial launch.
- **Trade-offs**: Adds a backend dependency; requires network for shared leaderboard (mitigated by offline cache)
- **Follow-up**: Define Row Level Security policies for anonymous score submission

### Decision: vite-plugin-pwa for PWA Support
- **Context**: Need offline support with iOS Safari compatibility
- **Alternatives Considered**:
  1. Manual Service Worker — full control, more code
  2. vite-plugin-pwa — zero-config with Workbox integration
- **Selected Approach**: vite-plugin-pwa with injectManifest strategy
- **Rationale**: Integrates seamlessly with Vite build pipeline. Workbox provides proven caching strategies. injectManifest gives full control over caching logic for Monaco assets.
- **Trade-offs**: Tied to Vite ecosystem
- **Follow-up**: Test Cache API size on iOS; ensure precache stays under 50 MB

## Risks & Mitigations
- **Monaco bundle size (~2-4 MB)**: Mitigate with lazy loading, language restriction to JS/TS only, code splitting
- **iOS Cache API 50 MB limit**: Keep precache minimal (app shell only); use runtime caching for dynamic assets
- **No Background Sync on iOS**: Implement manual sync on `online` event; queue scores in IndexedDB
- **esbuild-wasm WASM file (~1.5 MB)**: Must be precached by Service Worker for offline code execution
- **Web Worker security**: Strip dangerous globals; create fresh worker per execution; enforce CSP headers

## References
- [@monaco-editor/react npm](https://www.npmjs.com/package/@monaco-editor/react) — React wrapper for Monaco Editor
- [PixiJS v8 docs](https://pixijs.com/) — 2D WebGL rendering engine
- [@pixi/react GitHub](https://github.com/pixijs/pixi-react) — React integration for PixiJS
- [esbuild-wasm npm](https://www.npmjs.com/package/esbuild-wasm) — Browser-compatible esbuild
- [vite-plugin-pwa docs](https://vite-pwa-org.netlify.app/) — PWA plugin for Vite
- [Supabase docs](https://supabase.com/docs) — Open source Firebase alternative
- [Dexie.js docs](https://dexie.org/) — IndexedDB wrapper
- [Framer Motion docs](https://motion.dev/) — React animation library
- [Workbox docs](https://developer.chrome.com/docs/workbox/) — Service Worker tooling
- [WebKit Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) — iOS storage limits
