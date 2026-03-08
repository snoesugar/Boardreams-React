// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const Success = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 3000) // 延長一點時間，讓動畫跑完
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-5 rounded-4 shadow-dream text-center position-relative overflow-hidden"
      >
        {/* 背景魔法發光光暈 */}
        <div className="magic-glow"></div>

        <h2 className="text-gold-gradient fw-bold mb-4 font-serif">契約已成</h2>

        <div className="d-flex justify-content-center align-items-center mb-4">
          <motion.svg width="120" height="120" viewBox="0 0 52 52">
            {/* 圓圈發光層 */}
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="rgba(197, 163, 103, 0.3)"
              strokeWidth="2"
            />
            {/* 實際動畫線條 */}
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#F2E3B5"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              style={{ originX: '26px', originY: '26px' }}
            />

            {/* 打勾 */}
            <motion.path
              d="M14 27l7 7 17-17"
              fill="none"
              stroke="#F2E3B5"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
          </motion.svg>
        </div>

        <p className="text-gold-mid">正在將您傳送回冒險大廳...</p>
      </motion.div>
    </div>
  )
}

export default Success
