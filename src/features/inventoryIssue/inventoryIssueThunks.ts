import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type {
  CreateIssuePayload,
  FetchIssuesParams,
  InventoryIssue,
} from './inventoryIssueTypes';

export const fetchInventoryIssues = createAsyncThunk<
  ApiResponse<InventoryIssue[]>,
  FetchIssuesParams,
  { rejectValue: string }
>('inventoryIssues/fetch', async (params, { rejectWithValue }) => {
  try {
    const { keyword, status, page = 1, size = 10, sortBy = 'id', sortDir = 'desc' } = params;

    const response = await axiosClient.get<ApiResponse<InventoryIssue[]>>('/issues', {
      params: { keyword, status: status || undefined, page, size, sortBy, sortDir },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải danh sách phiếu xuất kho!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchIssueById = createAsyncThunk<
  InventoryIssue,
  number,
  { rejectValue: string }
>('inventoryIssues/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<InventoryIssue>>(`/issues/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải chi tiết phiếu xuất kho!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const createInventoryIssue = createAsyncThunk<
  InventoryIssue,
  CreateIssuePayload,
  { rejectValue: string }
>('inventoryIssues/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<InventoryIssue>>('/issues', payload);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi tạo phiếu xuất kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const approveInventoryIssue = createAsyncThunk<
  InventoryIssue,
  number,
  { rejectValue: string }
>('inventoryIssues/approve', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<InventoryIssue>>(
      `/issues/${id}/approve`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi duyệt phiếu xuất kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const confirmInventoryIssue = createAsyncThunk<
  InventoryIssue,
  number,
  { rejectValue: string }
>('inventoryIssues/confirm', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<InventoryIssue>>(
      `/issues/${id}/confirm`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi xác nhận xuất kho!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const cancelInventoryIssue = createAsyncThunk<
  InventoryIssue,
  number,
  { rejectValue: string }
>('inventoryIssues/cancel', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<InventoryIssue>>(
      `/issues/${id}/cancel`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi huỷ phiếu xuất kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const claimInventoryIssue = createAsyncThunk<
  InventoryIssue,
  number,
  { rejectValue: string }
>('inventoryIssues/claim', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<InventoryIssue>>(
      `/issues/${id}/claim`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi nhận phiếu xuất kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchAvailableIssues = createAsyncThunk<
  ApiResponse<InventoryIssue[]>,
  FetchIssuesParams,
  { rejectValue: string }
>('inventoryIssues/fetchAvailable', async (params, { rejectWithValue }) => {
  try {
    const { keyword, page = 1, size = 10, sortBy = 'id', sortDir = 'desc', fromDate, toDate } = params;

    const response = await axiosClient.get<ApiResponse<InventoryIssue[]>>('/issues/available', {
      params: { keyword, page, size, sortBy, sortDir, fromDate, toDate },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải danh sách phiếu chờ nhận!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
