import { useRef, useCallback } from 'react'
import Editor, { type OnMount, type OnChange } from '@monaco-editor/react'
import type { Language } from '../../types/game'
import './monacoSetup'

interface CodeEditorProps {
  language: Language
  defaultValue: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export default function CodeEditor({ language, defaultValue, onChange, readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor
    editor.focus()
  }, [])

  const handleChange: OnChange = useCallback(
    (value) => {
      onChange(value ?? '')
    },
    [onChange],
  )

  const monacoLanguage = language === 'typescript' ? 'typescript' : 'javascript'

  return (
    <div style={{ height: '100%', border: '1px solid #333', borderRadius: 4, overflow: 'hidden' }}>
      <Editor
        height="100%"
        language={monacoLanguage}
        defaultValue={defaultValue}
        onChange={handleChange}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          readOnly,
          padding: { top: 12 },
        }}
      />
    </div>
  )
}
