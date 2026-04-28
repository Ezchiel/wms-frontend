import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse, Meta } from '../../types/api.types';
import type { ProductGroup } from './productGroupSlice';

export interface FetchProductsParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  unit: string;
  productGroup: ProductGroup;
  description?: string;
  minStockLevel: number;
}

export interface ProductPayload {
  productCode: string;
  productName: string;
  unit: string;
  groupId: number;
  description?: string;
  minStockLevel: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  meta: Meta | null;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  meta: null,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  ApiResponse<Product[]>,
  FetchProductsParams,
  { rejectValue: string }
>('products/fetchAll', async (params: FetchProductsParams = {}, { rejectWithValue }) => {
  try {
    const { keyword, page = 1, size = 10, sortBy = 'id', sortDir = 'asc' } = params;

    const response = await axiosClient.get<ApiResponse<Product[]>>('/products', {
      params: { keyword, page, size, sortBy, sortDir },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy danh sách sản phẩm!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const createProduct = createAsyncThunk<Product, ProductPayload, { rejectValue: string }>(
  'products/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<ApiResponse<Product>>('/products', payload);
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi tạo sản phẩm!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; data: ProductPayload },
  { rejectValue: string }
>('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi cập nhật sản phẩm!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const deleteProduct = createAsyncThunk<number, number, { rejectValue: string }>(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/products/${id}`);
      return id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi xoá sản phẩm!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH ---
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- CREATE ---
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // --- UPDATE ---
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- DELETE ---
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
