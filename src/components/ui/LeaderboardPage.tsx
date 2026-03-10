import { motion } from 'framer-motion'

export default function LeaderboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh' }}
    >
      <h1>Leaderboard</h1>
      <p>Leaderboard placeholder</p>
    </motion.div>
  )
}
