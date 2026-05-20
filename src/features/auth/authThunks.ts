import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type { LoginCredentials, LoginData } from './authTypes';

export const loginUser = createAsyncThunk<
  ApiResponse<LoginData>,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (userCredentials, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ApiResponse<LoginData>>('/auth/login', userCredentials);

    const responseBody = response.data;

    if (responseBody.success) {
      localStorage.setItem('token', responseBody.data.token);
      localStorage.setItem('username', responseBody.data.username);
      localStorage.setItem('role', responseBody.data.role);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Đăng nhập thất bại!');
    }
    return rejectWithValue('Lỗi kết nối đến máy chủ!');
  }
});
