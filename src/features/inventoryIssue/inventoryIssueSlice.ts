import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  approveInventoryIssue,
  cancelInventoryIssue,
  claimInventoryIssue,
  createInventoryIssue,
  fetchAvailableIssues,
  fetchInventoryIssues,
  fetchIssueById,
} from './inventoryIssueThunks';
import type { InventoryIssue, InventoryIssueState } from './inventoryIssueTypes';

const initialState: InventoryIssueState = {
  issues: [],
  selectedIssue: null,
  loading: false,
  actionLoading: false,
  error: null,
  meta: null,
};

const inventoryIssueSlice = createSlice({
  name: 'inventoryIssues',
  initialState,
  reducers: {
    setSelectedIssue: (state, action: PayloadAction<InventoryIssue | null>) => {
      state.selectedIssue = action.payload;
    },
    clearSelectedIssue: (state) => {
      state.selectedIssue = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch list ───────────────────────────────────────────────────────
      .addCase(fetchInventoryIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchInventoryIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Fetch by id ─────────────────────────────────────────────────────
      .addCase(fetchIssueById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedIssue = action.payload;
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ─── Create ───────────────────────────────────────────────────────────
      .addCase(createInventoryIssue.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createInventoryIssue.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.issues.unshift(action.payload);
      })
      .addCase(createInventoryIssue.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ─── Approve ─────────────────────────────────────────────────────────
      .addCase(approveInventoryIssue.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(approveInventoryIssue.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedIssue = action.payload;
        const idx = state.issues.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.issues[idx] = action.payload;
      })
      .addCase(approveInventoryIssue.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ─── Claim ───────────────────────────────────────────────────────────
      .addCase(claimInventoryIssue.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(claimInventoryIssue.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedIssue = action.payload;
        state.issues = state.issues.filter((i) => i.id !== action.payload.id);
      })
      .addCase(claimInventoryIssue.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // ─── Fetch Available ─────────────────────────────────────────────────
      .addCase(fetchAvailableIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAvailableIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Cancel ──────────────────────────────────────────────────────────
      .addCase(cancelInventoryIssue.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelInventoryIssue.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedIssue = action.payload;
        const idx = state.issues.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.issues[idx] = action.payload;
      })
      .addCase(cancelInventoryIssue.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedIssue, clearSelectedIssue, clearError } =
  inventoryIssueSlice.actions;
export default inventoryIssueSlice.reducer;
