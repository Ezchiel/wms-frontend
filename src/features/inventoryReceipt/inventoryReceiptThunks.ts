import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type {
  CountAndLabelPayload,
  CountAndLabelResponse,
  FetchReceiptsParams,
  InventoryReceipt,
  InventoryReceiptPayload,
  OcrReceiptResult,
  OcrScanRequest,
} from './inventoryReceiptTypes';

export const fetchReceipts = createAsyncThunk<
  ApiResponse<InventoryReceipt[]>,
  FetchReceiptsParams,
  { rejectValue: string }
>('receipts/fetch', async (params: FetchReceiptsParams, { rejectWithValue }) => {
  try {
    const { keyword, status, page = 1, size = 10, sortBy = 'id', sortDir = 'asc' } = params;

    const response = await axiosClient.get<ApiResponse<InventoryReceipt[]>>('/receipts', {
      params: { keyword, status, page, size, sortBy, sortDir },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải danh sách phiếu nhập kho!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchReceiptsMobile = createAsyncThunk<
  ApiResponse<InventoryReceipt[]>,
  FetchReceiptsParams,
  { rejectValue: string }
>('receipts/fetchMobile', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<InventoryReceipt[]>>('/receipts', {
      params,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải danh sách phiếu nhập kho!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

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

export const claimReceipt = createAsyncThunk<
  InventoryReceipt,
  number,
  { rejectValue: string }
>('receipts/claim', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<InventoryReceipt>>(`/receipts/${id}/claim`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Nhận phiếu kiểm đếm thất bại!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const scanReceiptImage = createAsyncThunk<
  OcrReceiptResult,
  OcrScanRequest,
  { rejectValue: string }
>('receipts/ocrScan', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<OcrReceiptResult>>(
      '/receipts/ocr-scan',
      payload
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi phân tích ảnh phiếu nhập kho!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const createDraftReceipt = createAsyncThunk<
  InventoryReceipt,
  InventoryReceiptPayload,
  { rejectValue: string }
>('receipts/createDraft', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<InventoryReceipt>>('/receipts/draft', payload);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi tạo phiếu nháp!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const approveDraftReceipt = createAsyncThunk<
  InventoryReceipt,
  { id: number; payload: InventoryReceiptPayload },
  { rejectValue: string }
>('receipts/approveDraft', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<InventoryReceipt>>(
      `/receipts/draft/${id}/approve`,
      payload
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi duyệt phiếu nháp!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const downloadReceiptPdf = async (id: number): Promise<void> => {
  const response = await axiosClient.get(`/receipts/${id}/pdf`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `phieu-nhap-kho-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

