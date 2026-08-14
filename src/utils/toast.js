import toast from 'react-hot-toast';

export function toastSuccess(message) {
  toast.success(message);
}

export function toastError(message, hasFieldErrors = false) {
  if (hasFieldErrors) return;
  toast.error(message);
}