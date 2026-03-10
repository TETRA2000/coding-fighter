# Implementation Plan

- [ ] 1. Project scaffolding and core dependencies
- [ ] 1.1 Initialize the React application with Vite, install all core dependencies, and configure the base project structure
  - Create a new Vite + React + TypeScript project
  - Install core dependencies: React Router, Zustand, Framer Motion, Dexie.js
  - Install editor dependencies: monaco-editor, @monaco-editor/react
  - Install game rendering dependencies: pixi.js, @pixi/react
  - Install execution dependencies: esbuild-wasm
  - Install PWA dependencies: vite-plugin-pwa
  - Install backend dependencies: @supabase/supabase-js
  - Configure Vite with Monaco Editor worker setup for self-hosted mode
  - Set up React Router with placeholder routes for main menu, battle, leaderboard
  - Configure Zustand store skeleton for global game state
  - Verify the application builds and runs locally with hot reload
  - _Requirements: 7.1, 7.4, 7.5_

- [ ] 2. Code editor integration
- [ ] 2.1 (P) Embed Monaco Editor as a reusable component with JavaScript and TypeScript language support
  - Create the code editor component wrapping Monaco Editor in self-hosted mode (no CDN)
  - Configure Monaco to load only JavaScript and TypeScript language workers
  - Implement language switching between JavaScript and TypeScript with proper compiler options, syntax highlighting, autocompletion, and error diagnostics
  - Display real-time syntax error indicators in the editor gutter via the onValidate callback
  - Accept a default code template value and expose an onChange callback for the current editor content
  - Support a read-only mode for displaying solution code after submission
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 3. Code execution engine
- [ ] 3.1 (P) Build the TypeScript transpiler service using esbuild-wasm
  - Initialize esbuild-wasm lazily on first use, loading the WASM binary from the local bundle
  - Implement the transpile method that converts TypeScript source to ES2020 JavaScript
  - Return structured error information with line and column numbers on transpilation failure
  - Ensure the transpiler can be re-used across multiple calls after initialization
  - _Requirements: 3.5_

- [ ] 3.2 (P) Build the sandbox Web Worker for isolated code execution
  - Create the Web Worker template that strips dangerous globals (fetch, XMLHttpRequest, importScripts, WebSocket, indexedDB) before executing user code
  - Implement the message protocol: receive code and test cases, execute the user function against each test case input, and return pass/fail results with actual output
  - Ensure each test case is evaluated independently with its own try/catch for runtime errors
  - Communicate results back to the main thread via postMessage
  - _Requirements: 3.1, 3.2_

- [ ] 3.3 Build the code runner orchestrator that coordinates transpilation and sandboxed execution
  - Implement the execute method that accepts code, language, test cases, and a time limit
  - If the language is TypeScript, transpile to JavaScript first; skip for JavaScript
  - Create a fresh Blob URL Web Worker for each execution to prevent state leakage
  - Enforce the time limit using setTimeout and worker.terminate() for hard kill
  - Return structured results: success with per-test-case pass/fail details, transpilation error, runtime error, or timeout
  - Clean up the worker and Blob URL regardless of outcome
  - _Requirements: 2.2, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Game scene and animations
- [ ] 4.1 (P) Set up the PixiJS game scene with a stage, background, and placeholder character sprites
  - Create the game scene component using @pixi/react with a PixiJS Stage
  - Render a battle background environment as a static sprite or tiled texture
  - Display a player character sprite and an enemy character sprite on the stage
  - Accept battle state props (enemy health, player health, current event) from the parent component
  - Ensure the canvas renders independently of React DOM at 30+ FPS
  - _Requirements: 4.1, 4.6_

- [ ] 4.2 Build the animation controller that manages character animation state transitions
  - Implement a state machine that maps game events to animation states: idle, attack, damage, victory, defeat
  - Use PixiJS AnimatedSprite to cycle through sprite sheet frames for each animation state
  - Configure animation properties per state: frame sequence, playback speed, and whether the animation loops
  - Automatically return to the idle animation after one-shot animations (attack, damage, victory, defeat) complete
  - Fire an onAnimationComplete callback when a one-shot animation finishes
  - _Requirements: 4.2, 4.3, 4.4_

- [ ] 4.3 Create placeholder sprite sheet assets for player and enemy characters
  - Create or source simple sprite sheets with frames for idle, attack, damage, victory, and defeat animations
  - Organize sprites as texture atlases with a JSON descriptor for PixiJS Spritesheet parser
  - Include at least one player character and two distinct enemy character sprite sets
  - _Requirements: 4.1, 4.4_

