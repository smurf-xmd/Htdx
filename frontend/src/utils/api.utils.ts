import { API_BASE_URL, HTTP_STATUS } from '@/constants/api.constants';
import { ApiResponse } from '@/types/api.types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(status, data.code || 'UNKNOWN_ERROR', data.error || 'An error occurred');
  }
  if (error.message) {
    return new ApiError(500, 'NETWORK_ERROR', error.message);
  }
  return new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred');
};

export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
