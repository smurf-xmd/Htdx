'use client';

import { useUiStore } from '@/store/uiStore';
import { ToastType } from '@/types/common.types';

export const useNotification = () => {
  const { addToast } = useUiStore();

  const notify = (message: string, type: ToastType = 'info', duration = 3000) => {
    addToast({ message, type, duration });
  };

  return {
    success: (message: string, duration?: number) => notify(message, 'success', duration),
    error: (message: string, duration?: number) => notify(message, 'error', duration),
    warning: (message: string, duration?: number) => notify(message, 'warning', duration),
    info: (message: string, duration?: number) => notify(message, 'info', duration),
  };
};
