import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUsers,
  lockUser,
  unlockUser,
  fetchDeletedUsers,
  deleteUser,
  updateUser,
  restoreUser,
} from './userThunks';
import type { UserState } from './userTypes';

const initialState: UserState = {
  users: [],
  meta: null,
  deletedUsers: [],
  deletedMeta: null,
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

      // Fetch deleted users
      .addCase(fetchDeletedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeletedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedUsers = action.payload.data;
        state.deletedMeta = action.payload.meta;
      })
      .addCase(fetchDeletedUsers.rejected, (state, action) => {
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
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Restore user
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.deletedUsers = state.deletedUsers.filter((u) => u.id !== action.payload.id);
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
