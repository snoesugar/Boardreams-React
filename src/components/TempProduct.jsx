import { Collapse } from 'bootstrap'

const TempProduct = ({ tempProduct, modalRef, closeModal }) => {
  if (!tempProduct) return null

  const collapseId = `collapse-${tempProduct.id}`
  const accordionId = `accordion-${tempProduct.id}`

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content glass-login-card border-gold-dark shadow-dream text-white">

          {/* Header: 標題與分類 */}
          <div className="modal-header border-bottom border-gold-dark bg-glass-dark py-3">
            <h5 className="modal-title font-serif text-gold-gradient d-flex align-items-center mb-0">
              <i className="bi bi-search me-2"></i>
              {tempProduct.title}
              <span className="badge text-gold-light border border-gold-dark rounded-pill ms-2 small fw-bold">
                {tempProduct.category}
              </span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
          </div>

          <div className="modal-body p-0">
            {/* 主圖區：增加高度比例與陰影 */}
            <div className="position-relative">
              <img
                src={tempProduct.imageUrl}
                className="w-100 object-fit-cover shadow-sm"
                alt="主圖"
                style={{ height: '280px', display: 'block' }}
              />
            </div>

            {/* 內容區 */}
            <div className="p-4">
              {/* 價格標籤：獨立區塊 */}
              <div className="d-flex justify-content-between align-items-end mb-4 p-3 rounded-3 bg-glass-dark border border-gold-dark">
                <div className="text-start">
                  <div className="small text-primary mb-1">冒險售價</div>
                  <div className="h4 mb-0 text-gold-light fw-bold">
                    <del className="fs-7 text-primary me-1">
                      $
                      {tempProduct.origin_price}
                    </del>
                    $
                    {tempProduct.price}
                    <span className="small text-gold-dark">
                      /
                      {tempProduct.unit}
                    </span>
                  </div>
                </div>
                <div className="text-end text-muted small">
                  原價
                  <del>
                    $
                    {tempProduct.origin_price}
                  </del>
                </div>
              </div>

              {/* 描述與內容：分欄感 */}
              <div className="mb-4">
                <h6 className="text-gold-light fw-bold mb-2 small tracking-widest">
                  <i className="bi bi-feather me-1"></i>
                  物品敘述
                </h6>
                <p className="text-white-50 small lh-lg bg-glass-dark p-3 rounded border-start border-gold-mid">
                  {tempProduct.content || '暫無敘述'}
                </p>
              </div>

              <div className="mb-4">
                <h6 className="text-gold-light fw-bold mb-2 small tracking-widest">
                  <i className="bi bi-box-seam me-1"></i>
                  物品內容
                </h6>
                <p className="text-white-50 small lh-lg px-2">
                  {tempProduct.description || '暫無詳細內容'}
                </p>
              </div>

              {/* 副圖手風琴：優化展開效果 */}
              <div className="accordion border-top border-gold-dark pt-3" id={accordionId}>
                <div className="accordion-item glass-login-card border-0">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed glass-login-card text-gold-light shadow-none px-0 py-2 d-flex justify-content-between align-items-center custom-accordion-btn"
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(collapseId)
                        if (!el) return
                        const instance = Collapse.getOrCreateInstance(el)
                        instance.toggle()
                      }}
                    >
                      <span>
                        <i className="bi bi-images me-2"></i>
                        更多細節圖預覽
                      </span>

                      {/* 新增的箭頭圖示 */}
                      <i className="bi bi-chevron-down accordion-arrow ms-auto"></i>
                    </button>
                  </h2>
                  <div id={collapseId} className="accordion-collapse collapse" data-bs-parent={`#${accordionId}`}>
                    <div className="accordion-body px-0 pt-3">
                      <div className="row g-2">
                        {tempProduct.imagesUrl?.filter(url => url).map((img, index) => (
                          <div className="col-4" key={index}>
                            <div className="ratio ratio-1x1 border border-gold-dark rounded overflow-hidden">
                              <img src={img} className="img-fluid w-100 h-100 object-fit-cover transition-ease02" alt={`副圖 ${index + 1}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top border-gold-dark bg-glass-dark">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-5" onClick={closeModal}>
              關閉閱覽
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TempProduct
