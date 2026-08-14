import { Link } from 'react-router-dom';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { typeLabels } from '../../../store/productsStore';

export default function LowStockAlerts({ products }) {
  return (
    <div className="bg-white border border-slate-200 rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900">Low Stock Alerts</h2>
        <span className="text-xs text-slate-500">{products.length} items</span>
      </div>

      {products.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-400">All products above reorder point.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {products.map((product) => (
            <li key={product.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                <div className="mt-1">
                  <Badge variant="slate">{typeLabels[product.type]}</Badge>
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="text-sm font-semibold text-red-600">
                  {product.stock_quantity} left
                </p>
                <p className="text-xs text-slate-400">reorder at {product.reorder_point}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="px-4 py-3 border-t border-slate-200">
        <Button asChild variant="secondary" className="w-full">
          <Link to="/inventory">Manage inventory →</Link>
        </Button>
      </div>
    </div>
  );
}
