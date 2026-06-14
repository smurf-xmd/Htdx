'use client';

import React from 'react';
import { Toast as ToastType } from '@/types/common.types';
import { useUiStore } from '@/store/uiStore';

const Toast: React.FC<ToastType> = ({ id, type, message }) => {
  const { removeToast } = useUiStore();
  const [isVisible, setIsVisible] = React.useState(true);

  const typeStyles = {
    success: 'bg-success/20 text-success border-success/30',
    error: 'bg-error/20 text-error border-error/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    info: 'bg-primary/20 text-primary border-primary/30',
  };

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ⓘ',
  };

  return (
    <div
      className={`mb-3 p-4 rounded-lg border backdrop-blur-xl ${typeStyles[type]} animate-in fade-in slide-in-from-top-4 transition-all duration-300`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold mt-0.5">{iconMap[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            removeToast(id);
          }}
          className="text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useUiStore();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
