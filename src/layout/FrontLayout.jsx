import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCartAsync } from '../slice/cartSlice'

const FrontLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const carts = useSelector(state => state.cart.carts)
  const totalQty = carts?.reduce((sum, item) => sum + item.qty, 0) || 0
  const location = useLocation()

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
      <nav className="sticky-top navbar-dream">
        <div className="container-lg">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid px-0">

              <Link
                className="navbar-brand navbar-brand-dream py-3"
                to="/"
                onClick={closeNavbar}
              >
                <span className="fs-4">『桌』</span>
                <span className="fs-5">思夢想</span>
              </Link>

              <button
                className={`navbar-toggler border-0 ${!isOpen ? 'collapsed' : ''}`}
                type="button"
                onClick={toggleNavbar}
              >
                <span className="toggler-icon-bar top-bar"></span>
                <span className="toggler-icon-bar middle-bar"></span>
                <span className="toggler-icon-bar bottom-bar"></span>
              </button>

              <div
                className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link
                      className={`nav-link-dream px-3 text-primary ${location.pathname === '/about' ? 'active' : ''}`}
                      to="/about"
                      onClick={closeNavbar}
                    >
                      <span>關於我們</span>
                      <i className="bi bi-feather ms-1"></i>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`nav-link-dream px-3 text-primary ${location.pathname === '/productList' ? 'active' : ''}`}
                      to="/productList"
                      onClick={closeNavbar}
                    >
                      <span>產品清單</span>
                      <i className="bi bi-compass ms-1"></i>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`nav-link-dream px-3 text-primary ${location.pathname === '/cart' ? 'active' : ''}`}
                      to="/cart"
                      onClick={closeNavbar}
                    >
                      購物車
                      <i className="bi bi-cart-fill ms-1 position-relative">
                        {totalQty > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger pulse-animation">
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
                      className={`nav-link-dream px-3 text-primary ${location.pathname === '/login' ? 'active' : ''}`}
                      to="/login"
                      onClick={closeNavbar}
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      <span>冒險者登入</span>
                    </Link>
                  </li>
                </ul>

              </div>
            </div>
          </nav>
        </div>
      </nav>

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
