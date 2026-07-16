import { createSlice } from '@reduxjs/toolkit';
import { fetchNotifications } from './notificationThunks';
import type { NotificationState } from './notificationTypes';

const initialState: NotificationState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationsState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đã có lỗi xảy ra';
      });
  },
});

export const { clearNotificationsState } = notificationSlice.actions;
export default notificationSlice.reducer;
