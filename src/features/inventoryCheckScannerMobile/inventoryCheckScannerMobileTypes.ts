export interface Product {
  id: string;
  name: string;
  sku: string;
  systemQty: number;
  physicalQty: number | null;
  checked: boolean;
  lastCheckedAt: string | null;
  note: string | null;
  status: 'matched' | 'mismatched' | 'unchecked' | 'reported';
  imageUrl?: string;
}

export interface ScanHistory {
  id: string;
  sku: string;
  productName: string;
  timestamp: string;
  systemQty: number;
  physicalQty: number;
  status: 'matched' | 'mismatched' | 'reported';
  note: string | null;
  userEmail: string;
}

export interface ScanReport {
  id: string;
  sku: string;
  productName: string;
  timestamp: string;
  qtyDifference: number;
  note: string;
  userEmail: string;
}
