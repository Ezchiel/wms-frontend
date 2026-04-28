export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: Meta;
}

export interface Meta {
  timestamp: string;
  version: string;
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
}

export interface ThunkError {
  message: string;
}
