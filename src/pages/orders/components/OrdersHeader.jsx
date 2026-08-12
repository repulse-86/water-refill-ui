import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';

export default function OrdersHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Order Management & Delivery</h1>
        <p className="text-sm text-slate-500">
          Track and manage order lifecycles.
        </p>
      </div>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1.5" />
        Add Order
      </Button>
    </div>
  );
}
