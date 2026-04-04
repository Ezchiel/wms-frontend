import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';

export interface User {
  id?: number;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

interface LoginCredentials {
  username: string;
  password: string;
}

// data returned from API login
interface LoginData {
  token: string;
  username: string;
}

// ApiResponse
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}

export const loginUser = createAsyncThunk<LoginData, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<ApiResponse<LoginData>>(
        '/auth/login',
        userCredentials
      );

      const responseBody = response.data;

      if (responseBody.success) {
        localStorage.setItem('token', responseBody.data.token);

        // return data (username and token) for Redux Store
        return responseBody.data;
      } else {
        return rejectWithValue(responseBody.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Đăng nhập thất bại!');
      }
      return rejectWithValue('Lỗi kết nối đến máy chủ!');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginData>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = { username: action.payload.username };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đã có lỗi xảy ra';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