- [ ] 5. Game state management and data persistence
- [ ] 5.1 (P) Implement the game state manager with Zustand for level progression and scoring
  - Create a Zustand store managing current level, challenge data, and player progress
  - Implement level loading that returns challenge configuration with test cases and templates
  - Implement score calculation based on levels completed, time taken, and number of attempts
  - Track completed levels and challenges, unlocking the next level upon completion
  - _Requirements: 5.1, 5.2, 5.3, 8.2, 8.3_

- [ ] 5.2 (P) Set up IndexedDB persistence using Dexie.js for progress, player profile, and sync queue
  - Define the database schema with tables for progress, profile, scores, syncQueue, and leaderboardCache
  - Implement save and load methods for player progress that survive page reloads
  - Implement save and load methods for the player profile (display name)
  - Ensure the store initializes from persisted data on application startup
  - _Requirements: 5.3, 8.5, 8.6, 9.3_

- [ ] 5.3 Define the level and challenge content data for multiple stages of increasing difficulty
  - Create challenge data covering at least 3 levels with 2-3 challenges each
  - Include varied challenge types: algorithm puzzles, string manipulation, array operations, and debugging
  - Define test cases with input/output pairs for each challenge
  - Provide default code templates for both JavaScript and TypeScript per challenge
  - Set appropriate time limits and max scores per challenge based on difficulty
  - _Requirements: 1.4, 2.1, 5.1, 5.4_

- [ ] 6. Battle screen integration
- [ ] 6.1 Build the split-view battle screen layout with the game scene and code editor side by side
  - Create the battle screen with a left panel for the game scene (characters, health bars, timer) and a right panel for the code editor and controls
  - Display the challenge description, constraints, and example inputs/outputs above or alongside the editor
  - Include a language selector toggle for switching between JavaScript and TypeScript
  - Add a visible Submit button to trigger code execution
  - Display a countdown timer showing remaining time for the current challenge
  - Show the enemy health bar that decreases when challenges are solved
  - Ensure the layout is responsive and functional at desktop sizes (minimum 1024px width)
  - _Requirements: 2.1, 2.5, 2.6, 6.1, 6.2, 6.5, 6.6_

- [ ] 6.2 Build the test results panel showing pass/fail status for each test case
  - Display each test case with its description, expected output, actual output, and pass/fail indicator
  - Show runtime error messages with error type and stack trace when code throws
  - Show timeout messages with elapsed time when execution exceeds the time limit
  - Show transpilation errors with line and column information
  - Animate the panel appearance using Framer Motion transitions
  - _Requirements: 2.4, 3.3, 3.4, 6.3_

- [ ] 6.3 Wire the battle flow: connect code submission to execution, results to game scene animations, and completion to state updates
  - On Submit click, send the editor code to the code runner with the selected language and challenge test cases
  - On successful execution (all tests pass), trigger the attack animation on the game scene, reduce enemy health, and update the game state with score
  - On failed execution (some tests fail), trigger the damage animation on the game scene
  - On timeout or runtime error, trigger the damage animation and display the error in the results panel
  - When enemy health reaches zero, trigger the victory animation and advance to the next challenge or level
  - Display a level completion summary when all challenges in a level are solved
  - Persist progress and score after each challenge completion
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 4.2, 4.3, 5.2, 8.3_

- [ ] 7. Main menu and navigation
- [ ] 7.1 Build the main menu screen with options to start a new game, continue, and select levels
  - Create the main menu with a game title, start new game button, continue button (if progress exists), and level selection
  - Display level selection showing completed, current, and locked levels
  - Show the player's total score and progress summary
  - Add Framer Motion animations for menu transitions and button interactions
  - _Requirements: 5.3, 6.4_

- [ ] 7.2 Build the game completion screen with final statistics
  - Display final stats when all levels are completed: total score, time spent, challenges solved, accuracy
  - Include options to replay or return to the main menu
  - Add celebratory animation using Framer Motion
  - _Requirements: 5.5_

- [ ] 7.3 Set up page transitions with smooth animations between screens
  - Configure React Router transitions between main menu, battle, leaderboard, and results screens
  - Use Framer Motion AnimatePresence for enter/exit animations on route changes
  - _Requirements: 4.5_

