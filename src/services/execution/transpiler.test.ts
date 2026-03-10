// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { TSTranspiler } from './transpiler'

describe('TSTranspiler', () => {
  let transpiler: TSTranspiler

  beforeAll(() => {
    transpiler = new TSTranspiler()
  })

  it('transpiles valid TypeScript to JavaScript', async () => {
    const result = await transpiler.transpile('const x: number = 42;')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.code).toContain('42')
      expect(result.code).not.toContain(': number')
    }
  })

  it('transpiles a function with type annotations', async () => {
    const result = await transpiler.transpile('function add(a: number, b: number): number { return a + b; }')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.code).toContain('function add')
      expect(result.code).not.toContain(': number')
    }
  })

  it('returns error for invalid TypeScript syntax', async () => {
    const result = await transpiler.transpile('const x: number = ;')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.message).toBeTruthy()
      expect(typeof result.error.line).toBe('number')
      expect(typeof result.error.column).toBe('number')
    }
  })

  it('can be reused across multiple calls', async () => {
    const result1 = await transpiler.transpile('const a: string = "hello";')
    const result2 = await transpiler.transpile('const b: boolean = true;')
    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
  })
})
