import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Spinner } from '../components/Components'
import useMessage from '../hooks/useMessage'

const API_BASE = import.meta.env.VITE_API_BASE

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { showSuccess, showError } = useMessage()

  const toggleNavbar = () => {
    setIsOpen(prev => !prev)
  }

  const closeNavbar = () => {
    setIsOpen(false)
  }

  // 登出
  const checkLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`)
      delete axios.defaults.headers.common['Authorization']
      showSuccess(response.data.message)
      navigate('/login')
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 驗證登入，重整仍可停留後台
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('hexToken='))
          ?.split('=')[1]

        if (!token) {
          navigate('/login')
          return
        }

        axios.defaults.headers.common['Authorization'] = token

        await axios.post(`${API_BASE}/api/user/check`)
      }
      catch {
        delete axios.defaults.headers.common['Authorization']
        navigate('/login')
      }
      finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top admin-navbar">
        <div className="container-lg">
          {/* Logo 區區 */}
          <Link className="navbar-brand d-flex align-items-center" to="/admin/product">
            <span className="text-gold-gradient font-serif fw-bold tracking-widest">
              「桌」思管理
            </span>
            <span className="badge rounded-pill bg-gold-dark text-black ms-2 small">Admin</span>
          </Link>

          {/* 漢堡選單按鈕 */}
          <button
            className="navbar-toggler border-gold-dark"
            type="button"
            onClick={toggleNavbar}
          >
            <i className="bi bi-list text-gold"></i>
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
            {/* 中間主要連結 */}
            <ul className="navbar-nav mx-auto glass-panel rounded-pill px-3 py-1 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link admin-nav-link ${location.pathname === '/admin/product' ? 'active' : ''}`}
                  to="/admin/product"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  產品清單
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link admin-nav-link ${location.pathname === '/admin/order' ? 'active' : ''}`}
                  to="/admin/order"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-receipt-cutoff me-2"></i>
                  訂單列表
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link admin-nav-link ${location.pathname === '/admin/coupon' ? 'active' : ''}`}
                  to="/admin/coupon"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-ticket-perforated me-2"></i>
                  優惠券
                </Link>
              </li>
            </ul>

            {/* 右側工具區 */}
            <ul className="navbar-nav align-items-lg-center">
              <li className="nav-item d-none d-lg-block">
                <Link to="/" className="btn-outline-gold-sm me-3" title="回前台頁面">
                  <i className="bi bi-house-door"></i>
                </Link>
              </li>
              <li className="nav-item mt-3 mt-lg-0">
                <button
                  className="btn-logout-dream w-100"
                  onClick={checkLogout}
                >
                  <i className="bi bi-power me-2"></i>
                  管理登出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  )
}

export default AdminLayout
