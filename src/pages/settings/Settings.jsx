import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { CheckCircle } from 'lucide-react';
import useSettingsStore from '../../store/settingsStore';
import useServerFieldErrors from '../../hooks/useServerFieldErrors';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';

const settingsRules = {
  store_name: {
    required: 'The store name field is required.',
  },
  currency: {
    required: 'The currency field is required.',
  },
  low_stock_threshold: {
    required: 'The low stock threshold field is required.',
    min: { value: 0, message: 'The low stock threshold must be a positive number.' },
  },
};

export default function Settings() {
  const { settings, status, fieldErrors, message, fetchSettings, updateSettings, resetErrors } =
    useSettingsStore(
      useShallow((state) => ({
        settings: state.settings,
        status: state.status,
        fieldErrors: state.fieldErrors,
        message: state.message,
        fetchSettings: state.fetchSettings,
        updateSettings: state.updateSettings,
        resetErrors: state.resetErrors,
      }))
    );

  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      store_name: '',
      store_address: '',
      store_phone: '',
      currency: 'PHP',
      low_stock_threshold: 10,
    },
  });

  useServerFieldErrors({ setError, fieldErrors });

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  useEffect(() => {
    if (settings) {
      reset({
        store_name: settings.store_name ?? '',
        store_address: settings.store_address ?? '',
        store_phone: settings.store_phone ?? '',
        currency: settings.currency ?? 'PHP',
        low_stock_threshold: settings.low_stock_threshold ?? 10,
      });
    }
  }, [settings, reset]);

  const isLoading = status === 'loading';
  const hasFieldError = Boolean(errors.store_name || errors.currency || errors.low_stock_threshold);

  const onSubmit = async (data) => {
    setSaved(false);
    const result = await updateSettings(data);
    if (result.success) {
      setSaved(true);
      resetErrors();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Store Settings</h1>
      <p className="text-sm text-slate-500 mb-8">
        Configure your store profile and operational defaults.
      </p>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Store Name" htmlFor="settings-store-name" error={errors.store_name?.message}>
            <input
              type="text"
              placeholder="e.g. Aqua Station"
              {...register('store_name', settingsRules.store_name)}
            />
          </FormField>

          <FormField label="Store Address" htmlFor="settings-store-address" error={errors.store_address?.message}>
            <input
              type="text"
              placeholder="Street, Barangay, City"
              {...register('store_address')}
            />
          </FormField>

          <FormField label="Contact Number" htmlFor="settings-store-phone" error={errors.store_phone?.message}>
            <input
              type="text"
              placeholder="e.g. 0917-123-4567"
              {...register('store_phone')}
            />
          </FormField>

          <FormField label="Currency" htmlFor="settings-currency" error={errors.currency?.message}>
            <select {...register('currency', settingsRules.currency)}>
              <option value="PHP">PHP - Philippine Peso</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </FormField>

          <FormField
            label="Low Stock Threshold"
            htmlFor="settings-low-stock"
            error={errors.low_stock_threshold?.message}
          >
            <input
              type="number"
              min="0"
              {...register('low_stock_threshold', settingsRules.low_stock_threshold)}
            />
          </FormField>

          {message && !hasFieldError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {message}
            </div>
          )}

          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Store settings saved.
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? 'Saving…' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}