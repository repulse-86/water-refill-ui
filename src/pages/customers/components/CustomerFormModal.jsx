import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { User } from 'lucide-react';
import useServerFieldErrors from '../../../hooks/useServerFieldErrors';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import SelectField from '../../../components/ui/SelectField';
import Button from '../../../components/ui/Button';
import useCustomersStore, { customerRules } from '../../../store/customersStore';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  subscriber_status: 'active',
  bottle_debt: 0,
  outstanding_balance: 0,
};

export default function CustomerFormModal({ isOpen, onClose, editingId, initialData }) {
  const {
    createCustomer,
    updateCustomer,
    status,
    fieldErrors,
    resetErrors,
  } = useCustomersStore(
    useShallow((state) => ({
      createCustomer: state.createCustomer,
      updateCustomer: state.updateCustomer,
      status: state.status,
      fieldErrors: state.fieldErrors,
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
  } = useForm({ defaultValues: initialData ?? emptyForm });

  useServerFieldErrors({ setError, fieldErrors });

  useEffect(() => {
    if (isOpen) {
      reset(initialData ?? emptyForm);
      resetErrors();
    }
  }, [isOpen, reset, resetErrors, initialData]);

  if (!isOpen) return null;

  const isLoading = status === 'loading';

  const onSubmit = async (data) => {
    const result = editingId ? await updateCustomer(editingId, data) : await createCustomer(data);
    if (result.success) {
      onClose();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Edit Customer' : 'Add Customer'}
      icon={User}
    >
      <p className="text-xs text-slate-600 mb-4">
        {editingId ? 'Update the customer details below.' : 'Add a new customer to your registry.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Name" htmlFor="customer-name" error={errors.name?.message}>
          <input type="text" placeholder="e.g. Juan Dela Cruz" {...register('name', customerRules.name)} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone" htmlFor="customer-phone" error={errors.phone?.message}>
            <input type="tel" placeholder="e.g. 09171234567" {...register('phone', customerRules.phone)} />
          </FormField>
          <FormField label="Email" htmlFor="customer-email" error={errors.email?.message}>
            <input type="email" placeholder="e.g. juan@example.com" {...register('email', customerRules.email)} />
          </FormField>
        </div>

        <FormField label="Subscriber Status" htmlFor="customer-status" error={errors.subscriber_status?.message}>
          <SelectField
            name="subscriber_status"
            control={control}
            rules={customerRules.subscriber_status}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Bottle Debt" htmlFor="customer-bottle-debt" error={errors.bottle_debt?.message}>
            <input type="number" {...register('bottle_debt', customerRules.bottle_debt)} />
          </FormField>
          <FormField label="Outstanding Balance" htmlFor="customer-outstanding-balance" error={errors.outstanding_balance?.message}>
            <input type="number" step="0.01" {...register('outstanding_balance', customerRules.outstanding_balance)} />
          </FormField>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Saving…' : editingId ? 'Save Changes' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
