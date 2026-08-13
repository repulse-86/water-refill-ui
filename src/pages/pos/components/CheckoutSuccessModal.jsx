import { CheckCircle2 } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import usePosStore from '../../../store/posStore';
import { PAYMENT_METHOD_LABELS, TYPE_LABELS } from '../../../domain/orderStatus';

export default function CheckoutSuccessModal({ order, currency }) {
  const resetCart = usePosStore((state) => state.resetCart);

  if (!order) return null;

  const change = Math.max(0, Number(order.change_returned));

  return (
    <Modal isOpen onClose={resetCart} title="Sale Completed" icon={CheckCircle2} hideClose>
      <div className="text-center py-2">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <p className="text-sm text-slate-600 mb-1">
          Order <span className="font-semibold text-slate-900">#{order.id}</span> created successfully.
        </p>
        <p className="text-xs text-slate-500 mb-1 capitalize">{TYPE_LABELS[order.order_type] ?? order.order_type}</p>
        <p className="text-2xl font-bold text-slate-900 mb-1">
          {currency} {Number(order.total_amount).toFixed(2)}
        </p>
        <p className="text-xs text-slate-500 mb-4">
          {PAYMENT_METHOD_LABELS[order.payment_method] ?? order.payment_method}
        </p>
        {change > 0 && (
          <p className="text-sm text-slate-600 mb-4">
            Change: <span className="font-semibold text-emerald-600">{currency} {change.toFixed(2)}</span>
          </p>
        )}
        <p className="text-xs text-slate-400 mb-4">
          The order has been sent to the fulfillment queue.
        </p>
        <Button onClick={resetCart} className="w-full">
          New Sale
        </Button>
      </div>
    </Modal>
  );
}