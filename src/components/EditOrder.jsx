const EditOrder = ({
  editOrderRef,
  closeEditModal,
  updateOrder,
  newOrder,
  handleNewOrderChange,
  setNewOrder,
  errors,
  updateOrderQty,
  deleteProduct,
}) => {
  return (
    <div className="modal fade" ref={editOrderRef} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content glass-login-card border-gold-dark shadow-dream text-white">

          <div className="modal-header border-bottom border-gold-dark">
            <h1 className="modal-title fs-4 font-serif text-gold-gradient">
              <i className="bi bi-pencil-square me-2"></i>
              編輯訂單
            </h1>
            <button type="button" className="btn-close btn-close-white" onClick={closeEditModal}></button>
          </div>

          <div className="modal-body py-4 custom-scrollbar">
            <form className="container-fluid">

              {/* --- 會員資訊區塊 --- */}
              <section className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <h6 className="text-gold-light fw-bold mb-0 border-start border-3 border-gold-light ps-2">
                    會員資訊
                  </h6>
                  <hr className="flex-grow-1 ms-3 border-gold-dark opacity-25" />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label small text-primary">收件者姓名</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      id="name"
                      value={newOrder.user?.name || ''}
                      onChange={e => setNewOrder({
                        ...newOrder,
                        user: { ...newOrder.user, name: e.target.value },
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="tel" className="form-label small text-primary">聯絡電話</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      id="tel"
                      value={newOrder.user?.tel || ''}
                      onChange={e => setNewOrder({
                        ...newOrder,
                        user: { ...newOrder.user, tel: e.target.value },
                      })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label small text-primary">Email 地址</label>
                    <input
                      type="email"
                      className="form-control admin-input"
                      id="email"
                      value={newOrder.user?.email || ''}
                      onChange={e => setNewOrder({
                        ...newOrder,
                        user: { ...newOrder.user, email: e.target.value },
                      })}
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="form-label small text-primary">收件地址</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      id="address"
                      value={newOrder.user?.address || ''}
                      onChange={e => setNewOrder({
                        ...newOrder,
                        user: { ...newOrder.user, address: e.target.value },
                      })}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="form-label small text-primary">訂單備註</label>
                    <textarea
                      className={`form-control admin-input ${errors.message ? 'is-invalid' : ''}`}
                      id="message"
                      name="message"
                      rows="2"
                      value={newOrder.message || ''}
                      onChange={handleNewOrderChange}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                  </div>
                </div>

                {/* 付款狀態開關 */}
                <div className="form-check form-switch align-middle mt-4">
                  <input
                    className="form-check-input custom-switch"
                    type="checkbox"
                    id="is_paid"
                    checked={newOrder.is_paid}
                    onChange={e => setNewOrder({ ...newOrder, is_paid: e.target.checked })}
                  />
                  <label className={`form-check-label fw-bold ${newOrder.is_paid ? 'text-gold-light' : 'text-gold-dark'}`} htmlFor="is_paid">
                    {newOrder.is_paid ? '此訂單已完成付款' : '尚未付款'}
                  </label>
                </div>
              </section>

              {/* --- 訂單商品區塊 --- */}
              <section>
                <div className="d-flex align-items-center mb-3">
                  <h6 className="text-gold-light fw-bold mb-0 border-start border-3 border-gold-light ps-2">
                    訂單商品內容
                  </h6>
                  <hr className="flex-grow-1 ms-3 border-gold-dark opacity-25" />
                </div>

                <div className="order-items-container">
                  {Object.entries(newOrder.products || {}).map(([cartId, item], index) => (
                    <div key={cartId} className="item-card mb-3 p-3 rounded-3 border border-gold-dark bg-glass-dark shadow-sm position-relative overflow-hidden">
                      <div className="row align-items-center g-3">
                        {/* 商品資訊 */}
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <span className="badge bg-gold-dark me-2">{index + 1}</span>
                            <h6 className="mb-0 text-white text-truncate">{item.product?.title || '未知商品'}</h6>
                          </div>
                          <div className="mt-2 small text-gold-mid">
                            <span className="me-3">
                              單價:
                              <del className="text-gold-dark mx-1">
                                $
                                {item.product?.origin_price}
                              </del>
                              <span className="text-gold-light">
                                $
                                {item.product?.price}
                              </span>
                            </span>
                            <span className="text-gold-light">
                              小計 :
                              {' '}
                              <span className="fw-bold">
                                $
                                {item.product?.price * item.qty}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* 數量控制與刪除 */}
                        <div className="col-md-6">
                          <div className="d-flex align-items-center justify-content-md-end gap-2">
                            <div className="input-group input-group-sm w-auto">
                              <span className="input-group-text admin-input border-gold-dark px-2 text-primary small">數量</span>
                              <input
                                type="number"
                                className="form-control admin-input text-center no-spinners"
                                style={{ width: '60px' }}
                                value={item.qty}
                                min="1"
                                onChange={e => updateOrderQty(cartId, e.target.value)}
                              />
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              onClick={() => deleteProduct(cartId)}
                            >
                              <i className="bi bi-trash3 me-1"></i>
                              刪除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </form>
          </div>

          <div className="modal-footer border-top border-gold-dark bg-glass-dark">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closeEditModal}>
              取消
            </button>
            <button type="button" className="btn btn-dream-submit rounded-pill px-4" onClick={updateOrder}>
              儲存變更
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditOrder
