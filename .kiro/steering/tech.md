# Technology Stack

## Architecture

Single-page application (SPA) with client-side routing. All computation — TypeScript transpilation and user code execution — happens in the browser. No backend API except Supabase for leaderboard persistence. Designed as an offline-first PWA.

## Core Technologies

- **Language**: TypeScript (strict mode, ES2022 target)
- **Framework**: React 19 with function components and hooks
- **Build**: Vite 7 with ES modules
- **Runtime**: Browser-only (no Node.js server)

## Key Libraries

| Library | Role |
|---------|------|
| Monaco Editor (`@monaco-editor/react`) | Code editor, self-hosted (no CDN) |
| PixiJS 8 (`pixi.js`, `@pixi/react`) | 2D WebGL game rendering and sprite animations |
| esbuild-wasm | In-browser TypeScript → JavaScript transpilation |
| Zustand 5 | Lightweight global state management |
| Dexie.js 4 | IndexedDB wrapper for offline persistence |
| Framer Motion 12 | UI animations and page transitions |
| React Router 7 | Client-side routing |
| Supabase JS | Leaderboard backend (anonymous auth, PostgreSQL) |
| vite-plugin-pwa + Workbox | Service Worker and precaching |

## Development Standards

### Type Safety
- TypeScript strict mode enabled (`strict: true`)
- `noUnusedLocals`, `noUnusedParameters` enforced
- Types defined centrally in `src/types/game.ts`
- Use `type` imports with `verbatimModuleSyntax`

### Code Quality
- ESLint 9 with typescript-eslint and react-hooks plugin
- Function components with `export default` for page-level components
- Class-based services for stateful singletons (e.g., `TSTranspiler`, `CodeRunner`)

### Testing
- Vitest with jsdom environment (default) and `@testing-library/react`
- Use `// @vitest-environment node` directive for tests requiring Node APIs (esbuild-wasm, Worker mocks)
- Co-located test files: `*.test.ts` / `*.test.tsx` alongside source

## Development Environment

### Common Commands
```bash
npm run dev      # Start dev server
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm test         # Vitest (via npx vitest)
npm run preview  # Preview production build
```

## Key Technical Decisions

- **Self-hosted Monaco** — Workers loaded via Vite `?worker` imports; no CDN dependency for offline PWA support
- **Blob URL Workers** — Fresh Web Worker created per code execution via `Blob` + `URL.createObjectURL` to prevent state leakage between runs
- **Dangerous globals stripped** — Sandbox worker removes `fetch`, `XMLHttpRequest`, `importScripts`, `WebSocket`, `indexedDB` before executing user code
- **esbuild-wasm lazy init** — WASM binary loaded on first TypeScript execution, not at app startup
- **Dexie.js over raw IndexedDB** — Simpler API for offline persistence with typed tables
- **Supabase anonymous auth** — No sign-up required; scores submitted under display name
- **PWA injectManifest strategy** — Full control over Service Worker caching; precache kept under 50MB for iOS Safari compatibility
