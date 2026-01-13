'use client';

import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Toast as ToastType, useToastStore } from '@/store/toastStore';

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
    error: <XCircleIcon className="h-6 w-6 text-red-600" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-600" />,
    warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />,
  };

  const bgColors = {
    success:
      'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    warning:
      'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
  };

  return (
    <div
      className={`${bgColors[toast.type]} flex items-center gap-3 rounded-md border p-4 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out animate-slide-in`}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
