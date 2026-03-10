import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MainMenu from './components/ui/MainMenu'
import BattlePage from './components/ui/BattlePage'
import LeaderboardPage from './components/ui/LeaderboardPage'
import GameCompletePage from './components/ui/GameCompletePage'

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/battle/:levelId" element={<BattlePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/complete" element={<GameCompletePage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