- [ ] 8. Leaderboard
- [ ] 8.1 (P) Set up the Supabase project with leaderboard table, Row Level Security, and anonymous auth
  - Create the leaderboard table in Supabase with columns for player name, score, levels completed, and timestamp
  - Configure an index on score (descending) for efficient ranking queries
  - Set up Row Level Security allowing anonymous inserts but preventing client-side updates or deletes
  - Configure anonymous authentication for score submissions without requiring user sign-up
  - _Requirements: 8.6_

- [ ] 8.2 Build the leaderboard sync service with offline queue and online sync
  - Implement score submission that writes to IndexedDB immediately and queues for Supabase sync
  - Listen to the browser online event and drain the sync queue when connectivity is restored
  - Fetch the global leaderboard from Supabase when online and cache it in IndexedDB
  - Serve the cached leaderboard when offline
  - Handle sync failures gracefully by incrementing retry count and re-queuing
  - _Requirements: 8.3, 8.6, 8.7, 9.7_

- [ ] 8.3 Build the leaderboard screen displaying player rankings
  - Display a ranked list of players with name, score, rank number, and levels completed
  - Highlight the current player's entry in the leaderboard
  - Allow the player to set or change their display name from the leaderboard screen
  - Show a loading state while fetching and an offline indicator when displaying cached data
  - _Requirements: 8.1, 8.4, 8.5_

- [ ] 9. PWA and offline support
- [ ] 9.1 (P) Configure the PWA with Service Worker, Web App Manifest, and iOS Safari meta tags
  - Configure vite-plugin-pwa with the injectManifest strategy for full control over caching
  - Define the Web App Manifest with app name, icons (192x192, 512x512), theme color, background color, and standalone display mode
  - Add apple-touch-icon link tags and apple-mobile-web-app meta tags for iOS Safari compatibility
  - Configure Workbox precaching for the app shell, Monaco Editor workers, esbuild WASM binary, and sprite sheet assets
  - Use stale-while-revalidate strategy for dynamic content and runtime caching
  - Keep the total precache size under 50 MB for iOS Cache API compatibility
  - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [ ] 9.2 Implement the offline status indicator and ensure offline gameplay works
  - Create a network status indicator component that shows when the device is offline
  - Listen to online/offline browser events and update the indicator in real-time
  - Verify that previously loaded levels are playable without network connectivity
  - Verify that code execution (including TypeScript transpilation) works fully offline
  - Request persistent storage via navigator.storage.persist() to reduce iOS eviction risk
  - _Requirements: 9.3, 9.6_

- [ ] 9.3 Wire the online event to trigger leaderboard sync and progress upload
  - When connectivity is restored, automatically trigger the leaderboard sync service to drain queued scores
  - Refresh the cached leaderboard from Supabase after successful sync
  - Display a brief notification confirming sync completion
  - _Requirements: 9.7, 8.7_

- [ ] 10. Performance optimization and deployment configuration
- [ ] 10.1 Implement code splitting and lazy loading for heavy modules
  - Lazy-load the Monaco Editor component using React.lazy and Suspense
  - Lazy-load the PixiJS game scene component to reduce initial bundle size
  - Lazy-load esbuild-wasm initialization to defer until first TypeScript execution
  - Verify the initial screen renders within 5 seconds on a standard broadband connection
  - _Requirements: 7.3, 7.5_

- [ ] 10.2 Configure Vercel deployment and verify production build
  - Ensure the Vite build produces a static output compatible with Vercel zero-configuration deployment
  - Verify all assets (Monaco workers, esbuild WASM, sprite sheets) are correctly bundled and served
  - Confirm the Service Worker registers and precaches correctly in the production build
  - Test the production build locally to verify full functionality
  - _Requirements: 7.2, 7.5_

- [ ] 11. End-to-end integration testing
- [ ] 11.1 Verify the complete battle flow from level start to completion
  - Load a level from the main menu, write a correct solution, submit, and verify the attack animation plays and progress updates
  - Submit an incorrect solution and verify the damage animation plays and test failure details display
  - Submit code that times out and verify the worker terminates and timeout message displays
  - Complete all challenges in a level and verify level completion summary and next level unlock
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 4.2, 4.3, 5.2_

- [ ] 11.2 Verify leaderboard and offline functionality end-to-end
  - Complete a level while online and verify the score appears on the leaderboard
  - Go offline, complete a level, go online, and verify the score syncs to the leaderboard
  - Verify the app is installable as a PWA and functions offline with cached assets
  - Verify iOS Safari PWA installation and offline gameplay
  - _Requirements: 8.1, 8.3, 8.7, 9.1, 9.3, 9.5, 9.7_
