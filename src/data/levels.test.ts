import { describe, it, expect } from 'vitest'
import { levels, getLevelById, getNextLevelId } from './levels'

describe('Level data', () => {
  it('has at least 3 levels', () => {
    expect(levels.length).toBeGreaterThanOrEqual(3)
  })

  it('each level has at least 2 challenges', () => {
    for (const level of levels) {
      expect(level.challenges.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('each challenge has test cases', () => {
    for (const level of levels) {
      for (const challenge of level.challenges) {
        expect(challenge.testCases.length).toBeGreaterThan(0)
      }
    }
  })

  it('each challenge has templates for both JS and TS', () => {
    for (const level of levels) {
      for (const challenge of level.challenges) {
        expect(challenge.template.javascript).toBeTruthy()
        expect(challenge.template.typescript).toBeTruthy()
      }
    }
  })

  it('includes varied challenge types', () => {
    const types = new Set(levels.flatMap((l) => l.challenges.map((c) => c.type)))
    expect(types.has('algorithm')).toBe(true)
    expect(types.has('string')).toBe(true)
    expect(types.has('array')).toBe(true)
    expect(types.has('debugging')).toBe(true)
  })

  it('levels have increasing difficulty', () => {
    const difficulties = levels.map((l) => l.difficulty)
    expect(difficulties).toEqual(['easy', 'medium', 'hard'])
  })

  it('getLevelById returns correct level', () => {
    const level = getLevelById('level-2')
    expect(level).toBeDefined()
    expect(level!.name).toBe('Array Mastery')
  })

  it('getLevelById returns undefined for invalid id', () => {
    expect(getLevelById('nonexistent')).toBeUndefined()
  })

  it('getNextLevelId returns next level', () => {
    expect(getNextLevelId('level-1')).toBe('level-2')
    expect(getNextLevelId('level-2')).toBe('level-3')
  })

  it('getNextLevelId returns null for last level', () => {
    expect(getNextLevelId('level-3')).toBeNull()
  })
})
