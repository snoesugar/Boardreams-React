import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useMessage from '../../hooks/useMessage'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

// 收貨人 input 元件
const UserInput = ({ register, errors, id, labelText, type, rules, icon }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label text-gold-mid mb-2 ps-1">
        <i className={`bi ${icon} me-2`}></i>
        {labelText}
      </label>
      <div className="position-relative">
        <input
          type={type}
          className={`form-control glass-input ${errors[id] ? 'is-invalid' : ''}`}
          id={id}
          placeholder={`請輸入${labelText}...`}
          {...register(id, rules)}
        />
        {errors[id] && (
          <div className="invalid-feedback ps-2 mt-2">
            <i className="bi bi-exclamation-circle me-1"></i>
            {errors?.[id]?.message}
          </div>
        )}
      </div>
    </div>
  )
}

const CheckOut = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
  })
  const { showSuccess, showError } = useMessage()

  const onSubmit = async (formData) => {
    const cartRes = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)

    if (!cartRes.data.data.carts.length) {
      showError('購物車是空的，無法送出訂單')
      return
    }
    try {
    // 1️⃣ 建立訂單
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data: {
          user: {
            name: formData.username,
            email: formData.email,
            tel: formData.tel,
            address: formData.address,
          },
          message: formData.comment || '',
        },
      })

      // 3️⃣ 成功提示
      showSuccess('訂單已送出，購物車已清空')

      // 4️⃣ 導頁（依需求）
      navigate('/success')
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* 標題區 */}
          <div className="text-center mb-5">
            <h2 className="text-gold-gradient fs-1">簽署收貨契約</h2>
            <p className="text-gold-dark small">請填寫精確的座標，確保冒險物資準時送達</p>
          </div>

          <form className="glass-panel p-4 p-md-5 rounded-4 shadow-dream" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {/* 姓名與 Email 並排 (在桌面端) */}
              <div className="col-md-6">
                <UserInput
                  register={register}
                  errors={errors}
                  id="username"
                  labelText="冒險者姓名"
                  type="text"
                  icon="bi-person-vcard"
                  rules={{ required: { value: true, message: '姓名是必填的' } }}
                />
              </div>
              <div className="col-md-6">
                <UserInput
                  register={register}
                  errors={errors}
                  id="email"
                  labelText="聯絡信箱"
                  type="email"
                  icon="bi-envelope-at"
                  rules={{
                    required: { value: true, message: 'Email 是必填的' },
                    pattern: { value: /^\S+@\S+$/i, message: '格式不正確' },
                  }}
                />
              </div>

              {/* 電話與地址 */}
              <div className="col-md-6">
                <UserInput
                  register={register}
                  errors={errors}
                  id="tel"
                  labelText="聯絡電話"
                  type="tel"
                  icon="bi-phone"
                  rules={{
                    required: { value: true, message: '電話是必填的' },
                    minLength: { value: 8, message: '不少於 8 碼' },
                    pattern: { value: /^[0-9]+$/, message: '只能輸入數字' },
                  }}
                />
              </div>
              <div className="col-md-6">
                <UserInput
                  register={register}
                  errors={errors}
                  id="address"
                  labelText="送貨地址"
                  type="text"
                  icon="bi-geo-alt"
                  rules={{ required: { value: true, message: '地址是必填的' } }}
                />
              </div>

              {/* 留言 */}
              <div className="col-12 mb-5">
                <label className="form-label text-gold-mid mb-2 ps-1" htmlFor="comment">
                  <i className="bi bi-chat-dots me-2"></i>
                  給公會的備註
                </label>
                <textarea
                  className="form-control glass-input"
                  rows="3"
                  id="comment"
                  placeholder="有什麼特別要求嗎？"
                  {...register('comment')}
                >
                </textarea>
              </div>
            </div>

            {/* 按鈕區域 */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center border-top border-gold-dark pt-4">
              <button
                className="btn-outline-gold border border-gold-mid glass-panel px-5 py-2 fs-5 rounded-pill order-2 order-sm-1"
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-send-check-fill me-2"></i>
                返回公會
              </button>
              <button
                className="btn btn-dream-submit px-5 py-2 rounded-pill fs-5 order-1 order-sm-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      傳送中
                    </>
                  )
                  : (
                    <>
                      <i className="bi bi-send-check-fill me-2"></i>
                      送出訂單
                    </>
                  )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CheckOut
