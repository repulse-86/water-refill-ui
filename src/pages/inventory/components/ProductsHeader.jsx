import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';

export default function ProductsHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">Inventory & Products</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your product catalog
        </p>
      </div>
      <Button onClick={onAdd} className="text-xs sm:text-sm">
        <Plus className="w-4 h-4 mr-1.5" />
        Add Product
      </Button>
    </div>
  );
}