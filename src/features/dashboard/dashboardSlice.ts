import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTotalStock,
  fetchStockByZone,
  fetchStockByProduct,
  fetchLowStockAlerts,
} from './dashboardThunks';
import type { DashboardState } from './dashboardTypes';

const initialState: DashboardState = {
  totalStock: null,
  stockByZone: [],
  stockByProduct: [],
  lowStockAlerts: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTotalStock
      .addCase(fetchTotalStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalStock.fulfilled, (state, action) => {
        state.totalStock = action.payload;
        state.loading = false;
      })
      .addCase(fetchTotalStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchStockByZone
      .addCase(fetchStockByZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockByZone.fulfilled, (state, action) => {
        state.stockByZone = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockByZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchStockByProduct
      .addCase(fetchStockByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockByProduct.fulfilled, (state, action) => {
        state.stockByProduct = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchLowStockAlerts
      .addCase(fetchLowStockAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowStockAlerts.fulfilled, (state, action) => {
        state.lowStockAlerts = action.payload;
        state.loading = false;
      })
      .addCase(fetchLowStockAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
