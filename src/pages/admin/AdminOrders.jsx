import axios from 'axios'
import useSwal from '../../hooks/useSwal.jsx'
import { useState, useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'
import { Spinner, Pagination, EditOrder } from '../../components/Components'
import useMessage from '../../hooks/useMessage'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

function AdminOrders() {
  const [newOrder, setNewOrder] = useState({
    is_paid: false,
    message: '',
    products: {
      L8nBrq8Ym4ARI1Kog4t: {
        id: '',
        product_id: '',
        qty: '',
      },
    },
    user: {
      address: '',
      email: '',
      name: '',
      tel: '',
    },
    num: null,
  })
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({})
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [error, setErrors] = useState({})
  const editOrderRef = useRef(null)
  const editOrderInstance = useRef(null)
  const { showSuccess, showError } = useMessage()
  const { confirmDelete } = useSwal()

  /* ---------- 編輯 Modal ---------- */
  const closeEditModal = () => {
    if (editOrderInstance.current) editOrderInstance.current.hide()
    setIsEditOpen(false)
    setErrors({}) // 關閉 Modal 時清空錯誤
  }

  // 獲得訂單資料
  const getOrders = async (page = 1) => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/orders?page=${page}`,
      )

      setOrders(res.data.orders)
      setPagination(res.data.pagination)
    }
    catch (error) {
      showError(error.response.data.message)
    }
    finally {
      setLoading(false) // 完成抓取
    }
  }

  // 刪除單一品項
  const deleteOrder = async (id) => {
    try {
      const isConfirmed = await confirmDelete('確定要刪除此訂單嗎？', '此動作無法復原！')

      if (isConfirmed) {
        const response = await axios.delete(
          `${API_BASE}/api/${API_PATH}/admin/order/${id}`,
        )
        showSuccess(response.data.message)

        // 重新取得產品（畫面同步）
        getOrders()
      }
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 刪除所有訂單
  const deleteAllOrder = async () => {
    try {
      const isConfirmed = await confirmDelete('確定要清空所有訂單嗎？', '此動作無法復原！')

      if (isConfirmed) {
        setLoading(true)
        // 1️⃣ 先取得目前所有產品
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/admin/orders?all`,
        )

        const orders = response.data.orders

        if (orders.length === 0) {
          showSuccess('目前沒有訂單可刪除')
          return
        }

        // 2️⃣ 組成刪除請求陣列
        const deleteRequests = orders.map(item =>
          axios.delete(
            `${API_BASE}/api/${API_PATH}/admin/order/${item.id}`,
          ),
        )

        // 3️⃣ 同時刪除所有產品（真的刪資料庫）
        await Promise.all(deleteRequests)

        showSuccess(response.data.message)

        // 4️⃣ 重新取得產品（畫面同步）
        getOrders()
      }
    }
    catch (error) {
      showError(error.response.data.message)
    }
    finally {
      setLoading(false)
    }
  }

  // 編輯訂單資訊
  const updateOrder = async () => {
    const validateErrors = validateOrder(newOrder)

    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors)
      return
    }

    setErrors({}) // 清空錯誤

    // 通過驗證才送 API

    try {
      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/order/${newOrder.id}`,
        { data: newOrder },
      )
      showSuccess(response.data.message)

      // 關閉編輯 modal
      closeEditModal()

      // 重新抓資料
      getOrders()

      // 重置 newProduct
      setNewOrder({
        is_paid: false,
        message: '',
        products: {},
        user: {
          address: '',
          email: '',
          name: '',
          tel: '',
        },
        num: null,
      })
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 取建立產品的值
  const handleNewOrderChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith('user.')) {
      const key = name.split('.')[1]
      setNewOrder(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [key]: value,
        },
      }))
    }
    else {
      setNewOrder(prev => ({
        ...prev,
        [name]: value,
      }))
    }

    if (error[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // 更新總價錢
  const updateOrderQty = (id, qty) => {
    const updatedProducts = { ...newOrder.products }
    updatedProducts[id].qty = Number(qty)

    // 計算總金額
    const newTotal = Object.values(updatedProducts).reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.qty,
      0,
    )

    setNewOrder({ ...newOrder, products: updatedProducts, total: newTotal })
  }

  const deleteProduct = (id) => {
    const updatedProducts = { ...newOrder.products }
    delete updatedProducts[id]

    // 計算新總金額
    const newTotal = Object.values(updatedProducts).reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.qty,
      0,
    )

    setNewOrder({ ...newOrder, products: updatedProducts, total: newTotal })
  }

  const validateOrder = (order) => {
    const error = {}
    // 可選：驗證留言是否太長
    if (order.message && order.message.length > 200) {
      error.message = '留言不可超過 200 字'
    }
    // 可選：驗證會員姓名、email
    if (!order.user?.name?.trim()) {
      error.name = '請輸入會員姓名'
    }
    if (!order.user?.email?.trim()) {
      error.email = '請輸入會員 email'
    }
    return error
  }

  useEffect(() => {
    getOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- edit modal ---------- */
  useEffect(() => {
    if (isEditOpen && editOrderRef.current) {
      editOrderInstance.current?.dispose()
      editOrderInstance.current = new Modal(editOrderRef.current)
      editOrderInstance.current.show()

      const modalEl = editOrderRef.current
      const handleHidden = () => {
        setIsEditOpen(false)
        editOrderInstance.current?.dispose()
        editOrderInstance.current = null
        modalEl.removeEventListener('hidden.bs.modal', handleHidden)
      }

      modalEl.addEventListener('hidden.bs.modal', handleHidden)
    }
  }, [isEditOpen])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="glass-panel p-4 p-md-5 shadow-dream rounded-4 border-gold-subtle">

              {/* 標題與功能按鈕 */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                  <h2 className="text-gold-gradient font-serif mb-0">訂單管理秘書</h2>
                  <p className="text-gold-dark small mt-2">監控所有來自冒險者的交易紀錄</p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={deleteAllOrder}
                  >
                    <i className="bi bi-trash3 me-2"></i>
                    清空所有紀錄
                  </button>
                </div>
              </div>

              <div className="table-responsive d-none d-lg-block">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="ps-4">訂單編號 / 日期</th>
                      <th scope="col">冒險者資訊</th>
                      <th scope="col">購買品項</th>
                      <th scope="col">總金幣</th>
                      <th scope="col" className="text-center">交付狀態</th>
                      <th scope="col" className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        {/* 編號與時間 */}
                        <td className="ps-4">
                          <div className="text-gold-light fw-bold small">
                            #
                            {order.id.slice(-6)}
                          </div>
                          <div className="text-gold-dark fs-8">{new Date(order.create_at * 1000).toLocaleDateString()}</div>
                        </td>

                        {/* 會員簡訊 */}
                        <td>
                          <div className="d-flex flex-column">
                            <span className="text-white fw-medium">{order.user?.name}</span>
                            <span className="text-gold-dark fs-8">{order.user?.email}</span>
                            <span className="text-gold-dark fs-8">{order.user?.tel}</span>
                          </div>
                        </td>

                        {/* 商品清單：使用小標籤排版 */}
                        <td>
                          {Object.values(order.products || {}).map(item => (
                            <div key={item.id} className="text-nowrap small mb-1">
                              <span className="badge bg-glass-gold me-2">{item.qty}</span>
                              <span className="text-gold-mid me-2">{item.product.title}</span>
                              <span className="text-gold-dark">{item.product.price}</span>
                            </div>
                          ))}
                        </td>

                        {/* 金額 */}
                        <td>
                          <span className="fw-bold">
                            {order.total?.toLocaleString()}
                          </span>
                        </td>

                        {/* 付款狀態 */}
                        <td className="text-center">
                          {order.is_paid
                            ? (
                              <span className="badge-status-paid">
                                <i className="bi bi-check-circle-fill me-1"></i>
                                已結清
                              </span>
                            )
                            : (
                              <span className="badge-status-unpaid">
                                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                待支付
                              </span>
                            )}
                        </td>

                        {/* 操作按鈕 */}
                        <td className="text-center">
                          <div className="btn-group shadow-sm">
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => {
                                setNewOrder(order)
                                setIsEditOpen(true)
                              }}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-action-delete"
                              onClick={() => deleteOrder(order.id)}
                            >
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
                {orders.map(order => (
                  <div key={order.id} className="card bg-dark border-gold-dark mb-3 shadow">
                    <div className="card-body">
                      {/* 標題區：ID 與 狀態 */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-gold-light fw-bold">
                          #
                          {order.id.slice(-6)}
                        </span>
                        {order.is_paid
                          ? (
                            <span className="badge-status-paid">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              已結清
                            </span>
                          )
                          : (
                            <span className="badge-status-unpaid">
                              <i className="bi bi-exclamation-triangle-fill me-1"></i>
                              待支付
                            </span>
                          )}
                      </div>

                      {/* 使用者與內容 */}
                      <div className="text-white small mb-2">
                        <i className="bi bi-person me-2"></i>
                        {order.user?.name}
                        {' '}
                        :
                        {' '}
                        {order.user?.email}
                        (
                        {order.user?.tel}
                        )
                      </div>

                      <div className="border-top border-gold-dark pt-2 mt-2 mb-2">
                        {Object.values(order.products || {}).map(item => (
                          <div key={item.id} className="d-flex justify-content-between text-gold-dark fs-7">
                            <span>
                              {item.product.title}
                              x
                              {item.qty}
                            </span>
                            <span>{item.product.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-end fw-bold text-gold-light mt-2 mb-3">
                        總金額：NT$
                        {order.total?.toLocaleString()}
                      </div>

                      {/* 操作按鈕 */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm flex-fill"
                          onClick={() => {
                            setNewOrder(order)
                            setIsEditOpen(true)
                          }}
                        >
                          編輯
                        </button>
                        <button className="btn btn-outline-danger btn-sm flex-fill" onClick={() => deleteOrder(order.id)}>刪除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Pagination pagination={pagination} changePage={getOrders} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal 元件 */}
        <EditOrder
          editOrderRef={editOrderRef}
          closeEditModal={closeEditModal}
          updateOrder={updateOrder}
          newOrder={newOrder}
          handleNewOrderChange={handleNewOrderChange}
          setNewOrder={setNewOrder}
          updateOrderQty={updateOrderQty}
          deleteProduct={deleteProduct}
          errors={error}
        />
      </div>
    </>
  )
}

export default AdminOrders
