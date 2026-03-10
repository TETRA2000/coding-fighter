import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

export default function BattlePage() {
  const { levelId } = useParams<{ levelId: string }>()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh' }}
    >
      <h1>Battle - {levelId}</h1>
      <p>Battle screen placeholder</p>
    </motion.div>
  )
}
