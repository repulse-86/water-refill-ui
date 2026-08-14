import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { Wallet } from 'lucide-react';
import useServerFieldErrors from '../../../hooks/useServerFieldErrors';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import Button from '../../../components/ui/Button';
import useCustomersStore from '../../../store/customersStore';

const emptyForm = {
  bottleReturn: 0,
  cashPayment: 0,
};

export default function CustomerSettleModal({ isOpen, onClose, customer, onSettle }) {
  const {
    settleCustomer,
    status,
    fieldErrors,
    resetErrors,
  } = useCustomersStore(
    useShallow((state) => ({
      settleCustomer: state.settleCustomer,
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
    reset,
    formState: { errors },
  } = useForm({ defaultValues: emptyForm });

  useServerFieldErrors({ setError, fieldErrors });

  useEffect(() => {
    if (isOpen) {
      reset(emptyForm);
      resetErrors();
    }
  }, [isOpen, reset, resetErrors]);

  if (!isOpen) return null;

  const isLoading = status === 'loading';

  const onSubmit = async (data) => {
    const result = await settleCustomer(customer.id, data);
    if (result.success) {
      onSettle(result.customer);
      onClose();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settle Ledger"
      icon={Wallet}
    >
      <p className="text-xs text-slate-600 mb-4">
        Record a settlement for <span className="font-semibold">{customer.name}</span>.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <p className="text-xs text-slate-500 mb-1">Bottle Debt</p>
          <p className="text-lg font-bold text-slate-900">{customer.bottle_debt}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
          <p className="text-xs text-slate-500 mb-1">Outstanding Balance</p>
          <p className="text-lg font-bold text-slate-900">PHP {Number(customer.outstanding_balance).toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Bottle Return Count" htmlFor="settle-bottles" error={errors.bottleReturn?.message}>
          <input
            type="number"
            min="0"
            max={customer.bottle_debt}
            placeholder="0"
            {...register('bottleReturn', {
              required: 'The bottle return field is required.',
              min: { value: 0, message: 'The bottle return must be a positive number.' },
              max: { value: customer.bottle_debt, message: `Maximum is ${customer.bottle_debt}.` },
            })}
          />
        </FormField>

        <FormField label="Cash Payment" htmlFor="settle-cash" error={errors.cashPayment?.message}>
          <input
            type="number"
            step="0.01"
            min="0"
            max={customer.outstanding_balance}
            placeholder="0.00"
            {...register('cashPayment', {
              required: 'The cash payment field is required.',
              min: { value: 0, message: 'The cash payment must be a positive number.' },
              max: { value: customer.outstanding_balance, message: `Maximum is PHP ${Number(customer.outstanding_balance).toFixed(2)}.` },
            })}
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Settling…' : 'Settle Ledger'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
