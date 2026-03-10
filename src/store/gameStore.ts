import { create } from 'zustand'
import type { ProgressState, ChallengeResult, ScoreUpdate, LevelConfig } from '../types/game'

interface GameStore {
  progress: ProgressState
  currentChallenge: number
  isLoading: boolean
  setProgress: (progress: ProgressState) => void
  setCurrentChallenge: (index: number) => void
  setLoading: (loading: boolean) => void
}

const initialProgress: ProgressState = {
  currentLevelId: 'level-1',
  completedLevels: [],
  completedChallenges: [],
  totalScore: 0,
  levelScores: {},
}

export const useGameStore = create<GameStore>((set) => ({
  progress: initialProgress,
  currentChallenge: 0,
  isLoading: false,
  setProgress: (progress) => set({ progress }),
  setCurrentChallenge: (index) => set({ currentChallenge: index }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
