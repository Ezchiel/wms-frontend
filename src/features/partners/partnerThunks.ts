import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import type { ApiResponse } from '../../types/api.types';
import type { FetchPartnersParams, Partner, PartnerPayload } from './partnerTypes';

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

export const fetchAllPartners = createAsyncThunk<
  ApiResponse<Partner[]>,
  void,
  { rejectValue: string }
>('partners/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get<ApiResponse<Partner[]>>('/partners/all');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.message || 'Lỗi khi lấy danh sách tất cả đối tác!'
      );
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
