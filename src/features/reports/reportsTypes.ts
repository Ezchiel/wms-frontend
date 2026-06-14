export interface StockTrendPoint {
  period: string;
  totalQuantity: number;
}

export interface StockByGroup {
  groupId: number;
  groupCode: string;
  groupName: string;
  totalQuantity: number;
  totalValue: number;
}

export interface LocationUtilization {
  zone: string;
  totalLocations: number;
  fullLocations: number;
  emptyLocations: number;
  utilizationRate: number;
}

export interface InventoryMovement {
  productId: number;
  productCode: string;
  productName: string;
  openingStock: number;
  totalReceipt: number;
  totalIssue: number;
  totalAdjust: number;
  closingStock: number;
}

export interface ExpiringStock {
  stockId: number;
  productId: number;
  productCode: string;
  productName: string;
  locationId: number;
  locationBarcode: string;
  batchNo: string;
  expiryDate: string;
  daysRemaining: number;
  quantity: number;
}

export interface ReportsState {
  stockTrend: StockTrendPoint[];
  stockByGroup: StockByGroup[];
  locationUtilization: LocationUtilization[];
  inventoryMovement: InventoryMovement[];
  expiringStock: ExpiringStock[];
  loading: {
    stockTrend: boolean;
    stockByGroup: boolean;
    locationUtilization: boolean;
    inventoryMovement: boolean;
    expiringStock: boolean;
  };
  error: string | null;
}

export interface FetchStockTrendParams {
  from: string;
  to: string;
  groupBy: 'day' | 'week' | 'month';
  productId?: number;
}

export interface FetchInventoryMovementParams {
  from: string;
  to: string;
  productId?: number;
  groupId?: number;
}
