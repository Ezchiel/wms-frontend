import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type {
  FetchLocationsParams,
  StorageLocation,
  StorageLocationPayload,
} from './storageLocationTypes';

export const fetchStorageLocations = createAsyncThunk(
  'storageLocations/fetchStorageLocations',
  async (params: FetchLocationsParams = {}, { rejectWithValue }) => {
    try {
      const {
        keyword,
        page = 1,
        size = 10,
        sortBy = 'id',
        sortDir = 'asc',
        isAvailableOnly = false,
      } = params;

      const endpoint = isAvailableOnly ? '/locations/available' : '/locations';
      const response = await axiosClient.get(endpoint, {
        params: { keyword, page, size, sortBy, sortDir },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy danh sách vị trí kho!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

export const createStorageLocation = createAsyncThunk<
  StorageLocation,
  StorageLocationPayload,
  { rejectValue: string }
>('storageLocations/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<StorageLocation>>('/locations', payload);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi tạo vị trí kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const bulkCreateStorageLocation = createAsyncThunk<
  StorageLocation[],
  StorageLocationPayload[],
  { rejectValue: string }
>('storageLocations/bulkCreate', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<StorageLocation[]>>(
      '/locations/bulk',
      payload
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi import danh sách vị trí kho!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const updateStorageLocation = createAsyncThunk<
  StorageLocation,
  { id: number; data: StorageLocationPayload },
  { rejectValue: string }
>('storageLocations/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<StorageLocation>>(`/locations/${id}`, data);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi cập nhật vị trí kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const deleteStorageLocation = createAsyncThunk<number, number, { rejectValue: string }>(
  'storageLocations/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/locations/${id}`);
      return id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi xoá vị trí kho!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

export const fetchAvailableLocations = createAsyncThunk<
  StorageLocation[],
  void,
  { rejectValue: string }
>('storageLocations/fetchAvailable', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<StorageLocation[]>>('/locations/available');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi lấy danh sách vị trí còn trống!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
