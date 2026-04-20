import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';

export interface ProductGroup {
  id: number;
  groupCode: string;
  groupName: string;
  description?: string;
}

export interface ProductGroupPayload {
  groupCode: string;
  groupName: string;
  description?: string;
}

interface ProductGroupState {
  productGroups: ProductGroup[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductGroupState = {
  productGroups: [],
  loading: false,
  error: null,
};

// Get product groups list
export const fetchProductGroups = createAsyncThunk<ProductGroup[], void, { rejectValue: string }>(
  'productGroups/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<ApiResponse<ProductGroup[]>>('/product-groups');
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || 'Lỗi khi lấy danh sách nhóm sản phẩm!'
        );
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

// Create product group
export const createProductGroup = createAsyncThunk<
  ProductGroup,
  ProductGroupPayload,
  { rejectValue: string }
>('productGroups/create', async (groupData, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<ProductGroup>>(
      '/product-groups',
      groupData
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi tạo nhóm sản phẩm!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

// Update product group
export const updateProductGroup = createAsyncThunk<
  ProductGroup,
  { id: number; data: ProductGroupPayload },
  { rejectValue: string }
>('productGroups/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<ProductGroup>>(
      `/product-groups/${id}`,
      data
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi cập nhật nhóm sản phẩm!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

// Delete product group
export const deleteProductGroup = createAsyncThunk<number, number, { rejectValue: string }>(
  'productGroups/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/product-groups/${id}`);
      return id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi xoá nhóm sản phẩm!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

const productGroupSlice = createSlice({
  name: 'productGroups',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ---
      .addCase(fetchProductGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductGroups.fulfilled, (state, action: PayloadAction<ProductGroup[]>) => {
        state.loading = false;
        state.productGroups = action.payload;
      })
      .addCase(fetchProductGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      })

      // --- CREATE ---
      .addCase(createProductGroup.fulfilled, (state, action: PayloadAction<ProductGroup>) => {
        state.productGroups.push(action.payload);
      })

      // --- UPDATE ---
      .addCase(updateProductGroup.fulfilled, (state, action: PayloadAction<ProductGroup>) => {
        const index = state.productGroups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.productGroups[index] = action.payload;
        }
      })

      // --- DELETE ---
      .addCase(deleteProductGroup.fulfilled, (state, action: PayloadAction<number>) => {
        state.productGroups = state.productGroups.filter((g) => g.id !== action.payload);
      });
  },
});

export const { clearError } = productGroupSlice.actions;
export default productGroupSlice.reducer;
