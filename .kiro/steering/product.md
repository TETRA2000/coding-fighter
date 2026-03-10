# Product Overview

Coding Fighter is a browser-based coding game where players solve programming puzzles to fight enemies. Players write JavaScript or TypeScript solutions in a Monaco Editor; correct solutions deal damage, incorrect ones take damage. The game works fully offline as an installable PWA.

## Core Capabilities

1. **Code-as-Combat** — Players write code to solve challenges; passing test cases translates to attack damage against enemies
2. **In-Browser Execution** — TypeScript transpilation (esbuild-wasm) and sandboxed code execution (Web Worker) run entirely client-side with no server
3. **Progressive Difficulty** — Multi-level progression with increasing challenge complexity (algorithms, strings, arrays, debugging)
4. **Offline-First PWA** — Full gameplay, persistence, and code execution without network; scores sync when back online
5. **Global Leaderboard** — Supabase-backed rankings with offline queue and automatic sync

## Target Use Cases

- Learning to code through gamified puzzle-solving
- Practicing algorithm and data structure skills in a fun, interactive format
- Competing on leaderboards for high scores across challenge levels

## Value Proposition

Unlike static coding exercise platforms, Coding Fighter provides immediate visual feedback through battle animations, turning code correctness into a tangible game mechanic. The PWA architecture ensures it works anywhere — including offline on iOS Safari — with zero server-side code execution.
