import { createSlice } from '@reduxjs/toolkit';
import {
  confirmReceipt,
  countAndLabel,
  createReceipt,
  fetchReceipts,
  fetchReceiptsMobile,
  claimReceipt,
  scanReceiptImage,
} from './inventoryReceiptThunks';
import type { ReceiptState } from './inventoryReceiptTypes';

const initialState: ReceiptState = {
  receipts: [],
  loading: false,
  error: null,
  meta: null,

  mobilePage: 1,
  mobileHasMore: true,
  mobileLoading: false,

  // OCR state
  ocrLoading: false,
  ocrResult: null,
  ocrError: null,
};

const receiptSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    resetMobileList: (state) => {
      state.receipts = [];
      state.mobilePage = 1;
      state.mobileHasMore = true;
    },
    clearOcrResult: (state) => {
      state.ocrLoading = false;
      state.ocrResult = null;
      state.ocrError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch receipts
      .addCase(fetchReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch receipt mobile
      .addCase(fetchReceiptsMobile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReceiptsMobile.fulfilled, (state, action) => {
        state.loading = false;
        const { data, meta } = action.payload;

        // If it's page 1, overwrite; if it's page > 1, append the data
        if (meta.page === 1) {
          state.receipts = data;
        } else {
          // Filter duplicate
          const newItems = data.filter(
            (newItem) => !state.receipts.some((existingItem) => existingItem.id === newItem.id)
          );
          state.receipts = [...state.receipts, ...newItems];
        }

        state.meta = meta;

        // HasMore logic
        if (meta.page !== undefined && meta.totalPages !== undefined) {
          state.mobileHasMore = meta.page < meta.totalPages;
          state.mobilePage = meta.page;
        }
      })

      // Create receipt
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

      // Confirm receipt
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
      })

      // Count and label
      .addCase(countAndLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(countAndLabel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(countAndLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Claim receipt
      .addCase(claimReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimReceipt.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.receipts.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.receipts[index] = action.payload;
        }
      })
      .addCase(claimReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // OCR scan receipt image
      .addCase(scanReceiptImage.pending, (state) => {
        state.ocrLoading = true;
        state.ocrResult = null;
        state.ocrError = null;
      })
      .addCase(scanReceiptImage.fulfilled, (state, action) => {
        state.ocrLoading = false;
        state.ocrResult = action.payload;
      })
      .addCase(scanReceiptImage.rejected, (state, action) => {
        state.ocrLoading = false;
        state.ocrError = action.payload as string;
      });
  },
});

export default receiptSlice.reducer;
export const { resetMobileList, clearOcrResult } = receiptSlice.actions;
