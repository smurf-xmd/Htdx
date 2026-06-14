export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
