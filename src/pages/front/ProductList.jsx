import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [displayProducts, setDisplayProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState(null)
  // 2. 初始化 SearchParams
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryQuery = searchParams.get('category') // 取得 URL 中的 category 參數
  const [categories, setCategories] = useState(() => {
    const cached = localStorage.getItem('cachedCategories')
    return cached ? JSON.parse(cached) : ['全部遊戲']
  })
  const [currentCategory, setCurrentCategory] = useState(categoryQuery || '全部遊戲')
  const { showSuccess, showError } = useMessage()
  const dispatch = useDispatch()

  const perPage = 12

  // 抓取「所有」產品
  const getInitialData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`)
      if (res.data.success) {
        const data = res.data.products
        setProducts(data)

        const unformatted = data.map(item => item.category)
        const uniqueCategories = ['全部遊戲', ...new Set(unformatted)].filter(Boolean)
        setCategories(uniqueCategories)
        localStorage.setItem('cachedCategories', JSON.stringify(uniqueCategories))

        // 4. 重要：在此判斷是否有 URL 參數需要立即篩選
        const targetCategory = categoryQuery || '全部遊戲'
        setCurrentCategory(targetCategory)
        renderPage(data, 1, targetCategory)
      }
    }
    catch {
      showError('載入失敗')
    }
    finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ 核心：處理前端分頁與過濾
  const renderPage = useCallback((data, page, category) => {
    // 邏輯：過濾種類（處理「全部遊戲」或 URL 傳進來的類別）
    const filtered = (category === '全部遊戲' || !category)
      ? data
      : data.filter(item => item.category === category || item.category.includes(category))

    const start = (page - 1) * perPage
    const end = start + perPage
    setDisplayProducts(filtered.slice(start, end))

    const totalPages = Math.ceil(filtered.length / perPage) || 1
    setPagination({
      total_pages: totalPages,
      current_page: page,
      has_pre: page > 1,
      has_next: page < totalPages,
    })
  }, [perPage])

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

  const handleCategoryClick = (e, category) => {
    e.preventDefault()
    setCurrentCategory(category)
    setSearchParams({ category: category }) // 更新網址為 ?category=xxx
    // 這裡要傳入完整的產品資料 allProducts，不要直接用 products (有時它可能還沒更新)
    renderPage(products, 1, category)
  }

  const handlePageChange = (page) => {
    renderPage(products, page, currentCategory)
  }

  useEffect(() => {
    getInitialData()
    dispatch(getCartAsync())
  }, [dispatch, getInitialData])

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setCurrentCategory(categoryFromUrl)
      // 確保資料載入後執行篩選
      if (products.length > 0) {
        renderPage(products, 1, categoryFromUrl)
      }
    }
    else {
      setCurrentCategory('全部遊戲')
      if (products.length > 0) {
        renderPage(products, 1, '全部遊戲')
      }
    }
  }, [searchParams, products, renderPage])

  return (
    <div className="bg-dark pt-83 mt-n83">
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-3 d-none d-lg-block">
            <div className="glass-panel rounded-3 p-4 sticky-top" style={{ top: '135px' }}>
              <h5 className="text-gold-gradient mb-4">遊戲分類</h5>
              <ul className="list-group list-group-flush list-unstyled">
                {loading && categories.length <= 1
                  ? [...Array(8)].map((_, i) => (
                    <li key={i} className="list-group-item list-group-item-dream rounded mb-2">
                      <div className="skeleton-line" style={{ height: '20px', width: '80%', backgroundColor: '#333', borderRadius: '4px' }}></div>
                    </li>
                  ))
                  : categories.map(category => (
                    <li key={category}>
                      <a
                        href="#"
                        className={`list-group-item list-group-item-dream ${currentCategory === category ? 'active' : ''}`}
                        onClick={e => handleCategoryClick(e, category)}
                      >
                        {category}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          {loading
            ? (
              <div className="col-lg-9">
                <div className="row gy-4 mb-4">
                  {[...Array(12)].map((_, i) => (
                    <div className="col-lg-4 col-sm-6 col-12" key={i}>
                      {/* 骨架卡片，與實際卡片擁有相同的 class 和高度 */}
                      <div className="card product-card-dream h-100 border-0 overflow-hidden">
                        {/* 圖片區域骨架 */}
                        <div className="skeleton-line product-img-dream"></div>

                        <div className="card-body p-4 text-center">
                          {/* 標題骨架 */}
                          <div className="skeleton-line mb-3 bg-loading w-70 py-3 mx-auto"></div>
                          {/* 內文骨架 */}
                          <div className="skeleton-line mb-2 bg-loading w-90 py-4 mx-auto"></div>
                          <div className="skeleton-line mb-3 bg-loading w-50 py-3 mx-auto"></div>
                          {/* 按鈕骨架 */}
                          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                            <div className="skeleton-line w-100 bg-loading py-3 rounded-pill"></div>
                            <div className="skeleton-line w-100 bg-loading py-3 rounded-pill"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
            : (
              <div className="col-lg-9">
                <div className="row gy-4 mb-4">
                  {
                    displayProducts.map((product) => {
                      return (
                        <div className="col-lg-4 col-sm-6 col-12" key={product.id}>
                          <div className="card product-card-dream h-100">
                            <div className="position-relative overflow-hidden">
                              <img src={product.imageUrl} className="card-img-top product-img-dream img-fluid" alt={product.title} />
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
                                <Link type="button" to={`/product/${product.id}`} className="btn btn-outline-gold-mid btn-sm fs-7 px-3 rounded-pill">查看更多</Link>
                                <button type="button" className="btn-dream-add btn-sm px-3 rounded-pill" disabled={addingId === product.id} onClick={() => addToCart(product)}>
                                  {addingId === product.id
                                    ? (
                                      <span className="fs-7">
                                        <i className="bi bi-magic me-2 pulse"></i>
                                        召喚中...
                                      </span>
                                    )
                                    : (
                                      <span className="fs-7">加入購物車</span>
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
                  changePage={handlePageChange}
                  disabled={loading}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
