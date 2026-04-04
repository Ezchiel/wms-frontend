import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';

export interface User {
  id: number;
  username: string;
  fullName?: string;
  roleName: string;
  email: string;
  createdAt?: string;
  status: string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface CreateUserPayload {
  username: string;
  password?: string;
  fullName: string;
  role: string;
  email: string;
  phone?: string;
  status?: string;
}

interface UserState {
  users: User[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  meta: null,
  loading: false,
  error: null,
};

// Params for API get list users
export interface FetchUsersParams {
  keyword?: string;
  status?: string;
  role?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

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

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
