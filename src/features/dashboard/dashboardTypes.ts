export interface LowStockAlert {
  productId: number;
  productCode: string;
  productName: string;
  minStockLevel: number;
  currentTotalStock: number;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface DashboardState {
  totalStock: number | null;
  stockByZone: ChartData[];
  stockByProduct: ChartData[];
  lowStockAlerts: LowStockAlert[];
  loading: boolean;
  error: string | null;
}
