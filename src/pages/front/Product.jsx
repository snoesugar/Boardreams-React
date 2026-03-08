import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import useMessage from '../../hooks/useMessage'
import { useDispatch } from 'react-redux'
import { getCartAsync } from '../../slice/cartSlice'
const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

const Product = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [images, setImages] = useState([])
  const [addingId, setAddingId] = useState(null)
  const navigate = useNavigate()
  const { showSuccess, showError } = useMessage()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`)
        const productData = res.data.product
        setProduct(productData)

        // 使用 imagesUrl 陣列，如果沒有就 fallback 到 main image
        setImages(productData.imagesUrl?.length ? productData.imagesUrl : [productData.imageUrl])
        setMainImage(productData.imageUrl)
      }
      catch (error) {
        showError(error.response.data.message)
      }
      finally {
        setLoading(false)
      }
    }

    fetchProduct()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const addToCart = async (qty = 1) => {
    if (addingId === product.id) return
    try {
      setAddingId(product.id)
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: product.id,
          qty,
        },
      })
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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!product) return <p className="text-center text-primary mt-5">找不到產品</p>

  return (
    <div className="container pt-83 pb-5">
      {/* 麵包屑/返回按鈕 */}
      <nav className="mb-6">
        <button
          className="btn btn-outline-gold-light border-0 d-flex align-items-center"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          返回冒險清單
        </button>
      </nav>

      <div className="row g-lg-5 g-4 glass-panel p-lg-5 p-3 rounded-4 shadow-dream mx-0">

        {/* 左側：幻燈片式圖片區 */}
        <div className="col-lg-6">
          <div className="position-relative mb-3 overflow-hidden rounded-3 border border-gold-dark shadow-lg">
            <img
              src={mainImage}
              alt={product.title}
              className="img-fluid w-100 object-fit-cover transition-ease02"
              style={{ height: '450px' }}
            />
            {/* 圖片裝飾角 (可選 CSS 實作) */}
            <div className="image-bottom-gradient"></div>
          </div>

          {/* 縮圖滾動區 */}
          <div className="d-flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {images.map((img, index) => (
              <div
                key={index}
                className={`product-thumb-wrapper rounded border-2 transition-ease02 ${mainImage === img ? 'border-gold-light' : 'border-transparent opacity-60'}`}
                style={{ cursor: 'pointer', flex: '0 0 80px', height: '80px' }}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt={`thumb-${index}`} className="w-100 h-100 object-fit-cover rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* 右側：商品資訊區 */}
        <div className="col-lg-6 text-start d-flex flex-column">
          <div className="mb-auto">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-glass-gold px-3 py-2 rounded-pill small">
                <i className="bi bi-tag-fill me-1"></i>
                {product.category}
              </span>
            </div>

            <h1 className="display-6 text-gold-gradient font-serif fw-bold mb-4">{product.title}</h1>

            {/* 描述區塊 */}
            <div className="mb-4">
              <h6 className="text-gold-light fw-bold small tracking-widest border-start border-3 border-gold-mid ps-2 mb-3">
                物品傳說
              </h6>
              <p className="text-white-50 lh-lg bg-glass-dark p-3 rounded border border-gold-dark shadow-inner mb-4">
                {product.content}
              </p>

              <h6 className="text-gold-light fw-bold small tracking-widest border-start border-3 border-gold-mid ps-2 mb-3">
                附魔內容
              </h6>
              <p className="text-white-50 lh-lg px-2">
                {product.description}
              </p>
            </div>
          </div>

          {/* 底部操作區：價格與按鈕 */}
          <div className="mt-4 pt-4 border-top border-gold-dark">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <span className="text-gold-dark small d-block mb-1">冒險者通行價</span>
                <div className="d-flex align-items-end gap-2">
                  <h2 className="text-gold-light fw-bold mb-0">
                    NT$
                    {product.price}
                  </h2>
                  <span className="text-gold-dark small">
                    /
                    {product.unit}
                  </span>
                </div>
              </div>
              <div className="text-end">
                <del className="text-gold-dark small">
                  原價 NT$
                  {product.origin_price}
                </del>
              </div>
            </div>

            <button
              className="btn-dream-add btn-lg w-100 py-3 rounded-pill shadow-dream d-flex align-items-center justify-content-center"
              disabled={addingId === product.id}
              onClick={() => addToCart()}
            >
              {addingId === product.id
                ? (
                  <>
                    <i className="bi bi-magic fs-4 me-3"></i>
                    <span className="fw-bold">
                      召喚中...
                    </span>
                  </>
                )
                : (
                  <>
                    <i className="bi bi-cart-plus fs-4 me-3"></i>
                    <span className="fw-bold">加入購物車</span>
                  </>
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
