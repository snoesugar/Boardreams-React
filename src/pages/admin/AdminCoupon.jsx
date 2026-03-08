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
    if (!newCoupon.title || !newCoupon.code) {
      showError('請填寫完整資訊')
      return
    }

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

        <div className="table-responsive">
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
                    % OFF
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
