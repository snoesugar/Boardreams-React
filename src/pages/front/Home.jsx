import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom' // 注意：這裡應該是 'react-router-dom'
import useMessage from '../../hooks/useMessage' // 假設你也需要在首頁顯示訊息

// Swiper 相關導入
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules' // 導入所需的模組
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

const categories = [
  { title: '策略燒腦', path: '策略桌遊', img: 'cat-strategy.jpg', desc: '深度思考，運籌帷幄' },
  { title: '歡樂派對', path: '派對遊戲', img: 'cat-party.jpg', desc: '聚會首選，笑聲不斷' },
  { title: '親子共遊', path: '合作遊戲', img: 'cat-family.jpg', desc: '家庭時光，寓教於樂' },
  { title: '情境解謎', path: '硬核策略', img: 'cat-mystery.jpg', desc: '沉浸劇情，尋找真相' },
]

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { showError } = useMessage() // 引入錯誤訊息提示

  const getProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`)

      // ✅ 多加一層檢查：確保 API 確實回傳了我們想要的資料結構
      if (res.data && res.data.success) {
        setProducts(res.data.products)
      }
      else {
        // 如果 API 回傳 status 200 但裡面寫 success: false
        throw new Error('API 狀態異常')
      }
    }
    catch {
      showError('產品載入失敗！')
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-dark pt-83 mt-n83">
      {/* Hero Section */}
      <div className="position-relative mb-5">
        <img
          src={`${import.meta.env.BASE_URL}home.jpg`} // 請確認你的圖片路徑
          alt="首頁主視覺"
          className="w-100 object-fit-cover object-position-center hero-img"
        />
        <Link
          to="/productList"
          className="btn-dream text-decoration-none p-4 position-absolute start-50 top-50 translate-middle" // 置中
        >
          <span className="text-gold-gradient text-nowrap fs-2">
            開啟夢想冒險
            <i className="bi bi-caret-right-fill"></i>
          </span>
        </Link>
      </div>

      {/* 桌遊理念文案 */}
      <div className="container py-5 my-5 text-center">
        <h2 className="text-gold-gradient mb-4">探索無限可能，連結彼此心靈</h2>
        <p className="text-white-50 fs-5 lh-lg w-75 mx-auto">
          在「夢想桌遊」的世界裡，每一款遊戲都是一場全新的冒險。我們相信桌遊不僅僅是娛樂，更是增進人際互動、激發創意思維的橋樑。無論是策略燒腦的挑戰、幽默爆笑的派對遊戲，還是感人至深的合作故事，都能在這裡找到屬於你的那份樂趣。放下手機，與家人朋友一同坐下，點亮你們的桌遊之夜吧！
        </p>
      </div>

      {/* 玩桌遊心情變好三步驟 */}
      <div className="container py-5 mb-5">
        <div className="text-center mb-5">
          <h3 className="text-gold-gradient fw-bold">簡單三步驟，點亮好心情</h3>
          <div className="bg-gold-gradient mx-auto"></div>
        </div>

        <div className="row g-4">
          {/* 步驟 1 */}
          <div className="col-md-4">
            <div className="step-card p-4 h-100 rounded-4 position-relative overflow-hidden text-center transition-ease02">
              <div className="step-number mb-3">01</div>
              <div className="fs-1 mb-3"><i className="bi bi-people-fill text-gold-light"></i></div>
              <h4 className="text-gold-mid mb-3">相聚共鳴</h4>
              <p className="text-white-50 small">放下數位裝置的隔閡，與親友圍繞桌前，透過面對面的互動與交談，重新建立最真實的情感連結。</p>
            </div>
          </div>

          {/* 步驟 2 */}
          <div className="col-md-4">
            <div className="step-card p-4 h-100 rounded-4 position-relative overflow-hidden text-center transition-ease02">
              <div className="step-number mb-3">02</div>
              <div className="fs-1 mb-3"><i className="bi bi-controller text-gold-light"></i></div>
              <h4 className="text-gold-mid mb-3">沉浸挑戰</h4>
              <p className="text-white-50 small">在充滿創意的規則中，體驗腦力激盪的快感。無論是精準策略還是爆笑意外，都能帶你遠離日常煩惱。</p>
            </div>
          </div>

          {/* 步驟 3 */}
          <div className="col-md-4">
            <div className="step-card p-4 h-100 rounded-4 position-relative overflow-hidden text-center transition-ease02">
              <div className="step-number mb-3">03</div>
              <div className="fs-1 mb-3"><i className="bi bi-stars text-gold-light"></i></div>
              <h4 className="text-gold-mid mb-3">釋放歡笑</h4>
              <p className="text-white-50 small">當終局揭曉，無論輸贏都是精彩的回憶。讓純粹的成就感與歡笑轉化為正能量，療癒忙碌的心靈。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 熱門類別探索 */}
      <div className="container py-5 mb-5">
        <div className="text-center mb-5">
          <h3 className="text-gold-gradient fw-bold">熱門類別探索</h3>
          <p className="text-white-50">找尋適合你的冒險方向</p>
        </div>

        <div className="row g-4">
          {categories.map((cat, index) => (
            <div className="col-6 col-md-3" key={index}>
              <Link to={`/productList?category=${cat.path}`} className="category-card-wrapper text-decoration-none">
                <div className="category-card position-relative overflow-hidden rounded-4">
                  <img
                    src={`${import.meta.env.BASE_URL}${cat.img}`}
                    alt={cat.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                  {/* 遮罩層 */}
                  <div className="category-overlay d-flex flex-column justify-content-center align-items-center text-center p-3">
                    <h4 className="text-gold-light fw-bold mb-1">{cat.title}</h4>
                    <span className="category-desc small text-white d-none d-md-block">{cat.desc}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 產品輪播區塊 */}
      <div className="container py-5">
        <h3 className="text-gold-gradient text-center mb-5">精選熱門遊戲</h3>
        {loading
          ? (
            <div className="row gy-4 mb-4">
              {[...Array(4)].map((_, i) => ( // 顯示4個骨架卡片
                <div className="col-lg-3 col-md-6 col-12" key={i}>
                  <div className="card product-card-dream h-100 border-0 overflow-hidden">
                    <div className="skeleton-line" style={{ height: '200px', backgroundColor: '#2a2a2a' }}></div>
                    <div className="card-body p-3 text-center">
                      <div className="skeleton-line mb-2 mx-auto" style={{ height: '18px', width: '80%', backgroundColor: '#333' }}></div>
                      <div className="skeleton-line mb-3 mx-auto" style={{ height: '14px', width: '60%', backgroundColor: '#333' }}></div>
                      <div className="skeleton-line" style={{ height: '30px', width: '100px', borderRadius: '50px', backgroundColor: '#333' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
          : (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30} // 每個 Slide 之間的距離
              slidesPerView={1} // 預設顯示一個
              loop={true} // 循環播放
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              navigation={true} // 顯示前後導航按鈕
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="mySwiper"
            >
              {products.map(product => (
                <SwiperSlide key={product.id}>
                  <div className="card product-card-dream h-100">
                    <div className="position-relative overflow-hidden">
                      <img src={product.imageUrl} className="card-img-top product-img-dream" alt={product.title} />
                    </div>
                    <div className="card-body p-3 text-center">
                      <h5 className="card-title text-gold-light mb-2">{product.title}</h5>
                      <p className="card-text text-gold-mid small mb-3">{product.category}</p>
                      <Link to={`/product/${product.id}`} className="btn btn-outline-gold-mid btn-sm px-3 rounded-pill">
                        查看更多
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
      </div>
    </div>
  )
}

export default Home
