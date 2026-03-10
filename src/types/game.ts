// === Game State Types ===

export type Language = "javascript" | "typescript";
export type Difficulty = "easy" | "medium" | "hard";
export type ChallengeType = "algorithm" | "string" | "array" | "debugging";
export type AnimationState = "idle" | "attack" | "damage" | "victory" | "defeat";
export type BattlePhase = "idle" | "coding" | "executing" | "result";

// === Challenge & Level ===

export interface TestCase {
  id: string;
  input: ReadonlyArray<unknown>;
  expectedOutput: unknown;
  description: string;
}

export interface ChallengeConfig {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  constraints: ReadonlyArray<string>;
  examples: ReadonlyArray<{ input: string; output: string; explanation: string }>;
  template: Record<Language, string>;
  testCases: ReadonlyArray<TestCase>;
  timeLimitMs: number;
  maxScore: number;
}

export interface LevelConfig {
  id: string;
  name: string;
  challenges: ReadonlyArray<ChallengeConfig>;
  difficulty: Difficulty;
}

// === Execution ===

export interface ExecutionRequest {
  code: string;
  language: Language;
  testCases: ReadonlyArray<TestCase>;
  timeLimitMs: number;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: unknown;
  expectedOutput: unknown;
  timeMs: number;
}

export type ExecutionError =
  | { kind: "transpile"; message: string; line: number; column: number }
  | { kind: "runtime"; message: string; stack: string }
  | { kind: "timeout"; elapsedMs: number };

export type ExecutionResult =
  | { status: "success"; testResults: ReadonlyArray<TestCaseResult>; totalTimeMs: number }
  | { status: "error"; error: ExecutionError }
  | { status: "timeout"; elapsedMs: number };

// === Transpiler ===

export type TranspileResult =
  | { success: true; code: string }
  | { success: false; error: { message: string; line: number; column: number } };

// === Game Scene ===

export type GameEvent =
  | { type: "attack"; damage: number }
  | { type: "damage"; amount: number }
  | { type: "victory" }
  | { type: "defeat" }
  | { type: "idle" };

export interface EnemyState {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  spriteSheet: string;
}

export interface PlayerState {
  maxHp: number;
  currentHp: number;
  spriteSheet: string;
}

export interface BattleState {
  phase: BattlePhase;
  enemy: EnemyState;
  player: PlayerState;
  currentEvent: GameEvent | null;
}

// === Progress & Scoring ===

export interface ProgressState {
  currentLevelId: string;
  completedLevels: ReadonlyArray<string>;
  completedChallenges: ReadonlyArray<string>;
  totalScore: number;
  levelScores: Record<string, number>;
}

export interface ChallengeResult {
  challengeId: string;
  passed: boolean;
  timeMs: number;
  attempts: number;
}

export interface ScoreUpdate {
  challengeId: string;
  score: number;
  totalScore: number;
  newHighScore: boolean;
}

export interface PlayerProfile {
  displayName: string;
  createdAt: string;
}

// === Leaderboard ===

export interface ScoreSubmission {
  playerName: string;
  score: number;
  levelsCompleted: number;
  submittedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  levelsCompleted: number;
  submittedAt: string;
}

export interface SyncQueueItem {
  id?: number;
  payload: ScoreSubmission;
  createdAt: string;
  retryCount: number;
}

export interface SyncResult {
  synced: number;
  failed: number;
  remaining: number;
}

// === Editor ===

export interface EditorMarker {
  severity: "error" | "warning" | "info";
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

// === Worker Messages ===

export interface WorkerMessage {
  type: "execute";
  code: string;
  testCases: ReadonlyArray<{ id: string; input: ReadonlyArray<unknown>; expectedOutput: unknown }>;
}

export interface WorkerResponse {
  type: "result";
  testResults: ReadonlyArray<{
    testCaseId: string;
    passed: boolean;
    actualOutput: unknown;
    error: string | null;
  }>;
}

// === Animation ===

export interface AnimationControllerConfig {
  spriteSheet: string;
  animations: Record<AnimationState, { frames: ReadonlyArray<string>; speed: number; loop: boolean }>;
}
