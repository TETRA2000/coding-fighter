import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function MainMenu() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
    >
      <h1>Coding Fighter</h1>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/battle/level-1">Start Game</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
    </motion.div>
  )
}
