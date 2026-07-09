import type { Meta } from '../../types/api.types';

export interface FetchLocationsParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  isAvailableOnly?: boolean;
}

export interface StorageLocation {
  id: number;
  zone: string;
  rack: string;
  shelf: string;
  barcode: string;
  description?: string;
  maxCapacity?: number | null;
  currentQuantity: number;
  availableCapacity?: number | null;
  isFull: boolean;
  full: boolean; // Keep for compatibility with existing code
  fillRate: number;
  pathSequence?: number;
  locationType?: string;
  // Sản phẩm đang khóa vị trí (null nếu vị trí trống)
  lockedProductId?: number | null;
  lockedProductName?: string | null;
  unit?: string | null;
}

export interface StorageLocationPayload {
  zone: string;
  rack: string;
  shelf: string;
  barcode: string;
  description?: string;
  maxCapacity?: number | null;
  pathSequence?: number;
}

export interface StorageLocationState {
  storageLocations: StorageLocation[];
  loading: boolean;
  meta: Meta | null;
  error: string | null;
}
