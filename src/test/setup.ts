import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Monaco Editor modules for jsdom environment
vi.mock('monaco-editor', () => ({
  default: {},
  editor: {},
}))

vi.mock('@monaco-editor/react', () => ({
  default: function MockEditor() {
    return null
  },
  loader: { config: () => {} },
}))

vi.mock('monaco-editor/esm/vs/editor/editor.worker?worker', () => ({
  default: class MockWorker {},
}))

vi.mock('monaco-editor/esm/vs/language/typescript/ts.worker?worker', () => ({
  default: class MockWorker {},
}))
