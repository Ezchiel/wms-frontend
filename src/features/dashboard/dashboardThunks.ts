import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type { ChartData, LowStockAlert } from './dashboardTypes';

export const fetchTotalStock = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>('dashboard/fetchTotalStock', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<number>>('/dashboard/summary/total-stock');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy tổng tồn kho!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchStockByZone = createAsyncThunk<
  ChartData[],
  void,
  { rejectValue: string }
>('dashboard/fetchStockByZone', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<ChartData[]>>('/dashboard/charts/stock-by-zone');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy tồn kho theo zone!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchStockByProduct = createAsyncThunk<
  ChartData[],
  void,
  { rejectValue: string }
>('dashboard/fetchStockByProduct', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<ChartData[]>>('/dashboard/charts/stock-by-product');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy tồn kho theo sản phẩm!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchLowStockAlerts = createAsyncThunk<
  LowStockAlert[],
  void,
  { rejectValue: string }
>('dashboard/fetchLowStockAlerts', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<LowStockAlert[]>>('/dashboard/alerts/low-stock');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy cảnh báo tồn kho thấp!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
