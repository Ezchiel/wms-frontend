import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createProductGroup,
  deleteProductGroup,
  fetchAllProductGroups,
  fetchProductGroups,
  updateProductGroup,
} from './productGroupThunks';
import type { ProductGroup, ProductGroupState } from './productGroupTypes';

const initialState: ProductGroupState = {
  productGroups: [],
  loading: false,
  meta: null,
  error: null,
};

const productGroupSlice = createSlice({
  name: 'productGroups',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ---
      .addCase(fetchProductGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.productGroups = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProductGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Lỗi không xác định';
      })

      // --- FETCH ALL ---
      .addCase(fetchAllProductGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.productGroups = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAllProductGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Lỗi không xác định';
      })

      // --- CREATE ---
      .addCase(createProductGroup.fulfilled, (state, action) => {
        state.productGroups.push(action.payload.data);
      })
      .addCase(createProductGroup.rejected, (state, action) => {
        state.error = action.payload?.message || 'Lỗi không xác định';
      })

      // --- UPDATE ---
      .addCase(updateProductGroup.fulfilled, (state, action: PayloadAction<ProductGroup>) => {
        const index = state.productGroups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.productGroups[index] = action.payload;
        }
      })

      // --- DELETE ---
      .addCase(deleteProductGroup.fulfilled, (state, action: PayloadAction<number>) => {
        state.productGroups = state.productGroups.filter((g) => g.id !== action.payload);
      });
  },
});

export const { clearError } = productGroupSlice.actions;
export default productGroupSlice.reducer;
