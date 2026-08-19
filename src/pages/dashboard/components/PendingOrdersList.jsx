import Badge from '../../../components/ui/Badge';
import {
  STATUS_LABELS,
  STATUS_BADGE_VARIANTS,
  TYPE_LABELS,
  TYPE_BADGE_VARIANTS,
} from '../../../domain/orderStatus';

export default function PendingOrdersList({ orders, currency }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900">Pending Orders</h2>
        <span className="text-xs text-slate-500">{orders.length} open</span>
      </div>

      {orders.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-400">No pending orders.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {orders.map((order) => (
            <li key={order.id} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-slate-800 truncate">{order.customer_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={TYPE_BADGE_VARIANTS[order.order_type]}>
                    {TYPE_LABELS[order.order_type]}
                  </Badge>
                  <Badge variant={STATUS_BADGE_VARIANTS[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              </div>
              <span className="text-sm sm:text-base font-semibold text-slate-900 whitespace-nowrap">
                {currency} {Number(order.total_amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
