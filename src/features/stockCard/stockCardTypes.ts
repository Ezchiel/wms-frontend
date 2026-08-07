// Types for the Stock Card (Thẻ Kho) feature — UC16

export type TransactionType = 'RECEIPT' | 'ISSUE' | 'ADJUST';

export interface StockCardProduct {
  id: number;
  productCode: string;
  productName: string;
}

export interface StockCardLocation {
  id: number;
  description: string;
}

export interface InventoryTransaction {
  id: number;
  product: StockCardProduct;
  location: StockCardLocation;
  transactionType: TransactionType;
  referenceCode: string;
  quantity: number;
  createdAt: string; // ISO 8601 LocalDateTime string from backend
}

export interface StockCardState {
  transactions: InventoryTransaction[];
  loading: boolean;
  error: string | null;
}
