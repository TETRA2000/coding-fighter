// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { TestCase } from '../../types/game'

// Mock Worker
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  private handler: ((data: unknown) => void) | null = null

  constructor(_url: string) {}

  postMessage(data: unknown) {
    if (this.handler) {
      this.handler(data)
    }
  }

  terminate() {}

  _simulateMessage(data: unknown) {
    if (this.onmessage) {
      this.onmessage({ data } as MessageEvent)
    }
  }

  _simulateError(message: string) {
    if (this.onerror) {
      this.onerror({ message } as ErrorEvent)
    }
  }

  _setHandler(fn: (data: unknown) => void) {
    this.handler = fn
  }
}

let lastWorker: MockWorker | null = null
vi.stubGlobal('Worker', class extends MockWorker {
  constructor(url: string) {
    super(url)
    lastWorker = this
  }
})
vi.stubGlobal('Blob', class {
  constructor(_parts: unknown[], _options?: unknown) {}
})

globalThis.URL.createObjectURL = () => 'blob:mock'
globalThis.URL.revokeObjectURL = () => {}

describe('CodeRunner', () => {
  let CodeRunner: typeof import('./codeRunner').CodeRunner

  beforeEach(async () => {
    lastWorker = null
    const mod = await import('./codeRunner')
    CodeRunner = mod.CodeRunner
  })

  const simpleTestCases: TestCase[] = [
    { id: 't1', input: [2, 3], expectedOutput: 5, description: 'adds 2+3' },
    { id: 't2', input: [0, 0], expectedOutput: 0, description: 'adds 0+0' },
  ]

  it('sends code and test cases to worker and resolves with success', async () => {
    const runner = new CodeRunner()
    const promise = runner.execute({
      code: 'function solution(a, b) { return a + b; }',
      language: 'javascript',
      testCases: simpleTestCases,
      timeLimitMs: 5000,
    })

    // Simulate worker responding
    await new Promise((r) => setTimeout(r, 10))
    lastWorker!._simulateMessage({
      type: 'result',
      testResults: [
        { testCaseId: 't1', passed: true, actualOutput: 5, error: null },
        { testCaseId: 't2', passed: true, actualOutput: 0, error: null },
      ],
    })

    const result = await promise
    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.testResults).toHaveLength(2)
      expect(result.testResults.every((r) => r.passed)).toBe(true)
    }
  })

  it('transpiles TypeScript before sending to worker', async () => {
    const runner = new CodeRunner()
    const promise = runner.execute({
      code: 'function solution(a: number, b: number): number { return a + b; }',
      language: 'typescript',
      testCases: simpleTestCases,
      timeLimitMs: 5000,
    })

    await new Promise((r) => setTimeout(r, 2000))
    lastWorker!._simulateMessage({
      type: 'result',
      testResults: [
        { testCaseId: 't1', passed: true, actualOutput: 5, error: null },
        { testCaseId: 't2', passed: true, actualOutput: 0, error: null },
      ],
    })

    const result = await promise
    expect(result.status).toBe('success')
  })

  it('returns transpile error for invalid TypeScript', async () => {
    const runner = new CodeRunner()
    const result = await runner.execute({
      code: 'function solution(a: number, : number { return a; }',
      language: 'typescript',
      testCases: simpleTestCases,
      timeLimitMs: 5000,
    })
    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.error.kind).toBe('transpile')
    }
  })

  it('reports failing test cases from worker', async () => {
    const runner = new CodeRunner()
    const promise = runner.execute({
      code: 'function solution(a, b) { return a - b; }',
      language: 'javascript',
      testCases: simpleTestCases,
      timeLimitMs: 5000,
    })

    await new Promise((r) => setTimeout(r, 10))
    lastWorker!._simulateMessage({
      type: 'result',
      testResults: [
        { testCaseId: 't1', passed: false, actualOutput: -1, error: null },
        { testCaseId: 't2', passed: true, actualOutput: 0, error: null },
      ],
    })

    const result = await promise
    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.testResults[0].passed).toBe(false)
      expect(result.testResults[0].actualOutput).toBe(-1)
    }
  })

  it('times out when worker does not respond', async () => {
    const runner = new CodeRunner()
    const result = await runner.execute({
      code: 'function solution() { while(true){} }',
      language: 'javascript',
      testCases: [{ id: 't1', input: [], expectedOutput: null, description: 'test' }],
      timeLimitMs: 100,
    })
    expect(result.status).toBe('timeout')
    if (result.status === 'timeout') {
      expect(result.elapsedMs).toBe(100)
    }
  }, 5000)

  it('handles worker errors', async () => {
    const runner = new CodeRunner()
    const promise = runner.execute({
      code: 'invalid',
      language: 'javascript',
      testCases: [{ id: 't1', input: [], expectedOutput: null, description: 'test' }],
      timeLimitMs: 5000,
    })

    await new Promise((r) => setTimeout(r, 10))
    lastWorker!._simulateError('Worker crashed')

    const result = await promise
    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.error.kind).toBe('runtime')
    }
  })
})
