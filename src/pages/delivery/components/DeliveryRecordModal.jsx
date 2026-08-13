import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { Truck } from 'lucide-react';
import useServerFieldErrors from '../../../hooks/useServerFieldErrors';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import Button from '../../../components/ui/Button';
import useFulfillmentStore from '../../../store/fulfillmentStore';
import useCustomersStore from '../../../store/customersStore';

const emptyForm = {
  delivery_status: 'delivered',
  bottles_returned: 0,
  cash_collected: 0,
  notes: '',
};

export default function DeliveryRecordModal({ isOpen, onClose, order }) {
  const {
    recordDelivery,
    status,
    fieldErrors,
    message,
    resetErrors,
  } = useFulfillmentStore(
    useShallow((state) => ({
      recordDelivery: state.recordDelivery,
      status: state.status,
      fieldErrors: state.fieldErrors,
      message: state.message,
      resetErrors: state.resetErrors,
    }))
  );

  const customer = useCustomersStore(
    useShallow((state) => state.customers.find((c) => c.id === order?.customer_id) ?? null)
  );

  const {
    register,
    handleSubmit,
    setError,
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

  if (!isOpen || !order) return null;

  const isLoading = status === 'loading';
  const bottleDebt = customer?.bottle_debt ?? 0;
  const outstandingBalance = customer?.outstanding_balance ?? 0;

  const onSubmit = async (data) => {
    const result = await recordDelivery(order.id, data);
    if (result.success) {
      onClose();
      reset();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Delivery #${order.id}`} icon={Truck}>
      <p className="text-xs text-slate-600 mb-4">
        Record the delivery outcome for <span className="font-semibold">{order.customer_name}</span>.
      </p>

      {message && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Delivery Status" htmlFor="delivery-status" error={errors.delivery_status?.message}>
          <select {...register('delivery_status', { required: 'The delivery status field is required.' })}>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Bottles Returned" htmlFor="delivery-bottles" error={errors.bottles_returned?.message}>
            <input
              type="number"
              min="0"
              max={bottleDebt}
              placeholder="0"
              {...register('bottles_returned', {
                required: 'The bottles returned field is required.',
                min: { value: 0, message: 'Must be a positive number.' },
                max: { value: bottleDebt, message: `Maximum is ${bottleDebt}.` },
                valueAsNumber: true,
              })}
            />
          </FormField>

          <FormField label="Cash Collected" htmlFor="delivery-cash" error={errors.cash_collected?.message}>
            <input
              type="number"
              step="0.01"
              min="0"
              max={outstandingBalance}
              placeholder="0.00"
              {...register('cash_collected', {
                required: 'The cash collected field is required.',
                min: { value: 0, message: 'Must be a positive number.' },
                max: { value: outstandingBalance, message: `Maximum is PHP ${Number(outstandingBalance).toFixed(2)}.` },
                valueAsNumber: true,
              })}
            />
          </FormField>
        </div>

        <FormField label="Notes" htmlFor="delivery-notes" error={errors.notes?.message}>
          <textarea
            placeholder="Delivery notes…"
            {...register('notes')}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Saving…' : 'Record Delivery'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
