export type CheckStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface CheckDetail {
  id: number;
  productId: number;
  productName: string;
  locationId: number;
  locationBarcode: string;
  batchNo: string;
  systemQuantity: number;
  actualQuantity: number;
  variance: number;
  reason: string;
}

export interface InventoryCheck {
  id: number;
  checkCode: string;
  checkDate: string;
  status: CheckStatus;
  notes: string;
  createdBy: string;
  details: CheckDetail[];
}

export interface CreateCheckDetailPayload {
  productId: number;
  locationId: number;
  batchNo: string;
  actualQuantity: number;
  reason: string;
}

export interface CreateCheckPayload {
  notes: string;
  details: CreateCheckDetailPayload[];
}

export interface InventoryCheckState {
  checks: InventoryCheck[];
  selectedCheck: InventoryCheck | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

export interface InventoryCheckFilters {
  keyword: string;
  status: CheckStatus | '';
  page: number;
  size: number;
  sortBy: string;
  sortDir: string;
}
