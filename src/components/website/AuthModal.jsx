import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { Lock } from 'lucide-react';
import useAuthStore, { loginRules } from '../../store/authStore';
import useServerFieldErrors from '../../hooks/useServerFieldErrors';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export default function AuthModal({ isOpen, onClose, redirectTo }) {
  const navigate = useNavigate();
  const { login, status, fieldErrors, resetErrors } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      status: state.status,
      fieldErrors: state.fieldErrors,
      resetErrors: state.resetErrors,
    }))
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { username: 'owner', password: '' },
  });

  useServerFieldErrors({ setError, fieldErrors });

  useEffect(() => {
    if (isOpen) {
      reset({ username: 'owner', password: '' });
      resetErrors();
    }
  }, [isOpen, reset, resetErrors]);

  if (!isOpen) return null;

  const isLoading = status === 'loading';

  const fillDemo = () => {
    setValue('username', 'owner');
    setValue('password', 'password');
    clearErrors();
  };

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      onClose();
      reset();
      navigate(redirectTo || '/dashboard');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Authentication Required"
      icon={Lock}
    >
      <p className="text-xs text-slate-600 mb-4">
        Accessing the Owner Operations Workspace.
        Please enter your username and password.
      </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Username" htmlFor="login-username" error={errors.username?.message}>
            <input
              type="text"
              placeholder="e.g. owner"
              {...register('username', loginRules.username)}
              autoComplete="username"
            />
          </FormField>

          <FormField label="Password" htmlFor="login-password" error={errors.password?.message}>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password', loginRules.password)}
            />
          </FormField>

          <button
            type="button"
            onClick={fillDemo}
            disabled={isLoading}
            className="w-full p-3 bg-sky-50 border border-sky-200 rounded text-left text-xs text-slate-600 hover:bg-sky-100 transition-colors disabled:opacity-50"
          >
            Demo credentials - click to autofill:{' '}
            <span className="font-semibold text-sky-700">owner</span> /{' '}
            <span className="font-semibold text-sky-700">password</span>
          </button>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? 'Authenticating…' : 'Authenticate Session'}
            </Button>
          </div>
        </form>
    </Modal>
  );
}