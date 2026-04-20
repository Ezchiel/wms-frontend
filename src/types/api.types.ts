export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    version: string;
    // Bạn có thể gộp luôn PaginationMeta vào đây nếu API phân trang trả về cùng cục meta này
    page?: number;
    size?: number;
    totalPages?: number;
    totalElements?: number;
  };
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}
