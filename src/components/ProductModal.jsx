const ProductModal = ({
  modalRef,
  title,
  closeModal,
  submitText = '儲存',
  submitAction,
  newProduct,
  handleNewProductChange,
  setNewProduct,
  errors,
  handleFileChange,
}) => {
  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
      {/* 使用 modal-lg 讓長表單有更多橫向空間 */}
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content glass-login-card border-gold-dark shadow-dream text-white">

          {/* Header 強化金屬質感 */}
          <div className="modal-header border-bottom border-gold-dark">
            <h1 className="modal-title fs-4 font-serif text-gold-gradient">
              <i className="bi bi-gem me-2"></i>
              {title}
            </h1>
            <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
          </div>

          <div className="modal-body py-4">
            <form className="container-fluid">
              <div className="row g-4">

                {/* 左側：基本資訊 */}
                <div className="col-lg-7">
                  <h6 className="text-gold-light mb-3 fw-bold border-start border-3 border-gold-light ps-2">
                    基本資訊
                  </h6>

                  <div className="mb-3">
                    <label htmlFor="title" className="form-label small text-primary">產品名稱</label>
                    <input
                      type="text"
                      className={`form-control admin-input ${errors.title ? 'is-invalid' : ''}`}
                      id="title"
                      placeholder="請輸入產品名稱"
                      value={newProduct.title}
                      onChange={handleNewProductChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <label htmlFor="category" className="form-label small text-primary">分類</label>
                      <input
                        type="text"
                        className={`form-control admin-input ${errors.category ? 'is-invalid' : ''}`}
                        id="category"
                        value={newProduct.category}
                        onChange={handleNewProductChange}
                      />
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
                    <div className="col-6">
                      <label htmlFor="unit" className="form-label small text-primary">單位</label>
                      <input
                        type="text"
                        className={`form-control admin-input ${errors.unit ? 'is-invalid' : ''}`}
                        id="unit"
                        value={newProduct.unit}
                        onChange={handleNewProductChange}
                      />
                      {errors.unit && <div className="invalid-feedback">{errors.unit}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label small text-primary">原價</label>
                      <div className="input-group">
                        <span className="input-group-text admin-input border-end-0 text-gold-light">$</span>
                        <input
                          type="number"
                          className={`form-control admin-input ${errors.origin_price ? 'is-invalid' : ''}`}
                          id="origin_price"
                          value={newProduct.origin_price}
                          onChange={handleNewProductChange}
                        />
                        {errors.origin_price && <div className="invalid-feedback">{errors.origin_price}</div>}
                      </div>
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label small text-primary">售價</label>
                      <div className="input-group">
                        <span className="input-group-text admin-input border-end-0 text-gold-light">$</span>
                        <input
                          type="number"
                          className={`form-control admin-input ${errors.price ? 'is-invalid' : ''}`}
                          id="price"
                          value={newProduct.price}
                          onChange={handleNewProductChange}
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label small text-primary">產品描述</label>
                    <textarea
                      className="form-control admin-input"
                      id="description"
                      rows="2"
                      value={newProduct.description}
                      onChange={handleNewProductChange}
                    >
                    </textarea>
                  </div>

                  <div className="form-check form-switch align-middle mt-4">
                    <input
                      className="form-check-input custom-switch"
                      type="checkbox"
                      id="is_enabled"
                      checked={newProduct.is_enabled === 1}
                      onChange={e => setNewProduct({ ...newProduct, is_enabled: e.target.checked ? 1 : 0 })}
                    />
                    <label className={`form-check-label fw-bold transition-ease02 ${newProduct.is_enabled === 1 ? 'text-gold-light' : 'text-gold-dark'}`} htmlFor="is_enabled">
                      {newProduct.is_enabled === 1 ? '冒險者可見 (已上架)' : '倉庫庫存中 (未上架)'}
                    </label>
                  </div>
                </div>

                <div className="d-lg-none border border-gold-dark mb-4"></div>

                {/* 右側：圖片上傳與預覽 */}
                <div className="col-lg-5 border-lg-start border-gold-dark">
                  <h6 className="text-gold-light mb-3 fw-bold border-start border-3 border-gold-light ps-2">
                    產品圖片
                  </h6>

                  <div className="image-upload-area p-3 rounded-4 border border-dashed border-gold-dark bg-glass-dark text-center mb-3">
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      {newProduct.imageUrl
                        ? (
                          <div className="position-relative group">
                            <img src={newProduct.imageUrl} className="img-fluid rounded-3 shadow-sm main-preview" alt="預覽" />
                            <div className="image-overlay">更換圖片</div>
                          </div>
                        )
                        : (
                          <div className="py-4">
                            <i className="bi bi-cloud-arrow-up fs-1 text-gold-light"></i>
                            <p className="small text-primary mt-2">點擊或拖放上傳主圖</p>
                          </div>
                        )}
                    </label>
                    <input
                      type="file"
                      id="fileUpload"
                      className="d-none"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label small text-primary">或輸入圖片網址</label>
                    <input
                      type="text"
                      className="form-control admin-input form-control-sm"
                      id="imageUrl"
                      placeholder="https://..."
                      value={newProduct.imageUrl}
                      onChange={handleNewProductChange}
                    />
                  </div>

                  {/* 副圖區：小型橫向排列 */}
                  <div className="sub-images-grid mt-4">
                    <p className="small text-gold-dark mb-2">更多細節圖 (最多 5 張)</p>
                    <div className="row g-2">
                      {(newProduct.imagesUrl || []).map((img, index) => (
                        <div className="col-4" key={index}>
                          <div className="sub-image-item">
                            <input
                              type="text"
                              className="form-control admin-input form-control-sm mb-1"
                              placeholder={`圖 ${index + 1}`}
                              value={img}
                              onChange={(e) => {
                                const newImages = [...newProduct.imagesUrl]
                                newImages[index] = e.target.value
                                setNewProduct({ ...newProduct, imagesUrl: newImages })
                              }}
                            />
                            {img && <img src={img} className="img-thumbnail border-gold-dark" alt="副圖" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>

          <div className="modal-footer border-top border-gold-dark bg-glass-dark">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closeModal}>
              取消
            </button>
            <button type="button" className="btn btn-dream-submit rounded-pill px-4" onClick={submitAction}>
              {submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
