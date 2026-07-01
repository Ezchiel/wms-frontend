import { createSlice } from '@reduxjs/toolkit';
import { confirmPutawayTask, fetchPutawayTaskByLpn, claimPutawayTask, type PutawayTask } from './putawayThunks';

export interface PutawayState {
  activeTask: PutawayTask | null;
  loading: boolean;
  confirming: boolean;
  error: string | null;
}

const initialState: PutawayState = {
  activeTask: null,
  loading: false,
  confirming: false,
  error: null,
};

const putawaySlice = createSlice({
  name: 'putaway',
  initialState,
  reducers: {
    clearActiveTask: (state) => {
      state.activeTask = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch task by LPN
      .addCase(fetchPutawayTaskByLpn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.activeTask = null;
      })
      .addCase(fetchPutawayTaskByLpn.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTask = action.payload;
      })
      .addCase(fetchPutawayTaskByLpn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Claim Putaway Task
      .addCase(claimPutawayTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimPutawayTask.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTask = action.payload;
      })
      .addCase(claimPutawayTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Confirm Putaway Task
      .addCase(confirmPutawayTask.pending, (state) => {
        state.confirming = true;
        state.error = null;
      })
      .addCase(confirmPutawayTask.fulfilled, (state) => {
        state.confirming = false;
        state.activeTask = null;
      })
      .addCase(confirmPutawayTask.rejected, (state, action) => {
        state.confirming = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearActiveTask, clearError } = putawaySlice.actions;
export default putawaySlice.reducer;

