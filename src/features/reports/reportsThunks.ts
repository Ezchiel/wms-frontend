import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type {
  StockTrendPoint,
  StockByGroup,
  LocationUtilization,
  InventoryMovement,
  ExpiringStock,
  FetchStockTrendParams,
  FetchInventoryMovementParams,
} from './reportsTypes';

export const fetchStockTrend = createAsyncThunk<
  StockTrendPoint[],
  FetchStockTrendParams,
  { rejectValue: string }
>('reports/fetchStockTrend', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<StockTrendPoint[]>>('/reports/stock-trend', {
      params,
    });
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy xu hướng tồn kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchStockByGroup = createAsyncThunk<
  StockByGroup[],
  void,
  { rejectValue: string }
>('reports/fetchStockByGroup', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<StockByGroup[]>>('/reports/stock-by-group');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy tồn kho theo nhóm sản phẩm!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchLocationUtilization = createAsyncThunk<
  LocationUtilization[],
  void,
  { rejectValue: string }
>('reports/fetchLocationUtilization', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<LocationUtilization[]>>('/reports/location-utilization');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy tỷ lệ sử dụng kệ!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchInventoryMovement = createAsyncThunk<
  InventoryMovement[],
  FetchInventoryMovementParams,
  { rejectValue: string }
>('reports/fetchInventoryMovement', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<InventoryMovement[]>>('/reports/inventory-movement', {
      params,
    });
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy biến động tồn kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchExpiringStock = createAsyncThunk<
  ExpiringStock[],
  { withinDays: number },
  { rejectValue: string }
>('reports/fetchExpiringStock', async ({ withinDays }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<ExpiringStock[]>>('/reports/expiring-stock', {
      params: { withinDays },
    });
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy lô hàng sắp hết hạn!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
