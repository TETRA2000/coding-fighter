import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function GameCompletePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
    >
      <h1>Game Complete!</h1>
      <Link to="/">Return to Menu</Link>
    </motion.div>
  )
}
