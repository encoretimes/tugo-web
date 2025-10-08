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
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div
      className={`${bgColors[toast.type]} flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out animate-slide-in`}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-neutral-900">
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
