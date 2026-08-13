import { useMemo, useState } from 'react';
import { Package } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import usePosStore from '../../../store/posStore';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'water_refill', label: 'Refills' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'equipment', label: 'Equipment' },
];

const typeBadge = {
  water_refill: { variant: 'blue', label: 'Refill' },
  accessory: { variant: 'violet', label: 'Accessory' },
  equipment: { variant: 'slate', label: 'Equipment' },
};

export default function ProductGrid({ products, currency }) {
  const addToCart = usePosStore((state) => state.addToCart);
  const [category, setCategory] = useState('all');

  const visible = useMemo(
    () => (category === 'all' ? products : products.filter((p) => p.type === category)),
    [products, category]
  );

  return (
    <div className="flex-1 min-w-0">
      <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 mb-4 gap-1">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setCategory(id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              category === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-400">No products available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {visible.map((product) => {
            const outOfStock = Number(product.stock_quantity) <= 0;
            const badge = typeBadge[product.type] ?? typeBadge.accessory;
            return (
              <button
                key={product.id}
                type="button"
                disabled={outOfStock}
                onClick={() => addToCart(product)}
                className="bg-white border border-slate-200 rounded p-3 text-left hover:shadow-md hover:border-sky-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-4 h-4 text-sky-600" />
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-1">{product.name}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    {currency} {Number(product.price).toFixed(2)}
                  </span>
                  <span className={outOfStock ? 'text-red-600 font-medium' : 'text-slate-500'}>
                    {outOfStock ? 'Out of stock' : `Stock: ${product.stock_quantity}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}