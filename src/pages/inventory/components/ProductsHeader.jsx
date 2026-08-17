import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';

export default function ProductsHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Inventory & Products</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your product catalog refills, accessories, and equipment.
        </p>
      </div>
      <Button onClick={onAdd} className="text-[10px] sm:text-xs">
        <Plus className="w-4 h-4 mr-1.5" />
        Add Product
      </Button>
    </div>
  );
}