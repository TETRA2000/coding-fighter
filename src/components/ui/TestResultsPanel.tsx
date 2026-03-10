import { motion, AnimatePresence } from 'framer-motion'
import type { ExecutionResult, TestCase } from '../../types/game'

interface TestResultsPanelProps {
  result: ExecutionResult | null
  testCases: ReadonlyArray<TestCase>
}

export default function TestResultsPanel({ result, testCases }: TestResultsPanelProps) {
  if (!result) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        style={{
          background: '#1e1e2e',
          borderRadius: 8,
          padding: 16,
          marginTop: 12,
          maxHeight: 240,
          overflowY: 'auto',
        }}
      >
        {result.status === 'error' && (
          <div style={{ color: '#f38ba8' }}>
            {result.error.kind === 'transpile' && (
              <>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Transpilation Error</div>
                <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
                  Line {result.error.line}, Col {result.error.column}: {result.error.message}
                </div>
              </>
            )}
            {result.error.kind === 'runtime' && (
              <>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Runtime Error</div>
                <div style={{ fontFamily: 'monospace', fontSize: 13 }}>{result.error.message}</div>
                {result.error.stack && (
                  <pre style={{ fontSize: 12, opacity: 0.7, marginTop: 4, whiteSpace: 'pre-wrap' }}>
                    {result.error.stack}
                  </pre>
                )}
              </>
            )}
            {result.error.kind === 'timeout' && (
              <>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Timeout</div>
                <div style={{ fontSize: 13 }}>
                  Execution exceeded {(result.error.elapsedMs / 1000).toFixed(1)}s time limit
                </div>
              </>
            )}
          </div>
        )}

        {result.status === 'timeout' && (
          <div style={{ color: '#f38ba8' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Timeout</div>
            <div style={{ fontSize: 13 }}>
              Execution exceeded {(result.elapsedMs / 1000).toFixed(1)}s time limit
            </div>
          </div>
        )}

        {result.status === 'success' && (
          <div>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              {result.testResults.every((r) => r.passed) ? (
                <span style={{ color: '#a6e3a1' }}>All tests passed!</span>
              ) : (
                <span style={{ color: '#f38ba8' }}>
                  {result.testResults.filter((r) => r.passed).length}/{result.testResults.length} tests passed
                </span>
              )}
            </div>
            {result.testResults.map((tr) => {
              const tc = testCases.find((t) => t.id === tr.testCaseId)
              return (
                <div
                  key={tr.testCaseId}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    padding: '6px 0',
                    borderBottom: '1px solid #313244',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: tr.passed ? '#a6e3a1' : '#f38ba8', flexShrink: 0 }}>
                    {tr.passed ? 'PASS' : 'FAIL'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div>{tc?.description ?? tr.testCaseId}</div>
                    {!tr.passed && (
                      <div style={{ fontFamily: 'monospace', fontSize: 12, marginTop: 2, opacity: 0.8 }}>
                        Expected: {JSON.stringify(tr.expectedOutput)} | Got: {JSON.stringify(tr.actualOutput)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
