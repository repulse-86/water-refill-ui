import { create } from 'zustand';
import * as ordersApi from '../api/orders';
import { ORDER_TYPES, PAYMENT_METHODS } from '../domain/orderStatus';
import { toFieldErrors } from '../utils/formErrors';

const initialState = {
  cart: [],
  customerId: null,
  orderType: ORDER_TYPES.walk_in,
  paymentMethod: PAYMENT_METHODS.cash,
  deliveryFee: 0,
  deliveryAddress: '',
  notes: '',
  bottlesReturned: 0,
  tendered: 0,
  status: 'idle',
  fieldErrors: null,
  message: null,
  lastOrder: null,
};

const usePosStore = create((set) => ({
  ...initialState,

  resetCart: () =>
    set({
      cart: [],
      customerId: null,
      orderType: ORDER_TYPES.walk_in,
      paymentMethod: PAYMENT_METHODS.cash,
      deliveryFee: 0,
      deliveryAddress: '',
      notes: '',
      bottlesReturned: 0,
      tendered: 0,
      status: 'idle',
      fieldErrors: null,
      message: null,
      lastOrder: null,
    }),

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product_id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        cart: [
          ...state.cart,
          {
            product_id: product.id,
            product_name: product.name,
            unit_price: Number(product.price),
            quantity: 1,
            subtotal: Number(product.price),
          },
        ],
      };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity: Math.max(1, Number(quantity)),
                subtotal: Number(item.unit_price) * Math.max(1, Number(quantity)),
              }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product_id !== productId),
    })),

  setCustomerId: (customerId) => set({ customerId }),
  setOrderType: (orderType) => set({ orderType }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setDeliveryFee: (deliveryFee) => set({ deliveryFee: Number(deliveryFee) || 0 }),
  setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
  setNotes: (notes) => set({ notes }),
  setBottlesReturned: (bottlesReturned) => set({ bottlesReturned: Math.max(0, Number(bottlesReturned)) }),
  setTendered: (tendered) => set({ tendered: Number(tendered) || 0 }),

  clearErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),

  checkout: async ({ onSuccess } = {}) => {
    set((state) => {
      const subtotal = state.cart.reduce((sum, item) => sum + Number(item.subtotal), 0);
      const deliveryFee = state.orderType === ORDER_TYPES.delivery ? state.deliveryFee : 0;
      const totalAmount = subtotal + deliveryFee;
      const tendered = state.paymentMethod === PAYMENT_METHODS.cash ? state.tendered : totalAmount;
      const amountPaid = state.paymentMethod === PAYMENT_METHODS.credit ? 0 : totalAmount;

      return {
        subtotal,
        deliveryFee,
        totalAmount,
        tendered,
        amountPaid,
        status: 'loading',
        fieldErrors: null,
        message: null,
      };
    });

    try {
      const state = usePosStore.getState();
      const payload = {
        customer_id: state.customerId ?? null,
        order_type: state.orderType,
        payment_method: state.paymentMethod,
        total_amount: state.totalAmount,
        amount_paid: state.amountPaid,
        delivery_fee: state.deliveryFee,
        delivery_address:
          state.orderType === ORDER_TYPES.delivery ? state.deliveryAddress || null : null,
        notes: state.notes?.trim() || null,
        bottles_returned: state.bottlesReturned,
        items: state.cart.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        })),
      };

      const order = await ordersApi.createOrder(payload);
      set({
        cart: [],
        subtotal: 0,
        deliveryFee: 0,
        totalAmount: 0,
        tendered: 0,
        amountPaid: 0,
        status: 'success',
        lastOrder: order,
      });
      if (onSuccess) onSuccess(order);
      return { success: true, order };
    } catch (err) {
      const fieldErrors = toFieldErrors(err?.errors);
      set({
        status: 'error',
        fieldErrors,
        message: err?.message ?? 'Unable to complete the sale.',
      });
      return { success: false, message: err?.message ?? 'Unable to complete the sale.', fieldErrors };
    }
  },
}));

export default usePosStore;
