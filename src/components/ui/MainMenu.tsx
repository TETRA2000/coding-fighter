import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { levels } from '../../data/levels'
import { useGameStore } from '../../store/gameStore'

export default function MainMenu() {
  const navigate = useNavigate()
  const { progress, setCurrentChallenge } = useGameStore()

  const handleStartLevel = (levelId: string) => {
    setCurrentChallenge(0)
    navigate(`/battle/${levelId}`)
  }

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
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <div style={{ fontSize: 56, marginBottom: 8 }}>&#9876;&#65039;</div>
        <h1 style={{ margin: 0, fontSize: 40, fontWeight: 800, color: '#cdd6f4', letterSpacing: -1 }}>
          Coding Fighter
        </h1>
        <p style={{ margin: '8px 0 0', color: '#6c7086', fontSize: 14 }}>Defeat bugs by writing code</p>
        {progress.totalScore > 0 && (
          <p style={{ margin: '12px 0 0', color: '#f9e2af', fontSize: 16, fontWeight: 600 }}>
            Total Score: {progress.totalScore}
          </p>
        )}
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
        {levels.map((level, i) => {
          const isCompleted = progress.completedLevels.includes(level.id)
          const isCurrent = progress.currentLevelId === level.id
          const isLocked = !isCompleted && !isCurrent && i > 0 && !progress.completedLevels.includes(levels[i - 1].id)

          return (
            <motion.button
              key={level.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => !isLocked && handleStartLevel(level.id)}
              disabled={isLocked}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 10,
                border: isCurrent ? '2px solid #89b4fa' : '1px solid #313244',
                background: isLocked ? '#181825' : isCompleted ? '#1e1e2e' : '#1e1e2e',
                color: isLocked ? '#45475a' : '#cdd6f4',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                fontSize: 15,
                textAlign: 'left',
                opacity: isLocked ? 0.5 : 1,
                width: '100%',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>
                  {isCompleted ? '✓ ' : isLocked ? '🔒 ' : ''}
                  {level.name}
                </div>
                <div style={{ fontSize: 12, color: isLocked ? '#45475a' : '#6c7086' }}>
                  {level.difficulty.toUpperCase()} · {level.challenges.length} challenges
                </div>
              </div>
              {isCompleted && progress.levelScores[level.id] != null && (
                <span style={{ color: '#a6e3a1', fontSize: 13, fontWeight: 600 }}>
                  {progress.levelScores[level.id]} pts
                </span>
              )}
              {isCurrent && !isCompleted && (
                <span style={{ color: '#89b4fa', fontSize: 13, fontWeight: 600 }}>Play &rarr;</span>
              )}
            </motion.button>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: 32, display: 'flex', gap: 16 }}
      >
        <button
          onClick={() => navigate('/leaderboard')}
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
          Leaderboard
        </button>
      </motion.div>
    </motion.div>
  )
}
