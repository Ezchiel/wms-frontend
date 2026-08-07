import { createSlice } from '@reduxjs/toolkit';
import { fetchStockCardByProduct, fetchStockCardByProductAndLocation } from './stockCardThunks';
import type { StockCardState } from './stockCardTypes';

const initialState: StockCardState = {
  transactions: [],
  loading: false,
  error: null,
};

const stockCardSlice = createSlice({
  name: 'stockCard',
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.transactions = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by product
      .addCase(fetchStockCardByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockCardByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchStockCardByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by product + location
      .addCase(fetchStockCardByProductAndLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockCardByProductAndLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchStockCardByProductAndLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTransactions, clearError } = stockCardSlice.actions;
export default stockCardSlice.reducer;
