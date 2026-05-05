import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse, ThunkError } from '../../types/api.types';
import type {
  FetchProductGroupsParams,
  ProductGroup,
  ProductGroupPayload,
} from './productGroupTypes';

// Fetch product groups
export const fetchProductGroups = createAsyncThunk<
  ApiResponse<ProductGroup[]>,
  FetchProductGroupsParams,
  { rejectValue: string }
>('productGroups/fetch', async (params: FetchProductGroupsParams = {}, { rejectWithValue }) => {
  try {
    const { keyword, page = 1, size = 10, sortBy = 'id', sortDir = 'asc' } = params;

    const response = await axiosClient.get('/product-groups', {
      params: { keyword, page, size, sortBy, sortDir },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi lấy danh sách nhóm sản phẩm!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

// Fetch all product groups
export const fetchAllProductGroups = createAsyncThunk<
  ApiResponse<ProductGroup[]>,
  void,
  { rejectValue: string }
>('productGroups/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<ProductGroup[]>>('/product-groups/all');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi lấy danh sách tất cả nhóm sản phẩm!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

// Create product group
export const createProductGroup = createAsyncThunk<
  ApiResponse<ProductGroup>,
  ProductGroupPayload,
  { rejectValue: ThunkError }
>('productGroups/create', async (groupData, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<ProductGroup>>(
      '/product-groups',
      groupData
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue({
        message: error.response.data?.message || 'Lỗi khi tạo nhóm sản phẩm!',
      });
    }
    return rejectWithValue({ message: 'Đã xảy ra lỗi kết nối!' });
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
