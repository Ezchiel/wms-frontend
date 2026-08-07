import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type { InventoryTransaction } from './stockCardTypes';

// Fetch all transactions for a product
export const fetchStockCardByProduct = createAsyncThunk<
  InventoryTransaction[],
  number,
  { rejectValue: string }
>('stockCard/fetchByProduct', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<InventoryTransaction[]>>(
      `/stock-cards/product/${productId}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi lấy lịch sử thẻ kho của sản phẩm!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

// Fetch transactions filtered by product + location
export const fetchStockCardByProductAndLocation = createAsyncThunk<
  InventoryTransaction[],
  { productId: number; locationId: number },
  { rejectValue: string }
>(
  'stockCard/fetchByProductAndLocation',
  async ({ productId, locationId }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<ApiResponse<InventoryTransaction[]>>(
        `/stock-cards/product/${productId}/location/${locationId}`
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || 'Lỗi khi lấy lịch sử thẻ kho theo vị trí!'
        );
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);
