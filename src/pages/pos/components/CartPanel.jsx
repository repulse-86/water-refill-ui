import { useMemo, useState } from 'react';
import { ShoppingCart, Store, Trash2, Truck } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import usePosStore from '../../../store/posStore';
import { ORDER_TYPES } from '../../../domain/orderStatus';
import Button from '../../../components/ui/Button';
import FormField from '../../../components/ui/FormField';
import IconButton from '../../../components/ui/IconButton';
import PaymentSummary from './PaymentSummary';
import QuantityStepper from './QuantityStepper';
import SegmentedControl from './SegmentedControl';

export default function CartPanel({ currency, onSaleSuccess }) {
  const {
    cart,
    customerId,
    orderType,
    paymentMethod,
    deliveryFee,
    deliveryAddress,
    notes,
    bottlesReturned,
    tendered,
    status,
    setOrderType,
    setPaymentMethod,
    setDeliveryFee,
    setDeliveryAddress,
    setNotes,
    setBottlesReturned,
    setTendered,
    updateQuantity,
    removeFromCart,
    checkout,
  } = usePosStore(
    useShallow((state) => ({
      cart: state.cart,
      customerId: state.customerId,
      orderType: state.orderType,
      paymentMethod: state.paymentMethod,
      deliveryFee: state.deliveryFee,
      deliveryAddress: state.deliveryAddress,
      notes: state.notes,
      bottlesReturned: state.bottlesReturned,
      tendered: state.tendered,
      status: state.status,
      setOrderType: state.setOrderType,
      setPaymentMethod: state.setPaymentMethod,
      setDeliveryFee: state.setDeliveryFee,
      setDeliveryAddress: state.setDeliveryAddress,
      setNotes: state.setNotes,
      setBottlesReturned: state.setBottlesReturned,
      setTendered: state.setTendered,
      updateQuantity: state.updateQuantity,
      removeFromCart: state.removeFromCart,
      checkout: state.checkout,
    }))
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.subtotal), 0),
    [cart]
  );
  const delivery = orderType === ORDER_TYPES.delivery ? deliveryFee : 0;
  const total = subtotal + delivery;
  const isLoading = status === 'loading';

  const [notice, setNotice] = useState(null);

  const note = notice;

  const handleCheckout = async () => {
    setNotice(null);
    if (cart.length === 0) return;
    if (paymentMethod === 'credit' && !customerId) {
      setNotice('Select a customer to charge this sale to their ledger.');
      return;
    }
    await checkout({ onSuccess: onSaleSuccess });
  };

  return (
    <div className="w-full lg:w-[380px] shrink-0">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4 sticky top-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-sky-600" />
            Current Sale
          </h2>
          <span className="text-xs text-slate-500">{cart.length} item(s)</span>
        </div>

        <SegmentedControl
          value={orderType}
          onChange={setOrderType}
          options={[
            {
              value: ORDER_TYPES.walk_in,
              label: 'Walk-In',
              icon: Store,
              activeClass: 'bg-sky-600 border-sky-600 text-white',
              idleClass: 'border-slate-300 text-slate-600 hover:bg-slate-50',
            },
            {
              value: ORDER_TYPES.delivery,
              label: 'Delivery',
              icon: Truck,
              activeClass: 'bg-violet-600 border-violet-600 text-white',
              idleClass: 'border-slate-300 text-slate-600 hover:bg-slate-50',
            },
          ]}
        />

        {orderType === ORDER_TYPES.delivery && (
          <>
            <FormField label="Delivery Address" htmlFor="pos-delivery-address">
              <input
                type="text"
                id="pos-delivery-address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Delivery address…"
              />
            </FormField>
            <FormField label="Delivery Fee" htmlFor="pos-delivery-fee">
              <input
                type="number"
                id="pos-delivery-fee"
                step="0.01"
                min="0"
                value={deliveryFee || ''}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="0.00"
              />
            </FormField>
          </>
        )}

        {cart.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-lg">
            Click a product to add it to the sale.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <li key={item.product_id} className="py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-slate-900 font-medium">{item.product_name}</p>
                  <IconButton
                    icon={Trash2}
                    variant="danger"
                    title="Remove"
                    onClick={() => removeFromCart(item.product_id)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.product_id, q)}
                  />
                  <span className="text-xs font-medium text-slate-700">
                    {currency} {Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {customerId && (
          <FormField label="Bottles Returned" htmlFor="pos-bottles-returned">
            <input
              type="number"
              id="pos-bottles-returned"
              step="1"
              min="0"
              value={bottlesReturned || ''}
              onChange={(e) => setBottlesReturned(e.target.value)}
              placeholder="0"
            />
          </FormField>
        )}

        <FormField label="Notes" htmlFor="pos-notes">
          <input
            type="text"
            id="pos-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Order notes…"
          />
        </FormField>

        {note && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700">{note}</div>
        )}

        <PaymentSummary
          currency={currency}
          subtotal={subtotal}
          deliveryFee={delivery}
          total={total}
          paymentMethod={paymentMethod}
          tendered={tendered}
          onChangePayment={setPaymentMethod}
          onChangeTendered={setTendered}
        />

        <Button
          type="button"
          onClick={handleCheckout}
          isLoading={isLoading}
          disabled={isLoading || cart.length === 0}
          className="w-full"
        >
          {isLoading ? 'Processing…' : 'Complete Sale'}
        </Button>
      </div>
    </div>
  );
}