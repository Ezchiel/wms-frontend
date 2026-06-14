import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStockTrend,
  fetchStockByGroup,
  fetchLocationUtilization,
  fetchInventoryMovement,
  fetchExpiringStock,
} from './reportsThunks';
import type { ReportsState } from './reportsTypes';

const initialState: ReportsState = {
  stockTrend: [],
  stockByGroup: [],
  locationUtilization: [],
  inventoryMovement: [],
  expiringStock: [],
  loading: {
    stockTrend: false,
    stockByGroup: false,
    locationUtilization: false,
    inventoryMovement: false,
    expiringStock: false,
  },
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStockTrend
      .addCase(fetchStockTrend.pending, (state) => {
        state.loading.stockTrend = true;
        state.error = null;
      })
      .addCase(fetchStockTrend.fulfilled, (state, action) => {
        state.loading.stockTrend = false;
        state.stockTrend = action.payload;
      })
      .addCase(fetchStockTrend.rejected, (state, action) => {
        state.loading.stockTrend = false;
        state.error = action.payload as string;
      })

      // fetchStockByGroup
      .addCase(fetchStockByGroup.pending, (state) => {
        state.loading.stockByGroup = true;
        state.error = null;
      })
      .addCase(fetchStockByGroup.fulfilled, (state, action) => {
        state.loading.stockByGroup = false;
        state.stockByGroup = action.payload;
      })
      .addCase(fetchStockByGroup.rejected, (state, action) => {
        state.loading.stockByGroup = false;
        state.error = action.payload as string;
      })

      // fetchLocationUtilization
      .addCase(fetchLocationUtilization.pending, (state) => {
        state.loading.locationUtilization = true;
        state.error = null;
      })
      .addCase(fetchLocationUtilization.fulfilled, (state, action) => {
        state.loading.locationUtilization = false;
        state.locationUtilization = action.payload;
      })
      .addCase(fetchLocationUtilization.rejected, (state, action) => {
        state.loading.locationUtilization = false;
        state.error = action.payload as string;
      })

      // fetchInventoryMovement
      .addCase(fetchInventoryMovement.pending, (state) => {
        state.loading.inventoryMovement = true;
        state.error = null;
      })
      .addCase(fetchInventoryMovement.fulfilled, (state, action) => {
        state.loading.inventoryMovement = false;
        state.inventoryMovement = action.payload;
      })
      .addCase(fetchInventoryMovement.rejected, (state, action) => {
        state.loading.inventoryMovement = false;
        state.error = action.payload as string;
      })

      // fetchExpiringStock
      .addCase(fetchExpiringStock.pending, (state) => {
        state.loading.expiringStock = true;
        state.error = null;
      })
      .addCase(fetchExpiringStock.fulfilled, (state, action) => {
        state.loading.expiringStock = false;
        state.expiringStock = action.payload;
      })
      .addCase(fetchExpiringStock.rejected, (state, action) => {
        state.loading.expiringStock = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
