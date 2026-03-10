import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      progress: {
        currentLevelId: 'level-1',
        completedLevels: [],
        completedChallenges: [],
        totalScore: 0,
        levelScores: {},
      },
      currentChallenge: 0,
      isLoading: false,
    })
  })

  it('has initial progress state', () => {
    const state = useGameStore.getState()
    expect(state.progress.currentLevelId).toBe('level-1')
    expect(state.progress.completedLevels).toEqual([])
    expect(state.progress.totalScore).toBe(0)
  })

  it('updates progress', () => {
    const { setProgress } = useGameStore.getState()
    setProgress({
      currentLevelId: 'level-2',
      completedLevels: ['level-1'],
      completedChallenges: ['l1-c1', 'l1-c2'],
      totalScore: 200,
      levelScores: { 'level-1': 200 },
    })
    const state = useGameStore.getState()
    expect(state.progress.currentLevelId).toBe('level-2')
    expect(state.progress.totalScore).toBe(200)
  })

  it('sets current challenge index', () => {
    const { setCurrentChallenge } = useGameStore.getState()
    setCurrentChallenge(2)
    expect(useGameStore.getState().currentChallenge).toBe(2)
  })

  it('sets loading state', () => {
    const { setLoading } = useGameStore.getState()
    setLoading(true)
    expect(useGameStore.getState().isLoading).toBe(true)
  })
})
