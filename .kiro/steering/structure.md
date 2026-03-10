# Project Structure

## Organization Philosophy

Layer-based organization within `src/`. UI components are grouped by function (editor, game, ui), services by domain (execution, data), and shared types live in a central location.

## Directory Patterns

### Components (`src/components/`)
**Purpose**: All React components, grouped by function
**Subgroups**:
- `ui/` — Page-level screens (MainMenu, BattlePage, LeaderboardPage, GameCompletePage)
- `editor/` — Monaco Editor integration and setup
- `game/` — PixiJS game scene and animation components

**Pattern**: One component per file, default export, PascalCase filenames

### Services (`src/services/`)
**Purpose**: Non-UI business logic, grouped by domain
**Subgroups**:
- `execution/` — Code execution pipeline: transpiler, sandbox worker, code runner
- `data/` — IndexedDB persistence via Dexie.js

**Pattern**: Class-based for stateful services (TSTranspiler, CodeRunner), function exports for data operations

### State (`src/store/`)
**Purpose**: Zustand stores for global state
**Pattern**: One store per file, named `useXxxStore`, exported as named export

### Types (`src/types/`)
**Purpose**: Shared TypeScript type definitions
**Pattern**: All game-related types in `game.ts`. Use `type` imports throughout.

### Data (`src/data/`)
**Purpose**: Static content definitions (levels, challenges, test cases)
**Pattern**: Readonly arrays with helper lookup functions

## Naming Conventions

- **Components**: PascalCase (`MainMenu.tsx`, `BattlePage.tsx`)
- **Services/Stores**: camelCase (`codeRunner.ts`, `gameStore.ts`)
- **Types**: PascalCase for type names, camelCase for file (`game.ts` contains `LevelConfig`, `TestCase`)
- **Tests**: Co-located as `*.test.ts` or `*.test.tsx`

## Import Organization

```typescript
// 1. External libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// 2. Internal modules (relative paths)
import MainMenu from './components/ui/MainMenu'
import type { LevelConfig } from '../types/game'
```

**No path aliases configured** — all imports use relative paths.
**Type imports** use the `type` keyword: `import type { Foo } from '...'`

## Code Organization Principles

- **Centralized types** — All shared interfaces in `src/types/game.ts`; components and services import from there
- **Service isolation** — Execution pipeline (transpile → sandbox → run) is composed of independent modules that can be tested separately
- **Co-located tests** — Test files sit next to source files, not in a separate `__tests__` directory
- **Config at root** — `vite.config.ts`, `tsconfig.*.json`, `eslint.config.js` at project root
- **Static assets** — `public/` for files served as-is (icons, esbuild WASM, sprite sheets)
