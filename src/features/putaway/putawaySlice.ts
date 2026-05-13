import { createSlice } from '@reduxjs/toolkit';
import { confirmPutaway, fetchPutawaySuggestion } from './putawayThunks';

export interface PutawayState {
  suggestion: {
    lpnCode: string;
    productName: string;
    suggestedLocationCode: string;
    suggestedLocationId: number;
  } | null;
  loading: boolean;
  confirming: boolean;
  error: string | null;
}

const initialState: PutawayState = {
  suggestion: null,
  loading: false,
  confirming: false,
  error: null,
};

const putawaySlice = createSlice({
  name: 'putaway',
  initialState,
  reducers: {
    clearSuggestion: (state) => {
      state.suggestion = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPutawaySuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.suggestion = null;
      })
      .addCase(fetchPutawaySuggestion.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestion = action.payload;
      })
      .addCase(fetchPutawaySuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmPutaway.pending, (state) => {
        state.confirming = true;
        state.error = null;
      })
      .addCase(confirmPutaway.fulfilled, (state) => {
        state.confirming = false;
        state.suggestion = null;
      })
      .addCase(confirmPutaway.rejected, (state, action) => {
        state.confirming = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSuggestion, clearError } = putawaySlice.actions;
export default putawaySlice.reducer;
