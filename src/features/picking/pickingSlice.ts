import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PickingState, PickingTask } from './pickingTypes';
import {
  fetchMyPickingTasks,
  fetchPickingTaskById,
  confirmPickingTask,
} from './pickingThunks';

const initialState: PickingState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  actionLoading: false,
  error: null,
  meta: null,
};

const pickingSlice = createSlice({
  name: 'picking',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<PickingTask | null>) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    clearPickingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyPickingTasks
      .addCase(fetchMyPickingTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPickingTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMyPickingTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchPickingTaskById
      .addCase(fetchPickingTaskById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchPickingTaskById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchPickingTaskById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // confirmPickingTask
      .addCase(confirmPickingTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(confirmPickingTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update task in tasks list if it exists
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        // If the confirmed task is the currently selected one, update it as well
        if (state.selectedTask && state.selectedTask.id === updatedTask.id) {
          state.selectedTask = updatedTask;
        }
      })
      .addCase(confirmPickingTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTask, clearSelectedTask, clearPickingError } =
  pickingSlice.actions;

export default pickingSlice.reducer;
