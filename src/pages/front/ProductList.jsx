import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Pagination, Spinner } from '../../components/Components'
import { Link } from 'react-router-dom'
import useMessage from '../../hooks/useMessage'
import { useDispatch } from 'react-redux'
import { getCartAsync } from '../../slice/cartSlice'

const API_BASE = import.meta.env.VITE_API_BASE

// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_API_PATH

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState(null)
  const { showSuccess, showError } = useMessage()
  const dispatch = useDispatch()

  // 抓取產品資料
  const getProducts = useCallback(async (page = 1) => {
    setLoading(true) // 開始抓資料
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/products?page=${page}`,
      )

      setProducts(res.data.products)
      setPagination(res.data.pagination)
    }
    catch (error) {
      showError(error.response.data.message)
    }
    finally {
      setLoading(false) // 完成抓取
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 加入購物車
  const addToCart = async (product, qty = 1) => {
    if (addingId === product.id) return
    try {
      setAddingId(product.id)

      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/cart`,
        {
          data: {
            product_id: product.id,
            qty,
          },
        },
      )
      // ✅ 直接 dispatch API 訊息
      showSuccess(response.data.message)
      dispatch(getCartAsync())
    }
    catch (error) {
      showError(error.response.data.message)
    }
    finally {
      setAddingId(null) // 一定要還原
    }
  }

  useEffect(() => {
    getProducts()
    dispatch(getCartAsync())
  }, [dispatch, getProducts])

  return (
    <div className="bg-dark pt-83 mt-n83">
      <div className="container mt-4">
        {loading
          ? (
            <div className="row">
              <div className="col-lg-3 d-none d-lg-block">
                <div className="glass-panel rounded-3 p-4 sticky-top" style={{ top: '100px' }}>
                  <h5 className="text-gold-gradient mb-4">遊戲分類</h5>
                  <ul className="list-group list-group-flush">
                    <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 active rounded">全部遊戲</a></li>
                    <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">合作遊戲</a></li>
                    <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">派對遊戲</a></li>
                    <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">硬核策略</a></li>
                    <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">陣營遊戲</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-9">
                <div className="row gy-4 mb-4">
                  {[...Array(9)].map((_, i) => (
                    <div className="col-lg-4 col-sm-6 col-12" key={i}>
                      <div className="card border-0 h-100 opacity-25">
                        <div className="bg-gray-300 py-6 my-6"></div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                          <Spinner />
                          <div className="bg-gray-200 mb-5"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
          : (
            <>
              <div className="row">
                <div className="col-lg-3 d-none d-lg-block">
                  <div className="glass-panel rounded-3 p-4 sticky-top" style={{ top: '100px' }}>
                    <h5 className="text-gold-gradient mb-4">遊戲分類</h5>
                    <ul className="list-group list-group-flush">
                      <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 active rounded">全部遊戲</a></li>
                      <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">合作遊戲</a></li>
                      <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">派對遊戲</a></li>
                      <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">硬核策略</a></li>
                      <li><a href="#" className="list-group-item list-group-item-dream transition-ease02 rounded">陣營遊戲</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="row gy-4 mb-4">
                    {
                      products.map((product) => {
                        return (
                          <div className="col-lg-4 col-sm-6 col-12" key={product.id}>
                            <div className="card product-card-dream h-100">
                              <div className="position-relative overflow-hidden">
                                <img src={product.imageUrl} className="card-img-top product-img-dream img-fluid" alt={product.title} />
                                <div className="position-absolute top-50 start-50 translate-middle d-none d-md-block" style={{ opacity: '0.2' }}>
                                  <img src="floating-dice.png" className="img-fluid drop-shadow" style={{ transform: 'rotate(15deg)' }} />
                                </div>
                              </div>
                              <div className="d-flex flex-column justify-content-between card-body p-4 text-center">
                                <h5 className="card-title text-gold-light mb-3">{product.title}</h5>
                                <p className="card-text text-gold-mid small">{product.content}</p>

                                <div className="d-flex justify-content-center align-items-baseline mb-3">
                                  <span className="small text-gold-dark text-decoration-line-through me-2">
                                    {product.origin_price}
                                    元
                                  </span>
                                  <span className="fs-4 price-gradient">
                                    {product.price}
                                    元
                                  </span>
                                </div>
                                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                  <Link type="button" to={`/product/${product.id}`} className="btn btn-outline-secondary btn-sm px-3 rounded-pill">查看更多</Link>
                                  <button type="button" className="btn-dream-add btn-sm px-3 rounded-pill" disabled={addingId === product.id} onClick={() => addToCart(product)}>
                                    {addingId === product.id
                                      ? (
                                        <span>
                                          <i className="bi bi-magic me-2 pulse"></i>
                                          召喚中...
                                        </span>
                                      )
                                      : (
                                        <span>加入購物車</span>
                                      )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <Pagination
                    pagination={pagination}
                    changePage={getProducts}
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  )
}

export default ProductList
