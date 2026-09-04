import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { Package, X } from 'lucide-react';
import useServerFieldErrors from '../../../hooks/useServerFieldErrors';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import SelectField from '../../../components/ui/SelectField';
import Button from '../../../components/ui/Button';
import useProductsStore, { productRules, typeLabels } from '../../../store/productsStore';
import { toastError } from '../../../utils/toast';

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
    resetErrors,
  } = useProductsStore(
    useShallow((state) => ({
      createProduct: state.createProduct,
      updateProduct: state.updateProduct,
      status: state.status,
      fieldErrors: state.fieldErrors,
      resetErrors: state.resetErrors,
    }))
  );

  const [selectedType, setSelectedType] = useState(initialData?.type ?? 'water_refill');
  const [imagePreview, setImagePreview] = useState(initialData?.image ?? '');

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toastError('Image must be smaller than 500KB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview('');
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      image: imagePreview || null,
    };
    const result = editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
    if (result.success) {
      onClose();
      reset();
      setImagePreview('');
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Name" htmlFor="product-name" error={errors.name?.message}>
          <input type="text" placeholder="e.g. Purified Water" {...register('name', productRules.name)} />
        </FormField>

        <FormField label="Type" htmlFor="product-type" error={errors.type?.message}>
          <SelectField
            name="type"
            control={control}
            rules={productRules.type}
            onChange={setSelectedType}
            options={Object.entries(typeLabels).map(([value, label]) => ({ value, label }))}
          />
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Product Image</label>
          <div className="flex items-center gap-3">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
            <div>
              <input
                type="file"
                id="product-image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="product-image"
                className="cursor-pointer inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                {imagePreview ? 'Change Image' : 'Add Image'}
              </label>
              <p className="mt-1 text-xs text-slate-400">PNG, JPG up to 500KB</p>
            </div>
          </div>
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