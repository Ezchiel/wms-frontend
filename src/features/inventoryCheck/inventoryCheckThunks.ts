import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type {
  InventoryCheck,
  InventoryCheckFilters,
  CreateCheckPayload,
} from './inventoryCheckTypes';

export const fetchInventoryChecks = createAsyncThunk<
  ApiResponse<InventoryCheck[]>,
  Partial<InventoryCheckFilters>,
  { rejectValue: string }
>('inventoryCheck/fetchAll', async (filters, { rejectWithValue }) => {
  try {
    const params: Record<string, any> = {
      page: filters.page ?? 1,
      size: filters.size ?? 10,
      sortBy: filters.sortBy ?? 'id',
      sortDir: filters.sortDir ?? 'desc',
    };
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.status) params.status = filters.status;
    if (filters.createdByMe !== undefined) params.createdByMe = filters.createdByMe;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;

    const response = await axiosClient.get<ApiResponse<InventoryCheck[]>>('/checks', { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lấy danh sách kiểm kê thất bại');
    }
    return rejectWithValue('Lỗi kết nối đến máy chủ');
  }
});

export const createInventoryCheck = createAsyncThunk<
  ApiResponse<InventoryCheck>,
  CreateCheckPayload,
  { rejectValue: string }
>('inventoryCheck/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<InventoryCheck>>('/checks', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Tạo phiếu kiểm kê thất bại');
    }
    return rejectWithValue('Lỗi kết nối đến máy chủ');
  }
});

export const confirmInventoryCheck = createAsyncThunk<
  ApiResponse<InventoryCheck>,
  number,
  { rejectValue: string }
>('inventoryCheck/confirm', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<InventoryCheck>>(`/checks/${id}/confirm`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Xác nhận phiếu kiểm kê thất bại');
    }
    return rejectWithValue('Lỗi kết nối đến máy chủ');
  }
});

export const downloadCheckPdf = async (id: number): Promise<void> => {
  const response = await axiosClient.get(`/checks/${id}/pdf`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bien-ban-kiem-ke-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

