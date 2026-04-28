import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse, Meta } from '../../types/api.types';

export type PartnerType = 'SUPPLIER' | 'CUSTOMER';

export interface FetchPartnersParams {
  keyword?: string;
  type?: PartnerType;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

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
  meta: Meta | null;
  error: string | null;
}

const initialState: PartnerState = {
  partners: [],
  loading: false,
  meta: null,
  error: null,
};

export const fetchPartners = createAsyncThunk<
  ApiResponse<Partner[]>,
  FetchPartnersParams,
  { rejectValue: string }
>('partners/fetch', async (params: FetchPartnersParams, { rejectWithValue }) => {
  try {
    const { keyword, type, page = 1, size = 10, sortBy = 'id', sortDir = 'asc' } = params;

    const response = await axiosClient.get<ApiResponse<Partner[]>>('/partners', {
      params: { keyword, type, page, size, sortBy, sortDir },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data?.message || 'Lỗi khi lấy danh sách đối tác!');
    }
    return rejectWithValue('Đã xảy ra lỗi kết nối!');
  }
});

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
