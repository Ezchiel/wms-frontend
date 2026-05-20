import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './authThunks';
import type { AuthState, UserRole } from './authTypes';

const initialState: AuthState = {
  user: localStorage.getItem('token')
    ? {
        username: localStorage.getItem('username') || '',
        role: (localStorage.getItem('role') as UserRole) || 'USER',
      }
    : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.user = { username: action.payload.data.username, role: action.payload.data.role };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Đã có lỗi xảy ra';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
