import type { Meta } from '../../types/api.types';

export type ReceiptStatus = 'EXPECTED' | 'RECEIVING' | 'PUTAWAY_PENDING';

export const TAB_STATUS_MAP: Record<number, ReceiptStatus | undefined> = {
  0: undefined,
  1: 'EXPECTED',
  2: 'RECEIVING',
  3: 'PUTAWAY_PENDING',
};

// --- Receipt detail data ---
export interface InventoryReceiptDetail {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  locationName: string;
  totalPrice: number;
  batchNo: string | null;
  expiryDate: string | null;
  serialNumber: string | null;
}

// --- Receipt data ---
export interface InventoryReceipt {
  id: number;
  receiptCode: string;
  supplierId: number;
  supplierName: string;
  notes: string;
  status: ReceiptStatus;
  createdAt: string;
  createdBy: string;
  totalAmount: number;
  details: InventoryReceiptDetail[];
}

// --- Receipt detail payload ---
export interface ReceiptDetailPayload {
  productId: number;
  locationId?: number;
  quantity: number;
  unitPrice: number;
  batchNo?: string;
  expiryDate?: string;
  serialNumber?: string;
}

// --- Receipt payload ---
export interface InventoryReceiptPayload {
  supplierId: number;
  notes?: string;
  details: ReceiptDetailPayload[];
}

// --- Pagination params ---
export interface FetchReceiptsParams {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

// --- Receipt state ---
export interface ReceiptState {
  receipts: InventoryReceipt[];
  loading: boolean;
  error: string | null;
  meta: Meta | null;

  // Mobile infinite scroll state
  mobilePage: number;
  mobileHasMore: boolean;
  mobileLoading: boolean;
}

export interface CountAndLabelPayload {
  receiptId: number;
  detailId: number;
  countedQuantity: number;
  batchNo?: string;
  serialNumber?: string;
  expiryDate?: string;
}

export interface CountAndLabelResponse {
  lpnCode: string;
  productName: string;
  quantity: number;
  zplCommand: string;
}
