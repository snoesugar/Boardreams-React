import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'
import { Spinner, Pagination, EditCoupon } from '../../components/Components'
import useMessage from '../../hooks/useMessage'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

function AdminCoupon() {
  const [newCoupon, setNewCoupon] = useState({
    title: '',
    is_enabled: 0,
    percent: 100,
    due_date: '',
    code: '',
  })
  const [loading, setLoading] = useState(true)
  const [coupons, setCoupons] = useState([])
  const [pagination, setPagination] = useState({})
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [errors, setErrors] = useState({})

  const editCouponRef = useRef(null) // 重新命名以符合功能
  const editCouponInstance = useRef(null)

  const { showSuccess, showError } = useMessage()

  // 關閉優惠券
  const closeEditModal = () => {
    if (editCouponInstance.current) editCouponInstance.current.hide()
    setIsEditOpen(false)
    setErrors({})
  }

  // 開啟Modal
  const openCreateModal = () => {
    setNewCoupon({
      title: '',
      is_enabled: 0,
      percent: 100,
      due_date: Math.floor(new Date().getTime() / 1000),
      code: '',
    })
    setIsEditOpen(true)
  }

  // 取得優惠券資訊
  const getCoupons = async (page = 1) => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/coupons?page=${page}`)
      setCoupons(res.data.coupons)
      setPagination(res.data.pagination)
    }
    catch (error) {
      showError(error.response?.data?.message)
    }
    finally {
      setLoading(false)
    }
  }

  // 編輯優惠券
  const updateCoupon = async () => {
    // 基本欄位防呆
    const validateErrors = validateProduct(newCoupon)

    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors)
      return
    }

    setErrors({}) // 清空錯誤

    const url = newCoupon.id
      ? `${API_BASE}/api/${API_PATH}/admin/coupon/${newCoupon.id}`
      : `${API_BASE}/api/${API_PATH}/admin/coupon`
    const method = newCoupon.id ? 'put' : 'post'

    try {
      const response = await axios[method](url, { data: newCoupon })
      showSuccess(response.data.message)
      closeEditModal()
      getCoupons()
    }
    catch (error) {
      showError(error.response?.data?.message)
    }
  }

  // 刪除所有優惠券
  const deleteAllCoupon = async () => {
    if (!window.confirm('確定要刪除所有優惠券嗎？')) return
    try {
      setLoading(true)
      const deleteRequests = coupons.map(item =>
        axios.delete(`${API_BASE}/api/${API_PATH}/admin/coupon/${item.id}`),
      )
      await Promise.all(deleteRequests)
      showSuccess('已清除所有優惠券')
      getCoupons()
    }
    catch (error) {
      showError(error.response?.data?.message)
    }
    finally {
      setLoading(false)
    }
  }

  // 刪除單一優惠券
  const deleteCoupon = async (id) => {
    if (!window.confirm('確定要刪除這個優惠券嗎？')) return

    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/coupon/${id}`,
      )
      showSuccess(response.data.message)

      getCoupons()
    }
    catch (error) {
      showError(error.response?.data?.message || '刪除失敗')
    }
  }

  // 表單驗證資訊
  const validateProduct = (product) => {
    const error = {}

    // 1. 驗證名稱
    if (!product.title?.trim()) {
      error.title = '請輸入優惠券名稱'
    }

    // 2. 驗證折扣 (限制在 0-100)
    // 修正原本代碼中的 !product.percent === '' 邏輯錯誤
    if (product.percent === '' || product.percent === undefined) {
      error.percent = '請輸入折扣(%)'
    }
    else {
      const percentNum = Number(product.percent)
      if (percentNum <= 0) { // 通常折扣不會是 0，若要允許 0 則改為 < 0
        error.percent = '折扣必須大於 0'
      }
      else if (percentNum > 100) {
        error.percent = '折扣不可大於 100'
      }
    }

    // 3. 驗證折扣代碼
    if (!product.code?.trim()) {
      error.code = '請輸入折扣代碼'
    }

    // 4. 驗證到期日 (不可早於今天)
    if (!product.due_date) {
      error.due_date = '請選擇到期日'
    }

    return error
  }

  const handleCouponChange = (e) => {
    const { name, value, type, checked } = e.target

    setNewCoupon(prev => ({
      ...prev,
      // 如果欄位名稱是 percent，強制轉為 Number；否則依據 type 判斷
      [name]: name === 'percent'
        ? Number(value)
        : (type === 'checkbox' ? (checked ? 1 : 0) : value),
    }))
  }

  useEffect(() => {
    getCoupons()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- Modal 實例管理 ---------- */
  useEffect(() => {
    if (isEditOpen && editCouponRef.current) {
      editCouponInstance.current = new Modal(editCouponRef.current)
      editCouponInstance.current.show()
    }
  }, [isEditOpen])

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center mt-5"><Spinner /></div>
  }

  return (
    <div className="container py-5">
      <div className="glass-panel p-4 p-md-5 shadow-dream rounded-4 border-gold-subtle">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="text-gold-gradient font-serif mb-0">優惠券管理</h2>
            <p className="text-gold-dark small mt-2">管理你的促銷與折扣活動</p>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-dream-submit"
              onClick={openCreateModal}
            >
              <i className="bi bi-plus-lg me-2"></i>
              新增優惠券
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={deleteAllCoupon}
            >
              <i className="bi bi-trash3 me-2"></i>
              清空優惠券
            </button>
          </div>
        </div>

        <div className="table-responsive d-none d-lg-block">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>優惠券名稱</th>
                <th>折扣代碼</th>
                <th>折扣比例</th>
                <th>到期日</th>
                <th className="text-center">狀態</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td className="text-white">{coupon.title}</td>
                  <td className="text-gold-light fw-bold">{coupon.code}</td>
                  <td className="text-white">
                    {coupon.percent}
                    折
                  </td>
                  <td className="text-gold-dark">{new Date(coupon.due_date * 1000).toLocaleDateString()}</td>
                  <td className="text-center">
                    {coupon.is_enabled
                      ? (
                        <span className="status-dot active" title="已上架"></span>
                      )
                      : (
                        <span className="status-dot inactive" title="未上架"></span>
                      )}
                  </td>
                  <td className="text-center">
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn-action-edit"
                        onClick={() => {
                          setNewCoupon(coupon)
                          setIsEditOpen(true)
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn-action-delete" onClick={() => deleteCoupon(coupon.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 手機板 */}
        <div className="d-lg-none mt-4">
          {coupons.map(coupon => (
            <div key={coupon.id} className="card bg-dark border-gold-dark mb-3">
              <div className="card-body">
                <div className="d-flex">
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="text-white mb-0">{coupon.title}</h5>
                      {/* 上架狀態 */}
                      {coupon.is_enabled ? <span className="status-dot active"></span> : <span className="status-dot inactive"></span>}
                    </div>
                    <span className="text-primary fs-7">
                      折扣代碼:
                      {coupon.code}
                    </span>
                    <p className="text-primary fs-7 mb-0">
                      到期日:
                      {' '}
                      {new Date(coupon.due_date * 1000).toLocaleDateString()}
                    </p>
                    <p className="text-gold-light fw-bold mb-3">
                      折扣(%):
                      {' '}
                      {coupon.percent}
                      折
                    </p>
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="btn-group w-100">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setNewCoupon(coupon)
                      setIsEditOpen(true)
                    }}
                  >
                    編輯
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteCoupon(coupon.id)}>刪除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination pagination={pagination} changePage={getCoupons} />
      </div>

      <EditCoupon
        editOrderRef={editCouponRef}
        closeEditModal={closeEditModal}
        updateOrder={updateCoupon}
        newCoupon={newCoupon}
        handleNewOrderChange={handleCouponChange}
        errors={errors}
      />
    </div>
  )
}

export default AdminCoupon
