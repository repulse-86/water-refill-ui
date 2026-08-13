import { Eye } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import useFulfillmentStore from '../../../store/fulfillmentStore';
import { STATUS_LABELS, STATUS_BADGE_VARIANTS, getNextStatus, isTerminal } from '../../../domain/orderStatus';

export default function OrderDetailModal({ isOpen, onClose, order, onAdvance }) {
  const { transitionOrderStatus, status: storeStatus } = useFulfillmentStore(
    useShallow((state) => ({
      transitionOrderStatus: state.transitionOrderStatus,
      status: state.status,
    }))
  );

  if (!isOpen || !order) return null;

  const isLoading = storeStatus === 'loading';
  const canAdvance = !isTerminal(order);

  const handleAdvance = async () => {
    const next = getNextStatus(order);
    if (next) await transitionOrderStatus(order.id, next);
    if (onAdvance) onAdvance();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.id}`} icon={Eye}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Status:</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${STATUS_BADGE_VARIANTS[order.status]}-100 text-${STATUS_BADGE_VARIANTS[order.status]}-700`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Customer</p>
            <p className="text-sm font-medium text-slate-900">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Type</p>
            <p className="text-sm font-medium text-slate-900 capitalize">{order.order_type.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Payment</p>
            <p className="text-sm font-medium text-slate-900 capitalize">{order.payment_method.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Delivery Fee</p>
            <p className="text-sm font-medium text-slate-900">PHP {Number(order.delivery_fee).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-sm font-medium text-slate-900">PHP {Number(order.total_amount).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Amount Paid</p>
            <p className="text-sm font-medium text-slate-900">PHP {Number(order.amount_paid).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Change Returned</p>
            <p className="text-sm font-medium text-slate-900">PHP {Number(order.change_returned).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Created</p>
            <p className="text-sm font-medium text-slate-900">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        {order.notes && (
          <div>
            <p className="text-xs text-slate-500 mb-1">Notes</p>
            <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded p-2">{order.notes}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-slate-500 mb-2">Items</p>
          <div className="bg-slate-50 border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Product</th>
                  <th className="px-3 py-2 font-semibold">Qty</th>
                  <th className="px-3 py-2 font-semibold">Unit Price</th>
                  <th className="px-3 py-2 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-slate-700">{item.product_name}</td>
                    <td className="px-3 py-2 text-slate-700">{item.quantity}</td>
                    <td className="px-3 py-2 text-slate-700">PHP {Number(item.unit_price).toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-700">PHP {Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          {canAdvance && (
            <Button type="button" onClick={handleAdvance} isLoading={isLoading}>
              Advance Status
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
