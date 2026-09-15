import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as ordersApi from '../api/orders';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';

export const orderRules = {
  customer_id: { required: 'The customer field is required.', valueAsNumber: true },
  order_type: { required: 'The order type field is required.' },
  payment_method: { required: 'The payment method field is required.' },
  total_amount: {
    required: 'The total amount field is required.',
    min: { value: 0, message: 'The total amount must be a positive number.' },
    valueAsNumber: true,
  },
  amount_paid: {
    required: 'The amount paid field is required.',
    min: { value: 0, message: 'The amount paid must be a positive number.' },
    valueAsNumber: true,
  },
  delivery_fee: {
    min: { value: 0, message: 'The delivery fee must be a positive number.' },
    valueAsNumber: true,
  },
};

const initialState = {
  orders: [],
  archivedOrders: [],
  status: 'idle',
  fieldErrors: null,
  message: null,
  viewMode: 'active',
};

const useOrdersStore = create(
  persist(
    (set) => ({
      ...initialState,

      fetchOrders: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const orders = await ordersApi.listOrders();
          set({ orders, status: 'idle', viewMode: 'active' });
          return { success: true, orders };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to load orders.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      fetchDeletedOrders: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const archivedOrders = await ordersApi.listDeletedOrders();
          set({ archivedOrders, status: 'idle', viewMode: 'archived' });
          return { success: true, archivedOrders };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to load archived orders.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      createOrder: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const order = await ordersApi.createOrder(values);
          set((state) => ({ orders: [order, ...state.orders], status: 'success', viewMode: 'active' }));
          toastSuccess('Order created.');
          return { success: true, order };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to create the order.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      updateOrder: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await ordersApi.updateOrder(id, values);
          set((state) => ({ orders: state.orders.map((order) => (order.id === id ? updated : order)), status: 'success' }));
          toastSuccess('Order updated.');
          return { success: true, order: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to update the order.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      deleteOrder: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await ordersApi.deleteOrder(id);
          set((state) => {
            const order = state.orders.find((item) => item.id === id);
            return {
              orders: state.orders.filter((item) => item.id !== id),
              archivedOrders: order ? [{ ...order, deleted_at: new Date().toISOString() }, ...state.archivedOrders] : state.archivedOrders,
              status: 'success',
            };
          });
          toastSuccess('Order archived.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to archive the order.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      restoreOrder: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const restored = await ordersApi.restoreOrder(id);
          set((state) => ({
            archivedOrders: state.archivedOrders.filter((item) => item.id !== id),
            orders: [restored, ...state.orders],
            status: 'success',
          }));
          toastSuccess('Order restored.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to restore the order.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      permanentDeleteOrder: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await ordersApi.permanentDeleteOrder(id);
          set((state) => ({ archivedOrders: state.archivedOrders.filter((item) => item.id !== id), status: 'success' }));
          toastSuccess('Order permanently deleted.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to permanently delete the order.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      setViewMode: (mode) => set({ viewMode: mode, status: 'idle', fieldErrors: null, message: null }),
      resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
    }),
    {
      name: 'water-refill-orders',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);

export default useOrdersStore;
