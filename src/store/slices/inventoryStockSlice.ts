import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';

export interface InventoryStock {
  id: number;
  productId: number;
  productName: string;
  locationId: number;
  quantity: number;
  batchNo?: string;
  expiryDate?: string;
  serialNumber?: string;
}

export interface InventoryStockPayload {
  productId: number;
  locationId: number;
  quantity: number;
  batchNo?: string;
  expiryDate?: string;
  serialNumber?: string;
}

interface InventoryStockState {
  stocks: InventoryStock[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryStockState = {
  stocks: [],
  loading: false,
  error: null,
};

export const fetchInventoryStocks = createAsyncThunk<
  InventoryStock[],
  void,
  { rejectValue: string }
>('inventoryStocks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<InventoryStock[]>>('/inventory-stocks');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy danh sách tồn kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchStocksByProduct = createAsyncThunk<
  InventoryStock[],
  number,
  { rejectValue: string }
>('inventoryStocks/fetchByProduct', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<InventoryStock[]>>(
      `/inventory-stocks/product/${productId}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi lấy danh sách tồn kho theo sản phẩm!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

const inventoryStockSlice = createSlice({
  name: 'inventoryStocks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchInventoryStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchInventoryStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch By Product
      .addCase(fetchStocksByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocksByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocksByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = inventoryStockSlice.actions;
export default inventoryStockSlice.reducer;
