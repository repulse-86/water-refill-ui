import { useForm } from 'react-hook-form';
import { Package, Plus, Trash2 } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import SelectField from '../../../components/ui/SelectField';
import Button from '../../../components/ui/Button';

export default function ProductBomModal({ isOpen, onClose, product, allProducts = [], components = [], onChange }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ defaultValues: { component_id: '', quantity: 1 } });

  if (!isOpen || !product) return null;

  const availableProducts = allProducts.filter(
    (candidate) => candidate.id !== product.id && !components.some((component) => component.component_id === candidate.id)
  );

  const onAdd = (data) => {
    const component = allProducts.find((candidate) => candidate.id === Number(data.component_id));
    if (!component) return;

    onChange([
      ...components,
      {
        component_id: Number(data.component_id),
        component_name: component.name,
        quantity: Math.max(1, Number(data.quantity) || 1),
      },
    ]);
    reset({ component_id: '', quantity: 1 });
  };

  const onRemove = (componentId) => {
    onChange(components.filter((component) => component.component_id !== componentId));
  };

  const onUpdateQuantity = (componentId, quantity) => {
    onChange(
      components.map((component) =>
        component.component_id === componentId
          ? { ...component, quantity: Math.max(1, Number(quantity) || 1) }
          : component
      )
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Components" icon={Package}>
      <p className="text-xs text-slate-600 mb-4">
        Manage components for <strong>{product.name}</strong>. These will be saved when you save the product.
      </p>

      <div className="space-y-2 mb-4">
        {components.length === 0 && <p className="text-xs text-slate-400">No components yet.</p>}
        {components.map((component) => (
          <div key={component.component_id} className="flex items-center justify-between border rounded-lg px-3 py-2">
            <p className="text-sm font-medium text-slate-900">{component.component_name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Qty:</span>
              <input
                type="number"
                min={1}
                value={component.quantity}
                onChange={(event) => onUpdateQuantity(component.component_id, event.target.value)}
                className="w-20 border rounded px-2 py-1 text-xs"
              />
              <Button type="button" variant="danger" size="sm" onClick={() => onRemove(component.component_id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {availableProducts.length > 0 && (
        <form onSubmit={handleSubmit(onAdd)} className="flex items-end gap-2 border-t pt-3" noValidate>
          <FormField label="Add Component" className="flex-1" error={errors.component_id?.message}>
            <SelectField
              name="component_id"
              control={control}
              rules={{ required: 'The component field is required.' }}
              options={availableProducts.map((candidate) => ({ value: String(candidate.id), label: candidate.name }))}
              placeholder="Select component"
            />
          </FormField>
          <FormField label="Qty" className="w-24" error={errors.quantity?.message}>
            <input
              type="number"
              min={1}
              {...register('quantity', { required: 'Required', min: { value: 1, message: 'Min 1' } })}
            />
          </FormField>
          <Button type="submit" variant="secondary">
            <Plus className="w-4 h-4" />
          </Button>
        </form>
      )}
    </Modal>
  );
}
