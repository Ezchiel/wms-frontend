import type { Meta } from '../../types/api.types';
import type { ProductGroup } from '../productGroups/productGroupTypes';

export interface FetchProductsParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  unit: string;
  productGroup: ProductGroup;
  description?: string;
  minStockLevel: number;
  batchNo?: string;
}


export interface ProductPayload {
  productCode: string;
  productName: string;
  unit: string;
  groupId: number;
  description?: string;
  minStockLevel: number;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  meta: Meta | null;
  error: string | null;
}
