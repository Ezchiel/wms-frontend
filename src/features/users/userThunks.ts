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

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: CreateUserPayload }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/users/${id}`, userData);
      return { id, data: response.data.data, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật tài khoản!');
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`/users/${id}`);
      return { id, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Lỗi khi xoá tài khoản!');
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);

export const restoreUser = createAsyncThunk(
  'users/restoreUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/users/${id}/restore`);
      return { id, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Lỗi khi khôi phục tài khoản!');
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);

export const fetchDeletedUsers = createAsyncThunk(
  'users/fetchDeletedUsers',
  async (params: FetchUsersParams, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/users', {
        params: { ...params, status: 'INACTIVE' },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Lỗi khi lấy danh sách tài khoản đã xoá!'
        );
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định!');
    }
  }
);

