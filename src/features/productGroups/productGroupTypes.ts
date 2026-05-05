import type { Meta } from '../../types/api.types';

export interface ProductGroup {
  id: number;
  groupCode: string;
  groupName: string;
  description?: string;
}

export interface ProductGroupPayload {
  groupCode: string;
  groupName: string;
  description?: string;
}

export interface FetchProductGroupsParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface ProductGroupState {
  productGroups: ProductGroup[];
  loading: boolean;
  meta: Meta | null;
  error: string | null;
}
