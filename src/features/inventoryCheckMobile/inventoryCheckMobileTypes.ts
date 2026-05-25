export interface Product {
  id: string;
  sku: string;
  name: string;
  unit: string;
  category: string;
  locationId: number;
  batchNo: string;
  expectedQty: number;
  image: string;
}

export interface StockTakeItem {
  productId: string;
  sku: string;
  name: string;
  unit: string;
  zone: string;
  rack: string;
  shelf: string;
  expectedQty: number;
  actualQty: number | null;
  notes?: string;
}

export interface StockTakeSheet {
  id: string;
  code: string;
  createdAt: string;
  completedAt: string | null;
  type: 'position' | 'product' | 'all';
  status: 'pending' | 'in_progress' | 'completed';
  zone: string | null;
  rack: string | null;
  selectedProductId: string | null;
  notes: string;
  items: StockTakeItem[];
  createdBy: string;
}
