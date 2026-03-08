import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getCartAsync.fulfilled, (state, action) => {
        // 請確認這裡直接賦值，而非保留舊狀態
        state.carts = action.payload.carts
        state.total = action.payload.total
        state.final_total = action.payload.final_total
        state.loading = false
      })
      .addCase(getCartAsync.rejected, (state) => {
        state.loading = false
      })
  },
})

export const getCartAsync = createAsyncThunk(
  'cart/getCartAsync',
  async () => {
    const res = await axios.get(
      `${API_BASE}/api/${API_PATH}/cart`,
    )

    return res.data.data
  },
)

export default cartSlice.reducer
