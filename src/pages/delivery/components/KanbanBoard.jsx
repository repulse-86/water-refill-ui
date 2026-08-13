import { useMemo } from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { STATUS_BADGE_VARIANTS, DELIVERY_STATUS_BADGE_VARIANTS } from '../../../domain/orderStatus';

const COLUMNS = [
  { id: 'queued', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'transit', label: 'Delivery' },
  { id: 'completed', label: 'Closed' },
];

function OrderCard({ order, currency, onAdvance, onRecord, onSkipDelivery, onArchive }) {
  const isCompleted = order.status === 'completed';
  const isDelivery = order.order_type === 'delivery';
  const isTransit = order.status === 'transit';
  const isProcessing = order.status === 'processing';

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-900">#{order.id}</span>
        <Badge variant={
            isDelivery && order.delivery_status && order.delivery_status !== 'pending'
              ? DELIVERY_STATUS_BADGE_VARIANTS[order.delivery_status]
              : STATUS_BADGE_VARIANTS[order.status] || 'slate'
          }>
          {isDelivery && order.delivery_status && order.delivery_status !== 'pending'
            ? order.delivery_status.charAt(0).toUpperCase() + order.delivery_status.slice(1)
            : order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'
          }
        </Badge>
      </div>

      <p className="text-sm font-medium text-slate-900 mb-1">{order.customer_name}</p>
      <p className="text-xs text-slate-500 mb-2 truncate">{order.delivery_address || 'No address'}</p>

      <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
        <span>{currency} {Number(order.total_amount).toFixed(2)}</span>
        <span className="capitalize">{order.order_type.replace('_', ' ')}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span>Bottles: {order.bottles_returned_at_delivery || 0}</span>
        <span>Cash: {currency} {Number(order.cash_collected_at_delivery).toFixed(2)}</span>
      </div>

      <div className="flex gap-2">
        {isCompleted && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onArchive(order)}
            className="flex-1"
          >
            Archive
          </Button>
        )}
        {isProcessing && !isDelivery && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSkipDelivery(order)}
            className="flex-1"
          >
            Complete
          </Button>
        )}
        {isProcessing && isDelivery && (
          <Button
            type="button"
            variant="primary"
            onClick={() => onAdvance(order)}
            className="flex-1"
          >
            Advance
          </Button>
        )}
        {!isCompleted && !isProcessing && (
          <Button
            type="button"
            variant="primary"
            onClick={() => onAdvance(order)}
            className="flex-1"
          >
            Advance
          </Button>
        )}
        {isTransit && isDelivery && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onRecord(order)}
            className="flex-1"
          >
            Record
          </Button>
        )}
      </div>
    </div>
  );
}

function Column({ column, orders, currency, onAdvance, onRecord, onSkipDelivery, onArchive }) {
  const columnOrders = orders.filter((o) => o.status === column.id);

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{column.label}</h3>
        <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
          {columnOrders.length}
        </span>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {columnOrders.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded">No orders</p>
        ) : (
          columnOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              currency={currency}
              onAdvance={onAdvance}
              onRecord={onRecord}
              onSkipDelivery={onSkipDelivery}
              onArchive={onArchive}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ orders, currency, onAdvance, onRecord, onSkipDelivery, onArchive }) {
  const columns = useMemo(() => COLUMNS, []);

  return (
    <div className="flex gap-8 overflow-x-auto pb-4">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          orders={orders}
          currency={currency}
          onAdvance={onAdvance}
          onRecord={onRecord}
          onSkipDelivery={onSkipDelivery}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
