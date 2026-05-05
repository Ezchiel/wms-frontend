import { createSlice } from '@reduxjs/toolkit';
import { confirmReceipt, createReceipt, fetchReceipts } from './inventoryReceiptThunks';
import type { ReceiptState } from './inventoryReceiptTypes';

const initialState: ReceiptState = {
  receipts: [],
  loading: false,
  error: null,
};

const receiptSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FetchReceipts
      .addCase(fetchReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload;
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CreateReceipt
      .addCase(createReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts.unshift(action.payload);
      })
      .addCase(createReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ConfirmReceipt
      .addCase(confirmReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmReceipt.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.receipts.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.receipts[index] = action.payload;
        }
      })
      .addCase(confirmReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default receiptSlice.reducer;
