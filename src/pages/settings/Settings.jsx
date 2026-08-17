import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import useSettingsStore from '../../store/settingsStore';
import useServerFieldErrors from '../../hooks/useServerFieldErrors';
import FormField from '../../components/ui/FormField';
import SelectField from '../../components/ui/SelectField';
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
  const { settings, status, fieldErrors, fetchSettings, updateSettings, resetErrors } =
    useSettingsStore(
      useShallow((state) => ({
        settings: state.settings,
        status: state.status,
        fieldErrors: state.fieldErrors,
        fetchSettings: state.fetchSettings,
        updateSettings: state.updateSettings,
        resetErrors: state.resetErrors,
      }))
    );

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
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

  const onSubmit = async (data) => {
    const result = await updateSettings(data);
    if (result.success) {
      resetErrors();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">Store Settings</h1>
      <p className="text-xs sm:text-sm text-slate-500 mb-8">
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
            <SelectField
              name="currency"
              control={control}
              rules={settingsRules.currency}
              options={[
                { value: 'PHP', label: 'PHP - Philippine Peso' },
                { value: 'USD', label: 'USD - US Dollar' },
              ]}
            />
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