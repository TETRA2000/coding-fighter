import { TSTranspiler } from './transpiler'
import { createSandboxWorkerBlob } from './sandbox'
import type { ExecutionRequest, ExecutionResult } from '../../types/game'

const transpiler = new TSTranspiler()

export class CodeRunner {
  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const { code, language, testCases, timeLimitMs } = request

    // Step 1: Transpile TypeScript if needed
    let jsCode = code
    if (language === 'typescript') {
      const transpileResult = await transpiler.transpile(code)
      if (!transpileResult.success) {
        return {
          status: 'error',
          error: {
            kind: 'transpile',
            message: transpileResult.error.message,
            line: transpileResult.error.line,
            column: transpileResult.error.column,
          },
        }
      }
      jsCode = transpileResult.code
    }

    // Step 2: Execute in sandbox worker
    return new Promise<ExecutionResult>((resolve) => {
      const startTime = Date.now()
      const blobUrl = createSandboxWorkerBlob()
      const worker = new Worker(blobUrl)

      const timeoutId = setTimeout(() => {
        worker.terminate()
        URL.revokeObjectURL(blobUrl)
        resolve({ status: 'timeout', elapsedMs: timeLimitMs })
      }, timeLimitMs)

      worker.onmessage = (event) => {
        clearTimeout(timeoutId)
        worker.terminate()
        URL.revokeObjectURL(blobUrl)
        const totalTimeMs = Date.now() - startTime
        const workerResults = event.data.testResults as Array<{
          testCaseId: string
          passed: boolean
          actualOutput: unknown
          error: string | null
        }>

        resolve({
          status: 'success',
          totalTimeMs,
          testResults: workerResults.map((r) => {
            const tc = testCases.find((t) => t.id === r.testCaseId)
            return {
              testCaseId: r.testCaseId,
              passed: r.passed,
              actualOutput: r.actualOutput,
              expectedOutput: tc?.expectedOutput,
              timeMs: 0,
            }
          }),
        })
      }

      worker.onerror = (event) => {
        clearTimeout(timeoutId)
        worker.terminate()
        URL.revokeObjectURL(blobUrl)
        resolve({
          status: 'error',
          error: {
            kind: 'runtime',
            message: event.message || 'Unknown worker error',
            stack: '',
          },
        })
      }

      worker.postMessage({
        type: 'execute',
        code: jsCode,
        testCases: testCases.map((tc) => ({
          id: tc.id,
          input: [...tc.input],
          expectedOutput: tc.expectedOutput,
        })),
      })
    })
  }
}
