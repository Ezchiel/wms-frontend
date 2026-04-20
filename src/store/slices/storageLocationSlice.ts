import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';

export interface StorageLocation {
  id: number;
  zone: string;
  rack: string;
  shelf: string;
  barcode: string;
  description?: string;
  isFull: boolean;
}

export interface StorageLocationPayload {
  zone: string;
  rack: string;
  shelf: string;
  barcode: string;
  description?: string;
  isFull?: boolean;
}

interface StorageLocationState {
  storageLocations: StorageLocation[];
  loading: boolean;
  error: string | null;
}

const initialState: StorageLocationState = {
  storageLocations: [],
  loading: false,
  error: null,
};

export const fetchStorageLocations = createAsyncThunk<
  StorageLocation[],
  void,
  { rejectValue: string }
>('storageLocations/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<StorageLocation[]>>('/locations');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy danh sách vị trí kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchLocationByBarcode = createAsyncThunk<
  StorageLocation,
  string,
  { rejectValue: string }
>('storageLocations/fetchByBarcode', async (barcode, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<StorageLocation>>(
      `/locations/barcode/${barcode}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy vị trí theo barcode!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

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

const storageLocationSlice = createSlice({
  name: 'storageLocations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchStorageLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStorageLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.storageLocations = action.payload;
      })
      .addCase(fetchStorageLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createStorageLocation.fulfilled, (state, action) => {
        state.storageLocations.push(action.payload);
      })

      // Update
      .addCase(updateStorageLocation.fulfilled, (state, action) => {
        const index = state.storageLocations.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.storageLocations[index] = action.payload;
      })

      // Delete
      .addCase(deleteStorageLocation.fulfilled, (state, action) => {
        state.storageLocations = state.storageLocations.filter((l) => l.id !== action.payload);
      });
  },
});

export default storageLocationSlice.reducer;
