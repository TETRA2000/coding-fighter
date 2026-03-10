import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/gameStore'
import { levels } from '../../data/levels'

export default function GameCompletePage() {
  const navigate = useNavigate()
  const { progress } = useGameStore()

  const totalChallenges = levels.reduce((sum, l) => sum + l.challenges.length, 0)
  const maxPossibleScore = levels.reduce((sum, l) => sum + l.challenges.reduce((s, c) => s + c.maxScore, 0), 0)

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
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        style={{ textAlign: 'center', maxWidth: 440 }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>&#127942;</div>
        <h1 style={{ margin: 0, fontSize: 32, color: '#f9e2af' }}>Victory!</h1>
        <p style={{ color: '#a6adc8', fontSize: 15, marginTop: 8, marginBottom: 32 }}>
          You defeated all the Bug Lords!
        </p>

        <div
          style={{
            background: '#1e1e2e',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #313244',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#a6e3a1' }}>{progress.totalScore}</div>
              <div style={{ fontSize: 12, color: '#6c7086', marginTop: 4 }}>Total Score</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#89b4fa' }}>
                {progress.completedLevels.length}/{levels.length}
              </div>
              <div style={{ fontSize: 12, color: '#6c7086', marginTop: 4 }}>Levels Cleared</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#f9e2af' }}>
                {progress.completedChallenges.length}/{totalChallenges}
              </div>
              <div style={{ fontSize: 12, color: '#6c7086', marginTop: 4 }}>Challenges Solved</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#cba6f7' }}>
                {maxPossibleScore > 0 ? Math.round((progress.totalScore / maxPossibleScore) * 100) : 0}%
              </div>
              <div style={{ fontSize: 12, color: '#6c7086', marginTop: 4 }}>Accuracy</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: '1px solid #313244',
              background: '#313244',
              color: '#cdd6f4',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Main Menu
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(90deg, #f9e2af, #fab387)',
              color: '#11111b',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Leaderboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
