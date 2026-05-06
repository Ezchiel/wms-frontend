export type ReceiptStatus = 'EXPECTED' | 'RECEIVING' | 'PUTAWAY_PENDING';

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

export interface ReceiptDetailPayload {
  productId: number;
  locationId?: number;
  quantity: number;
  unitPrice: number;
  batchNo?: string;
  expiryDate?: string;
  serialNumber?: string;
}

export interface InventoryReceiptPayload {
  supplierId: number;
  notes?: string;
  details: ReceiptDetailPayload[];
}

export interface ReceiptState {
  receipts: InventoryReceipt[];
  loading: boolean;
  error: string | null;
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
