import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse, PaginationMeta } from '../../types/api.types';

export interface FetchLocationsParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  isAvailableOnly?: boolean;
}

export interface StorageLocation {
  id: number;
  zone: string;
  rack: string;
  shelf: string;
  barcode: string;
  description?: string;
  full: boolean;
  pathSequence?: number;
}

export interface StorageLocationPayload {
  zone: string;
  rack: string;
  shelf: string;
  barcode: string;
  description?: string;
  isFull?: boolean;
  pathSequence?: number;
}

interface StorageLocationState {
  storageLocations: StorageLocation[];
  loading: boolean;
  meta: PaginationMeta | null;
  error: string | null;
}

const initialState: StorageLocationState = {
  storageLocations: [],
  loading: false,
  meta: null,
  error: null,
};

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

const storageLocationSlice = createSlice({
  name: 'storageLocations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch locations
      .addCase(fetchStorageLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStorageLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.storageLocations = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchStorageLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Available Locations
      .addCase(fetchAvailableLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.storageLocations = action.payload;
      })
      .addCase(fetchAvailableLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createStorageLocation.fulfilled, (state, action) => {
        state.storageLocations.push(action.payload);
      })

      // Bulk Create
      .addCase(bulkCreateStorageLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateStorageLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.storageLocations.push(...action.payload);
      })
      .addCase(bulkCreateStorageLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
