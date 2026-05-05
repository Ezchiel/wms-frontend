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
  full: boolean;
  pathSequence?: number;
}

export interface StorageLocationPayload {
  zone: string;
  rack: string;
  shelf: string;
  barcode: string;
  description?: string;
  isFull?: boolean;
  pathSequence?: number;
}

export interface StorageLocationState {
  storageLocations: StorageLocation[];
  loading: boolean;
  meta: Meta | null;
  error: string | null;
}
