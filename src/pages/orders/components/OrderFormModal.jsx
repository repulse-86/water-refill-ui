import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { ShoppingCart } from 'lucide-react';
import useServerFieldErrors from '../../../hooks/useServerFieldErrors';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import SelectField from '../../../components/ui/SelectField';
import Button from '../../../components/ui/Button';
import useOrdersStore, { orderRules } from '../../../store/ordersStore';
import useCustomersStore from '../../../store/customersStore';
import useProductsStore from '../../../store/productsStore';

const emptyForm = {
  customer_id: '',
  order_type: 'walk_in',
  payment_method: 'cash',
  total_amount: 0,
  amount_paid: 0,
  delivery_fee: 0,
  notes: '',
  items: [{ product_id: '', quantity: 1 }],
};

export default function OrderFormModal({ isOpen, onClose, editingId, initialData }) {
  const {
    createOrder,
    updateOrder,
    status,
    fieldErrors,
    resetErrors,
  } = useOrdersStore(
    useShallow((state) => ({
      createOrder: state.createOrder,
      updateOrder: state.updateOrder,
      status: state.status,
      fieldErrors: state.fieldErrors,
      resetErrors: state.resetErrors,
    }))
  );

  const customers = useCustomersStore((state) => state.customers);
  const products = useProductsStore((state) => state.products);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: initialData ?? emptyForm });

  useServerFieldErrors({ setError, fieldErrors });

  const watchedItems = watch('items');

  useEffect(() => {
    if (isOpen) {
      const formData = initialData ?? emptyForm;
      reset(formData);
      resetErrors();
    }
  }, [isOpen, reset, resetErrors, initialData]);

  if (!isOpen) return null;

  const isLoading = status === 'loading';

  const addItem = () => {
    setValue('items', [...watchedItems, { product_id: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = watchedItems.filter((_, i) => i !== index);
    setValue('items', newItems.length > 0 ? newItems : [{ product_id: '', quantity: 1 }]);
  };

  const onSubmit = async (data) => {
    const result = editingId ? await updateOrder(editingId, data) : await createOrder(data);
    if (result.success) {
      onClose();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Edit Order' : 'Add Order'}
      icon={ShoppingCart}
    >
      <p className="text-xs text-slate-600 mb-4">
        {editingId ? 'Update the order details below.' : 'Create a new order.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Customer" htmlFor="order-customer" error={errors.customer_id?.message}>
            <SelectField
              name="customer_id"
              control={control}
              rules={orderRules.customer_id}
              placeholder="Select customer"
              options={customers.map((c) => ({ value: c.id, label: c.name }))}
            />
          </FormField>

          <FormField label="Order Type" htmlFor="order-type" error={errors.order_type?.message}>
            <SelectField
              name="order_type"
              control={control}
              rules={orderRules.order_type}
              placeholder="Select type"
              options={[
                { value: 'walk_in', label: 'Walk-In' },
                { value: 'delivery', label: 'Delivery' },
              ]}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Payment Method" htmlFor="order-payment" error={errors.payment_method?.message}>
            <SelectField
              name="payment_method"
              control={control}
              rules={orderRules.payment_method}
              placeholder="Select payment"
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'e_wallet', label: 'E-Wallet' },
                { value: 'credit', label: 'Credit' },
              ]}
            />
          </FormField>

          <FormField label="Delivery Fee" htmlFor="order-delivery-fee" error={errors.delivery_fee?.message}>
            <input type="number" step="0.01" placeholder="0.00" {...register('delivery_fee', orderRules.delivery_fee)} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Total Amount" htmlFor="order-total" error={errors.total_amount?.message}>
            <input type="number" step="0.01" placeholder="0.00" {...register('total_amount', orderRules.total_amount)} />
          </FormField>
          <FormField label="Amount Paid" htmlFor="order-paid" error={errors.amount_paid?.message}>
            <input type="number" step="0.01" placeholder="0.00" {...register('amount_paid', orderRules.amount_paid)} />
          </FormField>
        </div>

        <FormField label="Notes" htmlFor="order-notes" error={errors.notes?.message}>
          <textarea placeholder="Order notes…" {...register('notes')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
        </FormField>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Items</label>
          {watchedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <SelectField
                  name={`items.${index}.product_id`}
                  control={control}
                  rules={{ required: 'Product is required.' }}
                  placeholder="Select product"
                  options={products.map((p) => ({ value: p.id, label: p.name }))}
                />
              </div>
              <input
                type="number"
                min="1"
                {...register(`items.${index}.quantity`, { required: true, valueAsNumber: true, min: { value: 1, message: 'Min 1' } })}
                className="w-20 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <Button type="button" variant="secondary" onClick={() => removeItem(index)} className="px-2 py-2">
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addItem} className="mt-1">
            Add Item
          </Button>
          {errors.items && (
            <p className="mt-1.5 text-xs text-red-600">{errors.items.message || 'At least one item is required.'}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Saving…' : editingId ? 'Save Changes' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
