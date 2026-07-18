import type { Meta } from '../../types/api.types';

export type ReceiptStatus = 'DRAFT' | 'EXPECTED' | 'RECEIVING' | 'PUTAWAY_PENDING' | 'COMPLETED' | 'CANCELLED';

export const TAB_STATUS_MAP: Record<number, ReceiptStatus | undefined> = {
  0: undefined,
  1: 'EXPECTED',
  2: 'RECEIVING',
  3: 'PUTAWAY_PENDING',
};

// --- Receipt detail data ---
export interface InventoryReceiptDetail {
  id: number;
  productId: number | null;
  productName: string | null;
  productCode: string | null;
  productNameRaw: string | null; // Tên OCR thô khi product chưa được khớp (DRAFT)
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
  assignedTo: string | null;
  totalAmount: number;
  details: InventoryReceiptDetail[];
  scannedBy?: string;
  scannedAt?: string;
}

// --- Receipt detail payload ---
export interface ReceiptDetailPayload {
  productId: number;
  productNameRaw?: string; // Tên OCR thô – gửi lên khi productId = 0 (chưa khớp)
  locationId?: number;
  quantity: number;
  unitPrice: number;
  batchNo?: string;
  expiryDate?: string | null;
  serialNumber?: string;
}

// --- Receipt payload ---
export interface InventoryReceiptPayload {
  supplierId: number;
  notes?: string;
  details: ReceiptDetailPayload[];
}

export interface FetchReceiptsParams {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  assignedFilter?: 'ME' | 'UNASSIGNED';
  fromDate?: string;
  toDate?: string;
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

  // OCR state
  ocrLoading: boolean;
  ocrResult: OcrReceiptResult | null;
  ocrError: string | null;
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

// --- OCR Types ---
export interface OcrReceiptItemResult {
  productNameRaw: string;
  productCodeRaw: string | null;
  quantity: number | null;
  unitPrice: number | null;
  batchNo: string | null;
  expiryDate: string | null;
  serialNumber: string | null;
  matchedProductId: number | null;
  matchedProductName: string | null;
  matchedProductCode: string | null;
  productMatchConfidence: number; // 0.0 – 1.0
}

export interface OcrReceiptResult {
  supplierNameRaw: string | null;
  matchedPartnerId: number | null;
  matchedPartnerName: string | null;
  partnerMatchConfidence: number;
  notes: string | null;
  items: OcrReceiptItemResult[];
  overallConfidence: number;
  warningMessage: string | null;
  rawModelText: string | null;
}

export interface OcrScanRequest {
  imageBase64: string;
  mimeType: string;
}
