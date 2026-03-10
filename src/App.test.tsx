import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders main menu at root route', () => {
    render(<App />)
    expect(screen.getByText('Coding Fighter')).toBeInTheDocument()
  })

  it('renders Start Game link', () => {
    render(<App />)
    expect(screen.getByText('Start Game')).toBeInTheDocument()
  })

  it('renders Leaderboard link', () => {
    render(<App />)
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
  })
})
