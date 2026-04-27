import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';

export interface InventoryReceiptDetail {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  locationName: string;
  totalPrice: number;
  batchNo: string | null;
  expiryDate: string | null;
  serialNumber: string | null;
}

export interface InventoryReceipt {
  id: number;
  receiptCode: string;
  supplierId: number;
  supplierName: string;
  notes: string;
  status: string;
  createdAt: string;
  createdBy: string;
  totalAmount: number;
  details: InventoryReceiptDetail[];
}

export interface ReceiptDetailPayload {
  productId: number;
  locationId?: number;
  quantity: number;
  unitPrice: number;
  batchNo?: string;
  expiryDate?: string;
  serialNumber?: string;
}

export interface InventoryReceiptPayload {
  supplierId: number;
  notes?: string;
  details: ReceiptDetailPayload[];
}

interface ReceiptState {
  receipts: InventoryReceipt[];
  loading: boolean;
  error: string | null;
}

const initialState: ReceiptState = {
  receipts: [],
  loading: false,
  error: null,
};

export const fetchReceipts = createAsyncThunk<InventoryReceipt[], void, { rejectValue: string }>(
  'receipts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<ApiResponse<InventoryReceipt[]>>('/receipts');
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || 'Lỗi khi tải danh sách phiếu nhập kho!'
        );
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

export const createReceipt = createAsyncThunk<
  InventoryReceipt,
  InventoryReceiptPayload,
  { rejectValue: string }
>('receipts/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<InventoryReceipt>>('/receipts', payload);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi tạo phiếu nhập kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const confirmReceipt = createAsyncThunk<InventoryReceipt, number, { rejectValue: string }>(
  'receipts/confirm',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put<ApiResponse<InventoryReceipt>>(
        `/receipts/${id}/confirm`
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi xác nhận phiếu nhập kho!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

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
