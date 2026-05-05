import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { CreateUserPayload, FetchUsersParams } from './userTypes';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: FetchUsersParams, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/users', { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng!'
        );
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/users', userData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo người dùng mới!');
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);

export const lockUser = createAsyncThunk(
  'users/lockUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/users/${id}/lock`);
      return { id, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Lỗi khi khoá tài khoản!');
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);

export const unlockUser = createAsyncThunk(
  'users/unlockUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/users/${id}/unlock`);
      return { id, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Lỗi khi mở khóa tài khoản!');
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);
