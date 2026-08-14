import { Banknote, CreditCard, Smartphone } from 'lucide-react';
import { PAYMENT_METHODS } from '../../../domain/orderStatus';

const OPTIONS = [
  { id: PAYMENT_METHODS.cash, label: 'Cash', icon: Banknote },
  { id: PAYMENT_METHODS.e_wallet, label: 'E-Wallet', icon: Smartphone },
  { id: PAYMENT_METHODS.credit, label: 'Credit', icon: CreditCard },
];

export default function PaymentSummary({
  currency,
  subtotal,
  deliveryFee,
  total,
  paymentMethod,
  tendered,
  onChangePayment,
  onChangeTendered,
}) {
  const change = paymentMethod === PAYMENT_METHODS.cash ? tendered - total : 0;
  const cashShort = change < 0;

  return (
    <div className="border-t border-slate-200 pt-3 space-y-3">
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>
            {currency} {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Delivery Fee</span>
          <span>
            {currency} {deliveryFee.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-slate-900">
          <span>Total</span>
          <span>
            {currency} {total.toFixed(2)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChangePayment(id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded text-[11px] font-semibold border transition ${
                paymentMethod === id
                  ? 'bg-sky-600 border-sky-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === PAYMENT_METHODS.cash && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Amount Tendered</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={tendered || ''}
            onChange={(e) => onChangeTendered(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          <p className={`mt-1 text-xs ${cashShort ? 'text-red-600' : 'text-emerald-600'}`}>
            {cashShort
              ? `Short by ${currency} ${Math.abs(change).toFixed(2)}`
              : `Change: ${currency} ${change.toFixed(2)}`}
          </p>
        </div>
      )}

      {paymentMethod === PAYMENT_METHODS.e_wallet && (
        <p className="text-xs text-sky-700 bg-sky-50 border border-sky-200 rounded p-2.5">
          Collected via e-wallet, no change required.
        </p>
      )}

      {paymentMethod === PAYMENT_METHODS.credit && (
        <p className="text-xs text-violet-700 bg-violet-50 border border-violet-200 rounded p-2.5">
          Charged to the customer's ledger (outstanding balance).
        </p>
      )}
    </div>
  );
}