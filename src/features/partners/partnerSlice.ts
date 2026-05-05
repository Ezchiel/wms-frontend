import { createSlice } from '@reduxjs/toolkit';
import {
  createPartner,
  deletePartner,
  fetchAllPartners,
  fetchPartners,
  updatePartner,
} from './partnerThunks';
import type { PartnerState } from './partnerTypes';

const initialState: PartnerState = {
  partners: [],
  loading: false,
  meta: null,
  error: null,
};

const partnerSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH ---
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- FETCH ALL ---
      .addCase(fetchAllPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload.data;
      })
      .addCase(fetchAllPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- CREATE ---
      .addCase(createPartner.fulfilled, (state, action) => {
        state.partners.push(action.payload);
      })

      // --- UPDATE ---
      .addCase(updatePartner.fulfilled, (state, action) => {
        const index = state.partners.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.partners[index] = action.payload;
      })

      // --- DELETE ---
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.partners = state.partners.filter((p) => p.id !== action.payload);
      });
  },
});

export default partnerSlice.reducer;
