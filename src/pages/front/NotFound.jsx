import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(3) // 增加到 3 秒讓體驗更從容

  useEffect(() => {
    // 倒數計時視覺
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    // 自動導回
    const redirect = setTimeout(() => {
      navigate('/', { replace: true })
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [navigate])

  return (
    <div className="not-found-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center p-5 glass-panel shadow-dream rounded-5 animate__animated animate__fadeIn">

        {/* 核心視覺：迷失的羅盤 */}
        <div className="not-found-icon mb-4">
          <i className="bi bi-compass spin-slow display-1 text-gold-gradient"></i>
        </div>

        <h1 className="display-1 fw-bold text-gold-gradient">404</h1>
        <h2 className="text-gold-light mb-4 tracking-widest">地圖尚未探索的區域</h2>

        <p className="text-gold-dark fs-5 mb-5">
          冒險者，你看起來在夢境中迷路了...
          <br />
          時空傳送陣將在
          <span className="text-gold fw-bold mx-1 fs-4">{countdown}</span>
          秒後啟動。
        </p>

        {/* 手動導回按鈕 */}
        <button
          onClick={() => navigate('/')}
          className="btn btn-dream-submit px-5 py-2 rounded-pill shadow-sm"
        >
          <i className="bi bi-house-door-fill me-2"></i>
          立即返回公會
        </button>

        {/* 裝飾用的漂浮元素 */}
        <div className="mt-5 pt-3 border-top border-gold-dark opacity-50">
          <small className="text-gold-dark">Boardreams Compass System &copy; 2026</small>
        </div>
      </div>
    </div>
  )
}

export default NotFound
