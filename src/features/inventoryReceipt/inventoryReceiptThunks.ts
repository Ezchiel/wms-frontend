import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type {
  CountAndLabelPayload,
  CountAndLabelResponse,
  InventoryReceipt,
  InventoryReceiptPayload,
} from './inventoryReceiptTypes';

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

export const countAndLabel = createAsyncThunk<
  CountAndLabelResponse,
  CountAndLabelPayload,
  { rejectValue: string }
>('receipts/countAndLabel', async (payload, { rejectWithValue }) => {
  try {
    // Tách receiptId và detailId ra khỏi payload để dùng cho URL
    const { receiptId, detailId, ...requestBody } = payload;

    const response = await axiosClient.post<ApiResponse<CountAndLabelResponse>>(
      `/receipts/${receiptId}/details/${detailId}/count-and-label`,
      requestBody
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi kiểm đếm và tạo lệnh in tem!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
