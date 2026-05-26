import { createSlice } from '@reduxjs/toolkit';
import type { InventoryCheckState } from './inventoryCheckTypes';
import {
  fetchInventoryChecks,
  createInventoryCheck,
  confirmInventoryCheck,
} from './inventoryCheckThunks';

const initialState: InventoryCheckState = {
  checks: [],
  selectedCheck: null,
  loading: false,
  actionLoading: false,
  error: null,
  meta: null,
};

const inventoryCheckSlice = createSlice({
  name: 'inventoryCheck',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCheck: (state, action) => {
      state.selectedCheck = action.payload;
    },
    clearSelectedCheck: (state) => {
      state.selectedCheck = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchInventoryChecks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryChecks.fulfilled, (state, action) => {
        state.loading = false;
        state.checks = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchInventoryChecks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      })

      // Create
      .addCase(createInventoryCheck.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createInventoryCheck.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.checks = [action.payload.data, ...state.checks];
      })
      .addCase(createInventoryCheck.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || 'Lỗi không xác định';
      })

      // Confirm
      .addCase(confirmInventoryCheck.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(confirmInventoryCheck.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload.data;
        state.checks = state.checks.map((c) => (c.id === updated.id ? updated : c));
        if (state.selectedCheck?.id === updated.id) {
          state.selectedCheck = updated;
        }
      })
      .addCase(confirmInventoryCheck.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export const { clearError, setSelectedCheck, clearSelectedCheck } = inventoryCheckSlice.actions;
export default inventoryCheckSlice.reducer;
