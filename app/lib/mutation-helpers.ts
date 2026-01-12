import { useToastStore } from '@/store/toastStore';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const createErrorHandler = (defaultMessage: string) => {
  return (error: Error) => {
    const addToast = useToastStore.getState().addToast;
    addToast(error.message || defaultMessage, 'error');
  };
};

export const createSuccessHandler = (message: string, type: ToastType = 'success') => {
  return () => {
    const addToast = useToastStore.getState().addToast;
    addToast(message, type);
  };
};

export const showToast = (message: string, type: ToastType = 'info') => {
  const addToast = useToastStore.getState().addToast;
  addToast(message, type);
};
