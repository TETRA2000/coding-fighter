// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createSandboxWorkerBlob, WORKER_TEMPLATE } from './sandbox'

describe('Sandbox Worker', () => {
  describe('Worker template', () => {
    it('strips dangerous globals in the template', () => {
      expect(WORKER_TEMPLATE).toContain('self.fetch = undefined')
      expect(WORKER_TEMPLATE).toContain('self.XMLHttpRequest = undefined')
      expect(WORKER_TEMPLATE).toContain('self.importScripts = undefined')
      expect(WORKER_TEMPLATE).toContain('self.WebSocket = undefined')
      expect(WORKER_TEMPLATE).toContain('self.indexedDB = undefined')
    })

    it('contains message handler for execute type', () => {
      expect(WORKER_TEMPLATE).toContain("message.data.type === 'execute'")
    })
  })

  describe('createSandboxWorkerBlob', () => {
    it('returns a blob URL string', () => {
      const blobUrl = createSandboxWorkerBlob()
      expect(blobUrl).toMatch(/^blob:/)
      URL.revokeObjectURL(blobUrl)
    })
  })
})
