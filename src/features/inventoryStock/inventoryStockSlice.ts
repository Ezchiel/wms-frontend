import { createSlice } from '@reduxjs/toolkit';
import { fetchInventoryStocks, fetchStocksByProduct } from './inventoryStockThunks';
import type { InventoryStockState } from './inventoryStockTypes';

const initialState: InventoryStockState = {
  stocks: [],
  loading: false,
  error: null,
};

const inventoryStockSlice = createSlice({
  name: 'inventoryStocks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchInventoryStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchInventoryStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch By Product
      .addCase(fetchStocksByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocksByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocksByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = inventoryStockSlice.actions;
export default inventoryStockSlice.reducer;
