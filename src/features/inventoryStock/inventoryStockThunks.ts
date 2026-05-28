import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type { InventoryStock } from './inventoryStockTypes';

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

export const fetchStocksByLocation = createAsyncThunk<
  InventoryStock[],
  number,
  { rejectValue: string }
>('inventoryStocks/fetchByLocation', async (locationId, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<InventoryStock[]>>(
      `/inventory-stocks/location/${locationId}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi lấy danh sách tồn kho theo vị trí!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchStocksByLocationAndProduct = createAsyncThunk<
  InventoryStock[],
  { locationId: number; productId: number },
  { rejectValue: string }
>(
  'inventoryStocks/fetchByLocationAndProduct',
  async ({ locationId, productId }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<ApiResponse<InventoryStock[]>>(
        `/inventory-stocks/location/${locationId}/product/${productId}`
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy tồn kho!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);
