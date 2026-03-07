import { useSelector } from 'react-redux'

function MessageToast() {
  const messages = useSelector(state => state.message)

  return (
    // 提高 z-index 確保通知在最上層
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
      {messages.map(message => (
        <div
          key={message.id}
          // 加入 custom-toast-dream 與 slide-in-right 動畫
          className="toast show mb-3 custom-toast-dream shadow-dream slide-in-right"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {/* 側邊發光裝飾條：根據類型變色 */}
          <div className={`toast-glow-bar bg-dream-${message.type}`}></div>

          <div className="toast-header border-0 bg-panel text-white pt-3 px-3">
            {/* 根據類型顯示對應圖示 */}
            <i className={`bi ${message.type === 'success' ? 'bi-check2-circle text-dream-success' : 'bi-exclamation-triangle text-dream-danger'} me-2 fs-5`}></i>

            <strong className="me-auto font-serif text-gold-gradient">
              {message.title}
            </strong>

            <button
              type="button"
              className="btn-close btn-close-white shadow-none"
              aria-label="Close"
            >
            </button>
          </div>

          <div className="toast-body text-white-50 px-3 pb-3 pt-1 small lh-base">
            {message.text}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageToast
