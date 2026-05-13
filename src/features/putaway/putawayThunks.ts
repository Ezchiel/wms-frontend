import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';

export interface PutawaySuggestion {
  lpnCode: string;
  productName: string;
  suggestedLocationCode: string;
  suggestedLocationId: number;
}

export const fetchPutawaySuggestion = createAsyncThunk<
  PutawaySuggestion,
  string,
  { rejectValue: string }
>('putaway/fetchSuggestion', async (lpnCode, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<PutawaySuggestion>>(
      `/putaway/suggest/${lpnCode}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Không tìm thấy thông tin LPN!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const confirmPutaway = createAsyncThunk<
  void,
  { lpnCode: string; locationId: number },
  { rejectValue: string }
>('putaway/confirm', async (payload, { rejectWithValue }) => {
  try {
    await axiosClient.post('/putaway/confirm', payload);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Xác nhận cất hàng thất bại!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
