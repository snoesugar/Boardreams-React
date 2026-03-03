import { Link } from 'react-router'

const Home = () => {
  return (
    <>
      <div className="bg-dark pt-83 mt-n83">
        <div className="position-relative">
          <img
            src={`${import.meta.env.BASE_URL}home.jpg`}
            alt="index"
            className="w-100"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <Link
            to="/productList"
            className="btn-dream glass-panel text-decoration-none p-4 position-absolute"
          >
            <span className="text-gold-gradient fs-2">
              立即前往選購
              <i className="bi bi-caret-right-fill"></i>
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
