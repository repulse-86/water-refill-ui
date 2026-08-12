import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { Package } from 'lucide-react';
import useServerFieldErrors from '../../../hooks/useServerFieldErrors';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import Button from '../../../components/ui/Button';
import useProductsStore, { productRules, typeLabels } from '../../../store/productsStore';

const emptyForm = {
  name: '',
  type: 'water_refill',
  volume_gallons: '',
  price: '',
  stock_quantity: 0,
  reorder_point: 0,
};

export default function ProductFormModal({ isOpen, onClose, editingId, initialData }) {
  const {
    createProduct,
    updateProduct,
    status,
    fieldErrors,
    message,
    resetErrors,
  } = useProductsStore(
    useShallow((state) => ({
      createProduct: state.createProduct,
      updateProduct: state.updateProduct,
      status: state.status,
      fieldErrors: state.fieldErrors,
      message: state.message,
      resetErrors: state.resetErrors,
    }))
  );

  const [selectedType, setSelectedType] = useState(initialData?.type ?? 'water_refill');

  const {
    register,
    handleSubmit,
    setError,
    setValue,
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

  if (!isOpen) return null;

  const isLoading = status === 'loading';
  const hasFieldError = Boolean(errors.name || errors.type || errors.volume_gallons || errors.price || errors.stock_quantity || errors.reorder_point);

  const onSubmit = async (data) => {
    const result = editingId ? await updateProduct(editingId, data) : await createProduct(data);
    if (result.success) {
      onClose();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Edit Product' : 'Add Product'}
      icon={Package}
    >
      <p className="text-xs text-slate-600 mb-4">
        {editingId ? 'Update the product details below.' : 'Add a new product to your inventory.'}
      </p>

      {message && !hasFieldError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Name" htmlFor="product-name" error={errors.name?.message}>
          <input type="text" placeholder="e.g. Purified Water" {...register('name', productRules.name)} />
        </FormField>

        <FormField label="Type" htmlFor="product-type" error={errors.type?.message}>
          <select
            {...register('type', productRules.type)}
            onChange={(e) => {
              setValue('type', e.target.value);
              setSelectedType(e.target.value);
            }}
          >
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        {selectedType === 'water_refill' && (
          <FormField label="Volume (Gallons)" htmlFor="product-volume" error={errors.volume_gallons?.message}>
            <input type="number" step="0.01" placeholder="e.g. 5" {...register('volume_gallons', productRules.volume_gallons)} />
          </FormField>
        )}

        <FormField label="Price" htmlFor="product-price" error={errors.price?.message}>
          <input type="number" step="0.01" placeholder="e.g. 25.00" {...register('price', productRules.price)} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Stock Quantity" htmlFor="product-stock" error={errors.stock_quantity?.message}>
            <input type="number" {...register('stock_quantity', productRules.stock_quantity)} />
          </FormField>
          <FormField label="Reorder Point" htmlFor="product-reorder" error={errors.reorder_point?.message}>
            <input type="number" {...register('reorder_point', productRules.reorder_point)} />
          </FormField>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Saving…' : editingId ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}