import Swal from 'sweetalert2'

const useSwal = () => {
  // 建立共用的樣式設定
  const swalModern = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-danger px-4 py-2 mx-2',
      cancelButton: 'btn btn-secondary px-4 py-2 mx-2',
      popup: 'rounded-4 shadow glass-login-card border border-gold-light',
    },
    buttonsStyling: false,
    reverseButtons: true,
    // 透過 mixin 設定樣式，減少 didOpen 的手寫代碼
    didOpen: (popup) => {
      const title = popup.querySelector('.swal2-title')
      const content = popup.querySelector('.swal2-html-container')
      if (title) title.style.color = '#F2E3B5'
      if (content) content.style.color = '#FFFFFF'
    },
  })

  /**
   * @param {string} title - 標題
   * @param {string} text - 內容文本
   * @param {string} icon - 圖示類型 (warning, info, success, error)
   */
  const confirmDelete = async (title = '確定要執行嗎？', text = '此動作無法復原！', icon = 'warning') => {
    const result = await swalModern.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    })

    return result.isConfirmed
  }

  return { confirmDelete }
}

export default useSwal
