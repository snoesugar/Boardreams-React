import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router'
import { Spinner } from '../../components/Components.jsx'
import useMessage from '../../hooks/useMessage.jsx'

import { useSelector, useDispatch } from 'react-redux'
import { getCartAsync } from '../../slice/cartSlice.jsx'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

const Cart = () => {
  const [loadingItem, setLoadingItem] = useState(null)
  const navigate = useNavigate()
  const { showSuccess, showError } = useMessage()
  const dispatch = useDispatch()
  const { carts: cartList, loading } = useSelector(
    state => state.cart,
  )
  const isInitialLoading = loading && cartList.length === 0

  // 修改商品數量
  const updateCartQty = async (cartId, productId, qty) => {
    if (qty < 1 || loadingItem === cartId) return

    try {
      setLoadingItem(cartId)

      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        {
          data: {
            product_id: productId,
            qty,
          },
        },
      )
      showSuccess(response.data.message)

      dispatch(getCartAsync())
    }
    catch (error) {
      showError(error.response.data.message)
    }
    finally {
      setLoadingItem(null)
    }
  }

  // 刪除購物車所有商品
  const delAllProducts = async () => {
    if (cartList.length === 0) {
      showSuccess('購物車沒有商品')
      return
    }

    try {
      if (!window.confirm('確定要刪除所有品項嗎？')) return
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/carts`,
      )
      dispatch(getCartAsync()) // 重新抓空的購物車

      showSuccess(response.data.message)
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 刪除購物車單個商品
  const delProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${id}`,
      )

      showSuccess(response.data.message)

      // 重新取得產品（畫面同步）
      dispatch(getCartAsync())
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 計算購物車總金額
  const totalAmount = cartList.reduce((sum, item) => {
    return sum + item.final_total
  }, 0)

  // 計算總共省下多少錢
  const totalSaved = cartList.reduce((sum, item) => {
    const originTotal = item.product.origin_price * item.qty
    const priceTotal = item.product.price * item.qty
    return sum + (originTotal - priceTotal)
  }, 0)

  // 計算購物車總數
  const totalQty = cartList.reduce((sum, item) => sum + item.qty, 0)

  // 進行結帳
  const handleCheckout = () => {
    if (cartList.length === 0) {
      showError('購物車沒有商品')
      return
    }
    showSuccess('前往結帳流程')
    setTimeout(() => {
      navigate('/checkout')
    }, 2000)
    return () => clearTimeout()
  }

  useEffect(() => {
    dispatch(getCartAsync())
  }, [dispatch])

  return (
    <div className="container">
      {
        isInitialLoading
          ? (
            <div className="d-flex justify-content-center align-items-center text-center mt-5">
              <Spinner />
            </div>
          )
          : (
            <>
              <div className="row mt-5 glass-panel p-5 rounded-4 mb-5">
                <div className="text-end mb-3">
                  <button type="button" className="btn btn-outline-danger me-3" onClick={delAllProducts} disabled={cartList.length === 0}>清空購物車</button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover d-none d-md-table">
                    <thead>
                      <tr>
                        <th className="text-gold-light">項次</th>
                        <th className="text-gold-light w-25">商品</th>
                        <th className="text-gold-light w-25">數量</th>
                        <th className="text-gold-light">小計</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartList.length > 0
                        ? (
                          cartList.map((item, index) => (
                            <tr key={item.id} className="align-middle">
                              <td className="text-gold-mid">{index + 1}</td>
                              <td className="text-start">
                                <div className="d-flex flex-lg-row flex-column align-items-center">
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.id}
                                    className="cart-img rounded-2 border border-1 me-3"
                                  />
                                  <div className="d-flex flex-column justify-content-center">
                                    <p className="fw-bold text-primary mb-2">{item.product.title}</p>
                                    <p className="text-gold-light mb-2">
                                      <del className="text-gold-dark">
                                        {item.product.origin_price}
                                        元
                                      </del>
                                      /
                                      {item.product.price}
                                      元
                                    </p>
                                    <p className="text-gold-dark mb-0">
                                      省下
                                      {item.product.origin_price * item.qty - item.product.price * item.qty}
                                      元
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-outline-primary"
                                    disabled={loadingItem === item.id}
                                    onClick={() => updateCartQty(item.id, item.product.id, item.qty - 1)}
                                  >
                                    −
                                  </button>
                                  <span className="px-3 d-flex align-items-center">{item.qty}</span>
                                  <button
                                    className="btn btn-outline-primary"
                                    disabled={loadingItem === item.id}
                                    onClick={() => updateCartQty(item.id, item.product.id, item.qty + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td>{item.final_total}</td>
                              <td>
                                <button type="button" className="btn link-danger text-danger" onClick={() => delProduct(item.id)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )
                        : (
                          <tr>
                            <td colSpan="5" className="text-center py-5">
                              <p className="text-gold-mid mb-3">購物車目前是空的</p>
                              <Link to="/productList" className="btn btn-outline-gold-light rounded-pill px-4">
                                去逛逛遊戲
                              </Link>
                            </td>
                          </tr>
                        )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="5" className="p-4">
                          <div className="d-flex flex-md-row flex-column justify-content-md-end align-items-center">
                            <span className="text-secondary me-md-4">
                              共
                              {totalQty}
                              件商品
                            </span>
                            {totalSaved > 0 && (
                              <span className="text-secondary me-md-4">
                                一共省下
                                <span className="text-danger fw-bold mx-1">
                                  {totalSaved.toLocaleString()}
                                </span>
                                元
                              </span>
                            )}
                            <span className="fs-1 me-md-5">
                              NT$
                              {totalAmount.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              className="btn-dream-add fs-3 py-2 px-5 rounded-pill"
                              disabled={cartList.length === 0}
                              onClick={handleCheckout}
                            >
                              進行結帳
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  {/* 手機板 */}
                  <div className="d-md-none">
                    {cartList.length > 0
                      ? (
                        cartList.map(item => (
                          <div key={item.id} className="glass-panel p-3 mb-3 border border-1 border-gold-dark rounded-3 shadow-sm">
                            <div className="d-flex align-items-center mb-3">
                              <img
                                src={item.product.imageUrl}
                                alt={item.id}
                                className="rounded-2 me-3"
                                style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                              />
                              <div className="flex-grow-1">
                                <p className="fw-bold text-primary mb-1 text-truncate" style={{ maxWidth: '150px' }}>
                                  {item.product.title}
                                </p>
                                <p className="text-gold-light small mb-1">
                                  <del className="text-gold-dark">
                                    {item.product.origin_price}
                                    元
                                  </del>
                                  /
                                  {item.product.price}
                                  元
                                </p>
                                <p className="text-gold-dark small mb-0">
                                  省下
                                  {item.product.origin_price * item.qty - item.product.price * item.qty}
                                  元
                                </p>
                              </div>
                              <button type="button" className="btn text-danger p-0" onClick={() => delProduct(item.id)}>
                                <i className="bi bi-trash fs-5"></i>
                              </button>
                            </div>

                            <div className="d-flex justify-content-between align-items-center bg-dark bg-opacity-25 p-2 rounded">
                              <div className="btn-group">
                                <button
                                  className="btn btn-outline-primary"
                                  disabled={loadingItem === item.id}
                                  onClick={() => updateCartQty(item.id, item.product.id, item.qty - 1)}
                                >
                                  −
                                </button>
                                <span className="text-gold-light px-3 d-flex align-items-center">{item.qty}</span>
                                <button
                                  className="btn btn-outline-primary"
                                  disabled={loadingItem === item.id}
                                  onClick={() => updateCartQty(item.id, item.product.id, item.qty + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-end">
                                <span className="fw-bold text-white">
                                  NT$
                                  {item.final_total.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                      : (
                        <div className="text-center py-5 glass-panel rounded-4">
                          <p className="text-gold-mid mb-3">購物車目前是空的</p>
                          <Link to="/productList" className="btn btn-outline-gold-light rounded-pill px-4">
                            去逛逛遊戲
                          </Link>
                        </div>
                      )}
                    <div className="mt-4 p-4 glass-panel rounded-4 mb-4">
                      <div className="d-flex flex-column align-items-center align-items-md-end">
                        <div className="text-center text-md-end">
                          <span className="text-secondary me-md-4 d-block d-md-inline">
                            共
                            {totalQty}
                            件商品
                          </span>
                          <span className="fs-1 text-white">
                            NT$
                            {totalAmount.toLocaleString()}
                          </span>
                        </div>
                        {totalSaved > 0 && (
                          <span className="text-secondary me-md-4 mb-2">
                            一共省下
                            <span className="text-danger fw-bold mx-1">
                              {totalSaved.toLocaleString()}
                            </span>
                            元
                          </span>
                        )}
                        <button
                          type="button"
                          className="btn-dream-add fs-3 py-3 px-5 rounded-pill w-100 w-md-auto"
                          disabled={cartList.length === 0}
                          onClick={handleCheckout}
                        >
                          進行結帳
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
      }
    </div>
  )
}

export default Cart
