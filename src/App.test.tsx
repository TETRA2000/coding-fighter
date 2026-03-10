import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock esbuild-wasm for jsdom (imported transitively by BattlePage -> codeRunner)
vi.mock('esbuild-wasm', () => ({
  initialize: vi.fn(),
  transform: vi.fn().mockResolvedValue({ code: '' }),
}))

import App from './App'

describe('App', () => {
  it('renders main menu at root route', () => {
    render(<App />)
    expect(screen.getByText('Coding Fighter')).toBeInTheDocument()
  })

  it('renders level selection', () => {
    render(<App />)
    expect(screen.getByText('The Basics')).toBeInTheDocument()
  })

  it('renders Leaderboard button', () => {
    render(<App />)
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
  })
})
