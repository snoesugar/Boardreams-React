import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCartAsync } from '../slice/cartSlice'

const FrontLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const carts = useSelector(state => state.cart.carts)
  const totalQty = carts?.reduce((sum, item) => sum + item.qty, 0) || 0

  const toggleNavbar = () => {
    setIsOpen(prev => !prev)
  }

  const closeNavbar = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    dispatch(getCartAsync())
  }, [dispatch])

  return (
    <>
      <div className="sticky-top navbar-dream">
        <div className="container-lg">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid px-0">

              <Link
                className="navbar-brand text-primary navbar-brand-dream fs-3 p-0"
                to="/"
                onClick={closeNavbar}
              >
                『桌』思夢想
              </Link>

              <button
                className="navbar-toggler border-gold-dark"
                type="button"
                onClick={toggleNavbar}
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link
                      className="nav-link px-3 text-primary"
                      to="/productList"
                      onClick={closeNavbar}
                    >
                      產品清單
                      <i className="bi bi-list-stars ms-1"></i>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="nav-link px-3 text-primary"
                      to="/cart"
                      onClick={closeNavbar}
                    >
                      購物車
                      <i className="bi bi-cart-fill ms-1 position-relative">
                        {totalQty > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {totalQty}
                            <span className="visually-hidden">cart items</span>
                          </span>
                        )}
                      </i>
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link
                      className="nav-link px-5 text-primary"
                      to="/login"
                      onClick={closeNavbar}
                    >
                      登入
                      <i className="bi bi-person-fill ms-1"></i>
                    </Link>
                  </li>
                </ul>

              </div>
            </div>
          </nav>
        </div>
      </div>

      <Outlet />

      <footer className="bg-panel navbar-dream py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <h3 className="text-gold-gradient mb-3">「桌」思夢想</h3>
              <p className="text-primary mb-0 pe-lg-5">
                每一場開箱，都是一場未知的遠征。
              </p>
              <p className="text-primary pe-lg-5">
                我們相信最好的故事不在螢幕裡，而是在你與夥伴交手的桌面上。
              </p>
            </div>

            <div className="col-6 col-lg-2">
              <h6 className="text-gold-light mb-3">
                探索夢境
                <i className="bi bi-stars ms-1"></i>
              </h6>
              <ul className="list-unstyled text-primary">
                <li><a href="#" className="nav-link p-0 mb-2">新品上市</a></li>
                <li><a href="#" className="nav-link p-0 mb-2">熱門排行</a></li>
                <li><a href="#" className="nav-link p-0 mb-2">獨家預購</a></li>
              </ul>
            </div>

            <div className="col-6 col-lg-2">
              <h6 className="text-gold-light mb-3">
                冒險支援
                <i className="bi bi-flag-fill ms-1"></i>
              </h6>
              <ul className="list-unstyled text-primary">
                <li><a href="#" className="nav-link p-0 mb-2">寄送政策</a></li>
                <li><a href="#" className="nav-link p-0 mb-2">退換貨須知</a></li>
                <li><a href="#" className="nav-link p-0 mb-2">實體據點</a></li>
              </ul>
            </div>

            <div className="col-lg-3">
              <h6 className="text-gold-light mb-3">
                追蹤傳說
                <i className="bi bi-hand-index-thumb-fill ms-1"></i>
              </h6>
              <div className="d-flex gap-3">
                <a href="#" className="btn btn-outline-warning btn-sm rounded-circle"><i className="bi bi-facebook"></i></a>
                <a href="#" className="btn btn-outline-warning btn-sm rounded-circle"><i className="bi bi-instagram"></i></a>
                <a href="#" className="btn btn-outline-warning btn-sm rounded-circle"><i className="bi bi-youtube"></i></a>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gold-dark" />

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <p className="small text-primary mb-0">© 2026 「桌」思夢想 | 創造回憶的建築師。</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default FrontLayout
