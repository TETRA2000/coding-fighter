import * as esbuild from 'esbuild-wasm'
import type { TranspileResult } from '../../types/game'

let initialized = false

export class TSTranspiler {
  async initialize(): Promise<void> {
    if (initialized) return
    const isBrowser = typeof window !== 'undefined'
    if (isBrowser) {
      await esbuild.initialize({
        worker: true,
        wasmURL: '/esbuild.wasm',
      })
    } else {
      await esbuild.initialize({})
    }
    initialized = true
  }

  async transpile(source: string): Promise<TranspileResult> {
    await this.initialize()
    try {
      const result = await esbuild.transform(source, {
        loader: 'ts',
        target: 'es2020',
      })
      return { success: true, code: result.code }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ text: string; location?: { line: number; column: number } }> }
      const firstError = error.errors?.[0]
      return {
        success: false,
        error: {
          message: firstError?.text ?? String(err),
          line: firstError?.location?.line ?? 0,
          column: firstError?.location?.column ?? 0,
        },
      }
    }
  }
}
