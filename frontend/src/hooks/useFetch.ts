'use client';

import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth } from './useAuth';
import { handleApiError, isApiError } from '@/utils/api.utils';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T,>(url: string, options?: AxiosRequestConfig) => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const { accessToken } = useAuth();

  const request = useCallback(async (method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
          'Content-Type': 'application/json',
        },
        ...options,
      });
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      setState({ data: null, loading: false, error: apiError.message });
      throw apiError;
    }
  }, [url, accessToken, options]);

  return {
    ...state,
    request,
  };
};
