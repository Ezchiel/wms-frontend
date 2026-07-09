import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';

export interface PutawayTask {
  id: number;
  receiptId: number;
  receiptCode: string;
  lpnCode: string;
  productId: number;
  productName: string;
  quantity: number;
  batchNo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
  assignedTo: string | null;
  suggestedLocationCode: string;
  suggestedLocationId: number;
  targetLocationId: number | null;
  note: string | null;
  putawayAt: string | null;
  createdAt: string;
  unit?: string | null;  // Đơn vị tính của sản phẩm (thùng, chai, cái...)
}

export const fetchPutawayTaskByLpn = createAsyncThunk<
  PutawayTask,
  string,
  { rejectValue: string }
>('putaway/fetchTaskByLpn', async (lpnCode, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<PutawayTask[]>>('/putaway/tasks', {
      params: { page: 1, size: 100 },
    });
    
    // Tìm task PENDING hoặc IN_PROGRESS có lpnCode trùng khớp
    const tasks = response.data.data;
    const task = tasks.find(
      (t) => t.lpnCode === lpnCode && (t.status === 'PENDING' || t.status === 'IN_PROGRESS')
    );

    if (!task) {
      return rejectWithValue('Không tìm thấy nhiệm vụ cất hàng chưa hoàn thành cho mã LPN này!');
    }
    return task;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi tải thông tin nhiệm vụ!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const claimPutawayTask = createAsyncThunk<
  PutawayTask,
  number,
  { rejectValue: string }
>('putaway/claimTask', async (taskId, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<PutawayTask>>(`/putaway/tasks/${taskId}/claim`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Nhận nhiệm vụ thất bại!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const confirmPutawayTask = createAsyncThunk<
  PutawayTask,
  { taskId: number; locationId: number; note?: string },
  { rejectValue: string }
>('putaway/confirmTask', async ({ taskId, locationId, note }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<PutawayTask>>(
      `/putaway/tasks/${taskId}/confirm`,
      { locationId, note }
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Xác nhận cất hàng thất bại!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

