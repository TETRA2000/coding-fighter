import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import CodeEditor from '../editor/CodeEditor'
import TestResultsPanel from './TestResultsPanel'
import { CodeRunner } from '../../services/execution/codeRunner'
import { getLevelById, getNextLevelId } from '../../data/levels'
import { useGameStore } from '../../store/gameStore'
import { saveProgress } from '../../services/data/progressStore'
import type { Language, ExecutionResult, ChallengeConfig } from '../../types/game'

const codeRunner = new CodeRunner()

export default function BattlePage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const level = getLevelById(levelId ?? '')
  const { progress, setProgress, currentChallenge, setCurrentChallenge } = useGameStore()

  const [language, setLanguage] = useState<Language>('javascript')
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [enemyHp, setEnemyHp] = useState(100)
  const [playerHp, setPlayerHp] = useState(100)
  const [animState, setAnimState] = useState<'idle' | 'attack' | 'damage' | 'victory' | 'defeat'>('idle')
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [challengeScore, setChallengeScore] = useState(0)
  const codeRef = useRef('')
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const challenge: ChallengeConfig | undefined = level?.challenges[currentChallenge]

  const totalEnemyHp = useMemo(() => {
    if (!level) return 100
    return level.challenges.length * 100
  }, [level])

  useEffect(() => {
    if (!level) return
    setEnemyHp(totalEnemyHp)
    setPlayerHp(100)
    setResult(null)
    setAnimState('idle')
    setShowLevelComplete(false)
    setChallengeScore(0)
  }, [levelId, level, totalEnemyHp])

  // Timer
  useEffect(() => {
    if (!challenge) return
    setTimerSeconds(Math.floor(challenge.timeLimitMs / 1000))
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [challenge])

  const handleCodeChange = useCallback((value: string) => {
    codeRef.current = value
  }, [])

  const playAnim = useCallback((state: 'attack' | 'damage' | 'victory' | 'defeat') => {
    setAnimState(state)
    setTimeout(() => setAnimState('idle'), 800)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!challenge || isExecuting) return
    setIsExecuting(true)
    setResult(null)

    const execResult = await codeRunner.execute({
      code: codeRef.current,
      language,
      testCases: [...challenge.testCases],
      timeLimitMs: challenge.timeLimitMs,
    })

    setResult(execResult)
    setIsExecuting(false)

    if (execResult.status === 'success' && execResult.testResults.every((r) => r.passed)) {
      // All tests passed - attack!
      playAnim('attack')
      const damageAmount = 100
      const score = challenge.maxScore
      setChallengeScore((prev) => prev + score)

      setEnemyHp((prev) => {
        const newHp = Math.max(0, prev - damageAmount)
        if (newHp <= 0) {
          // All challenges completed
          setTimeout(() => {
            setAnimState('victory')
            setShowLevelComplete(true)
            // Update progress
            const completedChallenges = [...progress.completedChallenges]
            if (level) {
              for (const c of level.challenges) {
                if (!completedChallenges.includes(c.id)) {
                  completedChallenges.push(c.id)
                }
              }
            }
            const completedLevels = [...progress.completedLevels]
            if (levelId && !completedLevels.includes(levelId)) {
              completedLevels.push(levelId)
            }
            const nextLevelId = getNextLevelId(levelId ?? '')
            const totalScore = progress.totalScore + score
            const newProgress = {
              ...progress,
              currentLevelId: nextLevelId ?? levelId ?? 'level-1',
              completedLevels,
              completedChallenges,
              totalScore,
              levelScores: {
                ...progress.levelScores,
                [levelId ?? '']: (progress.levelScores[levelId ?? ''] ?? 0) + score,
              },
            }
            setProgress(newProgress)
            saveProgress(newProgress)
          }, 900)
        } else {
          // Move to next challenge
          setTimeout(() => {
            if (level && currentChallenge < level.challenges.length - 1) {
              // Update progress for this challenge
              const completedChallenges = [...progress.completedChallenges]
              if (!completedChallenges.includes(challenge.id)) {
                completedChallenges.push(challenge.id)
              }
              const totalScore = progress.totalScore + score
              const newProgress = {
                ...progress,
                completedChallenges,
                totalScore,
                levelScores: {
                  ...progress.levelScores,
                  [levelId ?? '']: (progress.levelScores[levelId ?? ''] ?? 0) + score,
                },
              }
              setProgress(newProgress)
              saveProgress(newProgress)
              setCurrentChallenge(currentChallenge + 1)
              setResult(null)
              codeRef.current = ''
            }
          }, 1200)
        }
        return newHp
      })
    } else {
      // Failed - take damage
      playAnim('damage')
      setPlayerHp((prev) => Math.max(0, prev - 15))
    }
  }, [challenge, isExecuting, language, playAnim, progress, setProgress, levelId, level, currentChallenge, setCurrentChallenge])

  if (!level || !challenge) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div>
          <h2>Level not found</h2>
          <button onClick={() => navigate('/')}>Back to Menu</button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#11111b' }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: '#181825',
          borderBottom: '1px solid #313244',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: '#cdd6f4', cursor: 'pointer', fontSize: 14, padding: '4px 8px' }}
          >
            &larr; Menu
          </button>
          <span style={{ color: '#89b4fa', fontWeight: 600 }}>{level.name}</span>
          <span style={{ color: '#6c7086', fontSize: 13 }}>
            Challenge {currentChallenge + 1}/{level.challenges.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#f9e2af', fontFamily: 'monospace', fontSize: 14 }}>
            {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
          </span>
          <span style={{ color: '#a6e3a1', fontSize: 13 }}>Score: {progress.totalScore + challengeScore}</span>
        </div>
      </div>

      {/* Main content - split view */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panel - Game scene */}
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #313244' }}>
          {/* Battle arena */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(180deg, #1e1e2e 0%, #181825 50%, #11111b 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative floor line */}
            <div
              style={{
                position: 'absolute',
                bottom: '30%',
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(90deg, transparent, #45475a, transparent)',
              }}
            />

            {/* Characters */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', width: '100%', padding: '0 40px', position: 'relative', bottom: -20 }}>
              {/* Player */}
              <motion.div
                animate={
                  animState === 'attack'
                    ? { x: [0, 60, 0], scale: [1, 1.1, 1] }
                    : animState === 'damage'
                      ? { x: [0, -10, 10, -10, 0], opacity: [1, 0.5, 1, 0.5, 1] }
                      : animState === 'victory'
                        ? { y: [0, -20, 0], scale: [1, 1.2, 1] }
                        : {}
                }
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 80,
                    height: 100,
                    background: 'linear-gradient(135deg, #89b4fa, #74c7ec)',
                    borderRadius: '12px 12px 4px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    boxShadow: '0 8px 32px rgba(137, 180, 250, 0.3)',
                  }}
                >
                  &#9876;
                </div>
                <div style={{ fontSize: 12, color: '#cdd6f4', marginTop: 6 }}>You</div>
              </motion.div>

              {/* Enemy */}
              <motion.div
                animate={
                  animState === 'attack'
                    ? { x: [0, -10, 10, -5, 0], opacity: [1, 0.6, 1] }
                    : animState === 'damage'
                      ? { x: [0, 10, -10, 0] }
                      : animState === 'defeat'
                        ? { opacity: [1, 0], y: [0, 20], rotate: [0, 15] }
                        : {}
                }
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 90,
                    height: 110,
                    background: 'linear-gradient(135deg, #f38ba8, #eba0ac)',
                    borderRadius: '12px 12px 4px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 44,
                    boxShadow: '0 8px 32px rgba(243, 139, 168, 0.3)',
                  }}
                >
                  &#128126;
                </div>
                <div style={{ fontSize: 12, color: '#cdd6f4', marginTop: 6 }}>Bug Lord</div>
              </motion.div>
            </div>
          </div>

          {/* Health bars */}
          <div style={{ padding: 16, background: '#181825' }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#89b4fa' }}>Player HP</span>
                <span style={{ color: '#6c7086' }}>{playerHp}/100</span>
              </div>
              <div style={{ height: 8, background: '#313244', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${playerHp}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #89b4fa, #74c7ec)', borderRadius: 4 }}
                />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#f38ba8' }}>Enemy HP</span>
                <span style={{ color: '#6c7086' }}>
                  {enemyHp}/{totalEnemyHp}
                </span>
              </div>
              <div style={{ height: 8, background: '#313244', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${(enemyHp / totalEnemyHp) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #f38ba8, #eba0ac)', borderRadius: 4 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Editor + Challenge */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Challenge info */}
          <div style={{ padding: '12px 16px', background: '#181825', borderBottom: '1px solid #313244', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#cdd6f4' }}>{challenge.title}</h3>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setLanguage('javascript')}
                  style={{
                    padding: '2px 10px',
                    fontSize: 12,
                    borderRadius: 4,
                    border: 'none',
                    cursor: 'pointer',
                    background: language === 'javascript' ? '#f9e2af' : '#313244',
                    color: language === 'javascript' ? '#11111b' : '#cdd6f4',
                  }}
                >
                  JS
                </button>
                <button
                  onClick={() => setLanguage('typescript')}
                  style={{
                    padding: '2px 10px',
                    fontSize: 12,
                    borderRadius: 4,
                    border: 'none',
                    cursor: 'pointer',
                    background: language === 'typescript' ? '#89b4fa' : '#313244',
                    color: language === 'typescript' ? '#11111b' : '#cdd6f4',
                  }}
                >
                  TS
                </button>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#a6adc8', lineHeight: 1.5 }}>{challenge.description}</p>
            {challenge.examples.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#6c7086' }}>
                {challenge.examples.map((ex, i) => (
                  <div key={i} style={{ fontFamily: 'monospace' }}>
                    {ex.input} &rarr; {ex.output}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor
              key={`${challenge.id}-${language}`}
              language={language}
              defaultValue={challenge.template[language]}
              onChange={handleCodeChange}
            />
          </div>

          {/* Submit + Results */}
          <div style={{ padding: '12px 16px', background: '#181825', borderTop: '1px solid #313244', flexShrink: 0 }}>
            <button
              onClick={handleSubmit}
              disabled={isExecuting}
              style={{
                width: '100%',
                padding: '10px 0',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                cursor: isExecuting ? 'wait' : 'pointer',
                background: isExecuting ? '#45475a' : 'linear-gradient(90deg, #a6e3a1, #94e2d5)',
                color: '#11111b',
              }}
            >
              {isExecuting ? 'Running...' : 'Submit'}
            </button>
            <TestResultsPanel result={result} testCases={[...challenge.testCases]} />
          </div>
        </div>
      </div>

      {/* Level complete overlay */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(17, 17, 27, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{
                background: '#1e1e2e',
                borderRadius: 16,
                padding: '40px 48px',
                textAlign: 'center',
                border: '1px solid #313244',
                maxWidth: 400,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>&#127942;</div>
              <h2 style={{ margin: '0 0 8px', color: '#a6e3a1', fontSize: 24 }}>Level Complete!</h2>
              <p style={{ color: '#cdd6f4', fontSize: 14, marginBottom: 4 }}>{level.name}</p>
              <p style={{ color: '#f9e2af', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
                +{challengeScore} points
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 6,
                    border: '1px solid #313244',
                    background: '#313244',
                    color: '#cdd6f4',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Menu
                </button>
                {getNextLevelId(levelId ?? '') ? (
                  <button
                    onClick={() => {
                      const next = getNextLevelId(levelId ?? '')
                      if (next) {
                        setCurrentChallenge(0)
                        navigate(`/battle/${next}`)
                      }
                    }}
                    style={{
                      padding: '10px 24px',
                      borderRadius: 6,
                      border: 'none',
                      background: 'linear-gradient(90deg, #a6e3a1, #94e2d5)',
                      color: '#11111b',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Next Level &rarr;
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/complete')}
                    style={{
                      padding: '10px 24px',
                      borderRadius: 6,
                      border: 'none',
                      background: 'linear-gradient(90deg, #f9e2af, #fab387)',
                      color: '#11111b',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    View Results
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
