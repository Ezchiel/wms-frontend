import type { Meta } from '../../types/api.types';

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

export interface PartnerState {
  partners: Partner[];
  loading: boolean;
  meta: Meta | null;
  error: string | null;
}
