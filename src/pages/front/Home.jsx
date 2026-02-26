import { Link } from 'react-router'

const Home = () => {
  return (
    <>
      <div className="bg-primary-10">
        <div className="container-lg position-relative">
          <img
            src={`${import.meta.env.BASE_URL}home.jpg`}
            alt="index"
            className="w-100"
          />
          <Link
            to="/productList"
            className="btn btn-primary-100 text-decoration-none border border-3 border-primary fs-2 p-4 rounded-pill position-absolute bottom-0 end-0 translate-middle"
          >
            立即前往選購
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
