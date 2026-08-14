import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { Gauge } from 'lucide-react';
import useServerFieldErrors from '../../../hooks/useServerFieldErrors';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import useMeterReadingsStore, { meterReadingRules } from '../../../store/meterReadingsStore';
import useOrdersStore from '../../../store/ordersStore';
import useProductsStore from '../../../store/productsStore';
import { formatDate } from '../../../utils/date';
import { computeExpectedVolume, getPreviousReading, isFlagged } from '../../../domain/meterReading';

const emptyForm = {
  reading_date: '',
  meter_value: '',
  notes: '',
};

function formatValue(value) {
  if (value == null) return '—';
  return `${Number(value).toFixed(2)} gal`;
}

export default function MeterReadingModal({ isOpen, onClose, editingId, initialData }) {
  const {
    createReading,
    updateReading,
    status,
    fieldErrors,
    message,
    resetErrors,
  } = useMeterReadingsStore(
    useShallow((state) => ({
      createReading: state.createReading,
      updateReading: state.updateReading,
      status: state.status,
      fieldErrors: state.fieldErrors,
      message: state.message,
      resetErrors: state.resetErrors,
    }))
  );

  const readings = useMeterReadingsStore((state) => state.readings);

  const orders = useOrdersStore((state) => state.orders);
  const ordersStatus = useOrdersStore((state) => state.status);
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);

  const products = useProductsStore((state) => state.products);
  const productsStatus = useProductsStore((state) => state.status);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialData ?? emptyForm });

  useServerFieldErrors({ setError, fieldErrors });

  useEffect(() => {
    if (isOpen) {
      reset(initialData ?? emptyForm);
      resetErrors();
    }
  }, [isOpen, reset, resetErrors, initialData]);

  useEffect(() => {
    if (isOpen && orders.length === 0 && ordersStatus === 'idle') {
      fetchOrders();
    }
  }, [isOpen, orders.length, ordersStatus, fetchOrders]);

  useEffect(() => {
    if (isOpen && products.length === 0 && productsStatus === 'idle') {
      fetchProducts();
    }
  }, [isOpen, products.length, productsStatus, fetchProducts]);

  const date = watch('reading_date');
  const meterValue = watch('meter_value');

  const preview = useMemo(() => {
    const meterNum =
      meterValue === '' || meterValue == null || Number.isNaN(Number(meterValue))
        ? null
        : Number(meterValue);
    const previous = getPreviousReading(readings, date);
    const expectedVolume = computeExpectedVolume(orders, products, date);
    const actualThroughput =
      previous && meterNum != null ? Number((meterNum - Number(previous.meter_value)).toFixed(2)) : null;
    const variance =
      actualThroughput == null ? null : Number((actualThroughput - expectedVolume).toFixed(2));
    const variancePct =
      actualThroughput != null && expectedVolume > 0
        ? Number(((variance / expectedVolume) * 100).toFixed(1))
        : null;
    const flagged = isFlagged({ expectedVolume, actualThroughput, variance });
    return { previous, expectedVolume, actualThroughput, variance, variancePct, flagged };
  }, [date, meterValue, readings, orders, products]);

  if (!isOpen) return null;

  const isLoading = status === 'loading';
  const hasFieldError = Boolean(errors.reading_date || errors.meter_value);

  const onSubmit = async (data) => {
    const result = editingId ? await updateReading(editingId, data) : await createReading(data);
    if (result.success) {
      onClose();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Edit Meter Reading' : 'Record Meter Reading'}
      icon={Gauge}
    >
      <p className="text-xs text-slate-600 mb-4">
        {editingId
          ? 'Update the meter reading details below.'
          : 'Log the cumulative meter value at the end of the shift.'}
      </p>

      {message && !hasFieldError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Reading Date" htmlFor="reading-date" error={errors.reading_date?.message}>
            <input type="date" {...register('reading_date', meterReadingRules.reading_date)} />
          </FormField>

          <FormField label="Meter Value (gal)" htmlFor="meter-value" error={errors.meter_value?.message}>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 120.50"
              {...register('meter_value', meterReadingRules.meter_value)}
            />
          </FormField>
        </div>

        <FormField label="Notes" htmlFor="reading-notes" error={errors.notes?.message}>
          <textarea
            placeholder="Shift notes…"
            {...register('notes')}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </FormField>

        <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Previous reading</span>
            <span className="font-medium text-slate-700">
              {preview.previous ? `${formatValue(preview.previous.meter_value)} (${formatDate(preview.previous.reading_date)})` : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Expected volume</span>
            <span className="font-medium text-slate-700">{formatValue(preview.expectedVolume)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Computed throughput</span>
            <span className="font-medium text-slate-700">{formatValue(preview.actualThroughput)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Variance</span>
            <span className={`font-medium ${preview.flagged ? 'text-red-600' : 'text-slate-700'}`}>
              {formatValue(preview.variance)}
              {preview.variancePct != null ? ` (${preview.variancePct}%)` : ''}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500">Audit status</span>
            {preview.actualThroughput == null ? (
              <Badge variant="slate">No Data</Badge>
            ) : preview.flagged ? (
              <Badge variant="red">Flagged</Badge>
            ) : (
              <Badge variant="green">OK</Badge>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Saving…' : editingId ? 'Save Changes' : 'Record Reading'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
