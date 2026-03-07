import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useMessage from '../hooks/useMessage'
import { useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE

const Login = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
  })
  const { showSuccess, showError } = useMessage()

  // 確認登入是否成功 checkLogin
  const authorization = async () => {
    try {
      // 從 cookie 裡「把 token 拿出來」
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('hexToken='))
        ?.split('=')[1]

      if (!token) return
      // 帶著 token 去跟 API 要驗證

      // eslint-disable-next-line react-hooks/immutability
      axios.defaults.headers.common['Authorization'] = token
      await axios.post(`${API_BASE}/api/user/check`)
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 登入送出：取得 token
  const handleSubmitToken = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE}/admin/signin`,
        {
          username: data.username,
          password: data.password,
        },
      )

      const { token, expired } = response.data

      // 存 token 到 cookie

      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`

      showSuccess(response.data.message)

      await authorization()
      // 跳轉到後台產品頁
      navigate('/admin/product')
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 進場動畫：讓表單浮現
  useEffect(() => {
    const form = document.getElementById('form')
    setTimeout(() => {
      form.classList.add('fade-in-up')
    }, 100)
  }, [])

  return (
    <div className="px-4 login-dream-bg d-flex flex-column align-items-center justify-content-center vh-68">
      <div className="row justify-content-center">
        <div className="text-center mb-5">
          <div className="text-gold-gradient fs-2 font-serif tracking-widest mb-1">Boardreams</div>
          <p className="text-gold-mid small">－ 冒險者公會登入入口 －</p>
        </div>
        <div className="col-lg-8">
          <form id="form" className="mt-5 glass-login-card glass-panel border border-primary p-5 shadow-dream rounded-4" onSubmit={handleSubmit(handleSubmitToken)}>
            <div className="form-floating mb-3">
              <i className="bi bi-person-bounding-box position-absolute text-gold-dark login-icon"></i>
              <input
                type="email"
                className={`form-control glass-panel ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                placeholder="name@example.com"
                {...register('username', {
                  required: {
                    value: true,
                    message: '請填寫帳號',
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '帳號格式不正確',
                  },
                })}
                autoFocus
              />
              <label className="text-primary" htmlFor="username">帳號</label>
              {errors.username && (
                <div className="text-start invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="form-floating">
              <i className="bi bi-key-fill position-absolute text-gold-dark login-icon"></i>
              <input
                type="password"
                className={`form-control glass-panel ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                placeholder="Password"
                {...register('password', { required: '請填寫密碼' })}
              />
              <label className="text-primary" htmlFor="password">密碼</label>
              {errors.password && (
                <div className="text-start invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            <button
              className="btn btn-lg btn-login-dream text-dark border-0 fw-bold w-100 mt-3"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    開啟中...
                  </>
                )
                : (
                  <>
                    <i className="bi bi-door-open-fill me-2"></i>
                    開啟夢境
                  </>
                )}
            </button>
            <p className="mt-5 mb-0 text-center text-gold-dark small">&copy; 2026 Boardreams. Studio</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
