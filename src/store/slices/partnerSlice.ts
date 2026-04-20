import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';

export type PartnerType = 'SUPPLIER' | 'CUSTOMER' | 'OTHER';

export interface Partner {
  id: number;
  name: string;
  type: PartnerType;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
}

export interface PartnerPayload {
  name: string;
  type: PartnerType;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
}

interface PartnerState {
  partners: Partner[];
  loading: boolean;
  error: string | null;
}

const initialState: PartnerState = {
  partners: [],
  loading: false,
  error: null,
};

export const fetchPartners = createAsyncThunk<Partner[], void, { rejectValue: string }>(
  'partners/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<ApiResponse<Partner[]>>('/partners');
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy danh sách đối tác!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

export const createPartner = createAsyncThunk<Partner, PartnerPayload, { rejectValue: string }>(
  'partners/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<ApiResponse<Partner>>('/partners', payload);
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi tạo đối tác!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

export const updatePartner = createAsyncThunk<
  Partner,
  { id: number; data: PartnerPayload },
  { rejectValue: string }
>('partners/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put<ApiResponse<Partner>>(`/partners/${id}`, data);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi cập nhật đối tác!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

export const deletePartner = createAsyncThunk<number, number, { rejectValue: string }>(
  'partners/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/partners/${id}`);
      return id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Lỗi khi xoá đối tác!');
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối!');
    }
  }
);

const partnerSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Partners
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Partner
      .addCase(createPartner.fulfilled, (state, action) => {
        state.partners.push(action.payload);
      })
      // Update Partner
      .addCase(updatePartner.fulfilled, (state, action) => {
        const index = state.partners.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.partners[index] = action.payload;
      })
      // Delete Partner
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.partners = state.partners.filter((p) => p.id !== action.payload);
      });
  },
});

export default partnerSlice.reducer;
