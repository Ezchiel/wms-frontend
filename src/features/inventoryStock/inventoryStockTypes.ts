import type { Meta } from '../../types/api.types';

export interface InventoryStock {
  id: number;
  productId: number;
  productName: string;
  locationId: number;
  quantity: number;
  batchNo?: string;
  expiryDate?: string;
  serialNumber?: string;
}

export interface InventoryStockPayload {
  productId: number;
  locationId: number;
  quantity: number;
  batchNo?: string;
  expiryDate?: string;
  serialNumber?: string;
}

export interface InventoryStockState {
  stocks: InventoryStock[];
  loading: boolean;
  meta: Meta | null;
  error: string | null;
}
