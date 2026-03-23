const EditCoupon = ({
  editOrderRef,
  closeEditModal,
  updateOrder,
  newCoupon, // 統一命名
  handleNewOrderChange,
  errors,
}) => {
  // 強化日期轉換邏輯，防止錯誤的時間戳記導致崩潰
  const dateInput = (newCoupon.due_date && !isNaN(newCoupon.due_date))
    ? new Date(newCoupon.due_date * 1000).toISOString().split('T')[0]
    : ''
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className="modal fade" ref={editOrderRef} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass-login-card border-gold-dark shadow-dream text-white">
          <div className="modal-header border-bottom border-gold-dark">
            <h5 className="modal-title text-gold-gradient">
              {newCoupon.id ? '編輯優惠券' : '新增優惠券'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={closeEditModal}></button>
          </div>
          <div className="modal-body p-4">
            {/* 優惠券名稱 */}
            <div className="mb-3">
              <label htmlFor="couponName" className="form-label text-gold-dark small">優惠券名稱</label>
              <input
                id="couponName"
                type="text"
                name="title"
                className={`form-control bg-dark border-gold-dark text-white ${errors.title ? 'is-invalid' : ''}`}
                value={newCoupon.title}
                onChange={handleNewOrderChange}
              />
              {errors.title && <div className="invalid-feedback text-danger">{errors.title}</div>}
            </div>

            {/* 折扣碼與百分比 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="couponCode" className="form-label text-gold-dark small">折扣代碼</label>
                <input
                  id="couponCode"
                  type="text"
                  name="code"
                  className={`form-control bg-dark border-gold-dark text-white ${errors.code ? 'is-invalid' : ''}`}
                  value={newCoupon.code}
                  onChange={handleNewOrderChange}
                />
                {errors.code && <div className="invalid-feedback text-danger">{errors.code}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="couponPercent" className="form-label text-gold-dark small">折扣 (%)</label>
                <input
                  id="couponPercent"
                  type="number"
                  name="percent"
                  className={`form-control bg-dark border-gold-dark text-white ${errors.percent ? 'is-invalid' : ''}`}
                  value={newCoupon.percent}
                  onChange={handleNewOrderChange}
                />
                {errors.percent && <div className="invalid-feedback text-danger">{errors.percent}</div>}
              </div>
            </div>

            {/* 到期日 */}
            <div className="mb-3">
              <label htmlFor="couponDate" className="form-label text-gold-dark small">到期日</label>
              <input
                id="couponDate"
                type="date"
                name="due_date"
                min={minDate}
                className={`form-control bg-dark border-gold-dark text-white ${errors.due_date ? 'is-invalid' : ''}`}
                value={dateInput}
                onChange={(e) => {
                  const timestamp = e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : 0
                  handleNewOrderChange({ target: { name: 'due_date', value: timestamp } })
                }}
              />
              {errors.due_date && <div className="invalid-feedback text-danger">{errors.due_date}</div>}
            </div>

            {/* 啟用狀態 */}
            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="is_enabled"
                checked={!!newCoupon.is_enabled}
                onChange={e => handleNewOrderChange({
                  target: { name: 'is_enabled', value: e.target.checked ? 1 : 0 },
                })}
              />
              <label className={`form-check-label fw-bold transition-ease02 ${newCoupon.is_enabled === 1 ? 'text-gold-light' : 'text-gold-dark'}`} htmlFor="is_enabled">
                啟用此優惠券
              </label>
            </div>
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary rounded-pill" onClick={closeEditModal}>取消</button>
            <button className="btn btn-dream-submit rounded-pill" onClick={updateOrder}>儲存變更</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCoupon
