import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'animate.css'
import { Link } from 'react-router'

const convention = [
  { title: '工匠選品', icon: 'bi-gem', desc: '我們對品質近乎挑剔，只為確保那份觸手可及的精緻。從美術到機制，我們只選最好的。' },
  { title: '智力探險', icon: 'bi-lightbulb', desc: '不只是消遣，更是一場關於靈魂與智慧的深度激盪。在這裡，大腦是您最強大的武器。' },
  { title: '社交綠洲', icon: 'bi-cup-hot', desc: '讓實體桌面成為數位沙漠中的一片清涼綠洲。關掉手機，開啟一場真實的面對面交談。' },
]

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  useEffect(() => {
    AOS.refresh()
  }, [])

  return (
    <div className="bg-dark text-primary overflow-hidden">
      {/* 1. 英雄區：視覺張力 */}
      <section className="about-hero py-8 text-center position-relative">
        <div className="container position-relative z-1">
          <span className="text-gold-mid fw-bold tracking-widest mb-3 d-block" data-aos="zoom-out-down">EST. 2026</span>
          <h2 className="display-2 fw-bold text-gold-gradient mb-4" data-aos="zoom-in-up">
            創造回憶的建築師
          </h2>
          <div className="mx-auto bg-gold-gradient mb-5" data-aos="zoom-in-up"></div>
          <p className="lead mx-auto mb-5 opacity-75 lh-base" data-aos="fade-up">
            在數位的喧囂中，我們在實體世界裡挖掘純粹。
            <br />
            「桌」思夢想不只是店名，更是我們對「真實連結」的承諾。
          </p>
        </div>
        <div className="magic-glow-circle"></div>
      </section>

      {/* 2. 核心理想：交錯式故事敘述 */}
      <section className="py-7">
        <div className="container">
          {/* 第一節：溫度 */}
          <div className="row align-items-center g-5 mb-9">
            <div className="col-md-6 position-relative">
              <div className="about-img-frame shadow-dream" data-aos="zoom-out-right">
                <img
                  src={`${import.meta.env.BASE_URL}Board Game Gathering.jpg`}
                  alt="Board Game Gathering"
                  className="img-fluid rounded-4"
                />
              </div>
              <div className="floating-badge d-none d-lg-block" data-aos="zoom-out-right">Connect</div>
            </div>
            <div className="col-md-6 ps-lg-6">
              <h3 className="text-gold-gradient mb-4 fw-bold display-5" data-aos="fade-up">找回交談的溫度</h3>
              <p className="lh-lg fs-5" data-aos="fade-left">
                在這個螢幕無處不在的時代，我們發現最珍貴的感動，往往不在手機的通知裡，而是在一張桌子兩端、眼神交會的瞬間。
              </p>
              <p className="lh-lg text-white-50" data-aos="fade-left">
                我們的任務是將那些被數位噪音稀釋的笑聲、專注與競爭感，重新帶回實體世界。每一場開局，都是一次心靈的重新對焦。
              </p>
            </div>
          </div>

          {/* 第二節：啟動碼 */}
          <div className="row align-items-center flex-row-reverse g-5 my-8">
            <div className="col-md-6 position-relative">
              <div className="about-img-frame shadow-dream border-gold-subtle" data-aos="zoom-out-left">
                <img
                  src={`${import.meta.env.BASE_URL}Game Strategy.jpg`}
                  alt="Game Strategy"
                  className="img-fluid rounded-4"
                />
              </div>
              <div className="floating-badge-right d-none d-lg-block" data-aos="zoom-out-left">Explore</div>
            </div>
            <div className="col-md-6 pe-lg-6">
              <h3 className="text-gold-gradient mb-4 fw-bold display-5" data-aos="fade-up">故事的啟動碼</h3>
              <p className="lh-lg fs-5" data-aos="fade-right">
                每一款精心挑選的遊戲，都是一場未知的遠征。
              </p>
              <p className="lh-lg text-white-50" data-aos="fade-right">
                我們不販售塑膠與紙張，我們提供的是開啟史詩冒險的鑰匙。
                無論是建設文明的策略，或是派對上的機智對談，我們都是你與夥伴回憶的共同建築師。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 數據實績：建立信任感 */}
      <section className="bg-panel py-5 my-8">
        <div className="container text-center">
          <div className="mb-5">
            <h3 className="text-gold-gradient mb-2" data-aos="zoom-in-up">冒險者的旅程紀錄</h3>
            <div className="bg-gold-gradient mx-auto mb-5" data-aos="zoom-in-up"></div>
          </div>
          <div className="row g-4">
            <div className="col-6 col-md-3" data-aos="zoom-in-left">
              <div className="h2 text-gold-gradient fw-bold mb-1">500+</div>
              <div className="small text-uppercase tracking-widest text-primary-subtle">精選遊戲</div>
            </div>
            <div className="col-6 col-md-3" data-aos="zoom-in-left">
              <div className="h2 text-gold-gradient fw-bold mb-1">10k+</div>
              <div className="small text-uppercase tracking-widest text-primary-subtle">冒險參與者</div>
            </div>
            <div className="col-6 col-md-3" data-aos="zoom-in-right">
              <div className="h2 text-gold-gradient fw-bold mb-1">24/7</div>
              <div className="small text-uppercase tracking-widest text-primary-subtle">夢想支援</div>
            </div>
            <div className="col-6 col-md-3" data-aos="zoom-in-right">
              <div className="h2 text-gold-gradient fw-bold mb-1">∞</div>
              <div className="small text-uppercase tracking-widest text-primary-subtle">創造的回憶</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 願景卡片：冒險者公約 */}
      <section className="container py-5 my-8">
        <div className="text-center mb-6">
          <h3 className="text-gold-gradient" data-aos="zoom-in-up">冒險者公約</h3>
          <div className="bg-gold-gradient mx-auto" data-aos="zoom-in-up"></div>
        </div>
        <div className="row g-4">
          {convention.map((item, index) => (
            <div className="col-md-4" key={index} data-aos="flip-right">
              <div className="glass-panel p-5 h-100 text-center hover-lift-up rounded-4 transition-ease02">
                <div className="icon-wrapper mb-4">
                  <i className={`bi ${item.icon} fs-1 text-gold-mid`}></i>
                </div>
                <h4 className="text-gold-light mb-3">{item.title}</h4>
                <p className="text-white-50 mb-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 品牌呼籲：最後的引言 */}
      <section className="bg-panel text-center py-6">
        <div className="p-5 rounded-4">
          <h3 className="text-gold-gradient fs-2 mb-4" data-aos="zoom-out">準備好開啟你的下一場傳說嗎？</h3>
          <p className="text-primary mb-5" data-aos="zoom-out-up">加入我們的行列，在方寸之間建築屬於你的夢想。</p>
          <div className="animate__animated animate__headShake animate__infinite">
            <Link
              className="btn-dream-add text-decoration-none fs-4 px-5 py-3 rounded-pill tracking-widest"
              data-aos="flip-left"
              to="/productList"
            >
              瀏覽產品清單
            </Link>
          </div>
        </div>
        <hr className="border-gold-dark" />
      </section>
    </div>
  )
}

export default About
