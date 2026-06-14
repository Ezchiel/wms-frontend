import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type { PickingTask, ConfirmPickingPayload } from './pickingTypes';

export const fetchMyPickingTasks = createAsyncThunk<
  ApiResponse<PickingTask[]>,
  { status?: string; page?: number; size?: number } | undefined,
  { rejectValue: string }
>('picking/fetchMyTasks', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<PickingTask[]>>('/picking/tasks/my', {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải danh sách nhiệm vụ lấy hàng!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchPickingTaskById = createAsyncThunk<
  PickingTask,
  number,
  { rejectValue: string }
>('picking/fetchById', async (taskId, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<PickingTask>>(`/picking/tasks/${taskId}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải chi tiết nhiệm vụ lấy hàng!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const confirmPickingTask = createAsyncThunk<
  PickingTask,
  ConfirmPickingPayload,
  { rejectValue: string }
>('picking/confirmTask', async ({ taskId, pickedQuantity, note }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<PickingTask>>(
      `/picking/tasks/${taskId}/confirm`,
      { pickedQuantity, note }
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi xác nhận lấy hàng!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const fetchAllPickingTasks = createAsyncThunk<
  ApiResponse<PickingTask[]>,
  { status?: string; page?: number; size?: number } | undefined,
  { rejectValue: string }
>('picking/fetchAllTasks', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<PickingTask[]>>('/picking/tasks', {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi tải danh sách tất cả nhiệm vụ lấy hàng!'
      );
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});
