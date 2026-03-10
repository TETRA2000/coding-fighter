import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/gameStore'

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const { progress } = useGameStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #11111b 0%, #181825 50%, #1e1e2e 100%)',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', maxWidth: 500, width: '100%' }}
      >
        <h1 style={{ margin: '0 0 8px', fontSize: 28, color: '#cdd6f4' }}>Leaderboard</h1>
        <p style={{ color: '#6c7086', fontSize: 13, marginBottom: 24 }}>Global rankings coming soon</p>

        <div
          style={{
            background: '#1e1e2e',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #313244',
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 14, color: '#a6adc8', marginBottom: 12 }}>Your Stats</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#a6e3a1' }}>{progress.totalScore}</div>
              <div style={{ fontSize: 11, color: '#6c7086', marginTop: 4 }}>Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#89b4fa' }}>{progress.completedLevels.length}</div>
              <div style={{ fontSize: 11, color: '#6c7086', marginTop: 4 }}>Levels</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#f9e2af' }}>{progress.completedChallenges.length}</div>
              <div style={{ fontSize: 11, color: '#6c7086', marginTop: 4 }}>Challenges</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: '1px solid #313244',
            background: 'transparent',
            color: '#cdd6f4',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          &larr; Back to Menu
        </button>
      </motion.div>
    </motion.div>
  )
}
