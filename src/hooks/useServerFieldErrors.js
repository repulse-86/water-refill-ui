import { useEffect } from 'react';

export default function useServerFieldErrors({ setError, clearErrors, fieldErrors }) {
  useEffect(() => {
    if (!fieldErrors) return;
    Object.entries(fieldErrors).forEach(([name, message]) => {
      setError(name, { type: 'server', message });
    });
  }, [fieldErrors, setError, clearErrors]);
}