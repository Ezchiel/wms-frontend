import { createSlice } from '@reduxjs/toolkit';
import {
  bulkCreateStorageLocation,
  createStorageLocation,
  deleteStorageLocation,
  fetchAvailableLocations,
  fetchStorageLocations,
  updateStorageLocation,
} from './storageLocationThunks';
import type { StorageLocationState } from './storageLocationTypes';

const initialState: StorageLocationState = {
  storageLocations: [],
  loading: false,
  meta: null,
  error: null,
};

const storageLocationSlice = createSlice({
  name: 'storageLocations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch locations
      .addCase(fetchStorageLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStorageLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.storageLocations = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchStorageLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Available Locations
      .addCase(fetchAvailableLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.storageLocations = action.payload;
      })
      .addCase(fetchAvailableLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createStorageLocation.fulfilled, (state, action) => {
        state.storageLocations.push(action.payload);
      })

      // Bulk Create
      .addCase(bulkCreateStorageLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateStorageLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.storageLocations.push(...action.payload);
      })
      .addCase(bulkCreateStorageLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateStorageLocation.fulfilled, (state, action) => {
        const index = state.storageLocations.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.storageLocations[index] = action.payload;
      })

      // Delete
      .addCase(deleteStorageLocation.fulfilled, (state, action) => {
        state.storageLocations = state.storageLocations.filter((l) => l.id !== action.payload);
      });
  },
});

export default storageLocationSlice.reducer;
