import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, lockUser, unlockUser } from './userThunks';
import type { UserState } from './userTypes';

const initialState: UserState = {
  users: [],
  meta: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
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
      })

      // Lock user
      .addCase(lockUser.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload.id);
        if (user) {
          user.status = 'LOCKED';
        }
      })
      .addCase(lockUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Unlock user
      .addCase(unlockUser.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload.id);
        if (user) user.status = 'ACTIVE';
      })
      .addCase(unlockUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
