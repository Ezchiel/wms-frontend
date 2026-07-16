import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type { NotificationSummary } from './notificationTypes';

export const fetchNotifications = createAsyncThunk<
  NotificationSummary[],
  void,
  { rejectValue: string }
>('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<NotificationSummary[]>>('/notifications');
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy danh sách thông báo!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
