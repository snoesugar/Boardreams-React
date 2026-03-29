# 🃏 Boardreams - 沉浸式桌遊電商平台

Boardreams 是一個以「產品化思維」打造的桌遊展示與購物平台。透過金黑高對比的遊戲化視覺設計，打破傳統電商的制式感，致力於連結線上購物體驗與線下社交溫度。

🔗 **[點此線上預覽成品](https://snoesugar.github.io/Boardreams-React/)**

---

## 🎯 開發動機與核心價值

在數位化時代，桌遊是少數能讓人在現實生活中產生真實連結的媒介。然而，多數桌遊電商網站設計過於生硬，無法傳遞遊戲本身的氛圍。
* **核心重點**：透過遊戲化的 UI/UX 設計（如遊戲選單般的登入介面），從使用者進入網站起就建立沉浸感。
* **目標**：利用流暢的數位流程，鼓勵使用者參與實體桌遊活動，強化人際互動。

---

## 🛠️ 技術重點與解決方案

本專案由我獨立負責從零到一的前端架構開發，針對電商平台常見的效能與資料一致性問題，提出了以下解決方案：

### 1. 全端資料串接與管理 (API Integration)
* 使用 **RESTful API** 實作動態產品清單渲染。
* 開發完整的**購物車系統**，包含加入、修改數量、刪除及結帳流程。
* 實作**後台管理系統**，包含產品上架、訂單接收與優惠券發送功能。

### 2. 高效能元件與 Hooks 封裝
* **元件化設計**：將 Toast 與 Modal 高度封裝，提升代碼複用性。
* **自定義 Hooks**：建立 `useMessage` 等自定義 Hook，統一管理全站反饋訊息。
* **SweetAlert2 整合**：針對重要操作（如刪除項目）強化視覺警示，防止使用者誤觸。

### 3. 狀態管理與路由規劃
* **Redux Toolkit (RTK)**：處理跨頁面的資料傳遞，確保購物車數量、使用者訊息在跳轉頁面時維持即時同步。
* **React Router**：建構 SPA 路由，並實作路由保護（如進入後台須經過驗證）。

### 4. 互動驗證與品質控管
* **React Hook Form**：處理複雜的結帳與登入表單，實作即時驗證機制，提升填寫正確率。
* **ESLint 規範**：嚴格執行代碼檢查，確保專案架構易於維護並攔截潛在邏輯錯誤。

---

## 🚀 技術棧 (Tech Stack)

* **Framework:** React 18
* **Build Tool:** Vite
* **State Management:** Redux Toolkit
* **Form Logic:** React Hook Form
* **Styling:** SCSS (7-1 Pattern), Bootstrap 5
* **Utility Libraries:** Axios, SweetAlert2, Swiper, AOS
* **Code Quality:** ESLint
