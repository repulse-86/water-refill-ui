import { create } from 'zustand';
import * as ordersApi from '../api/orders';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';

export const orderRules = {
  customer_id: {
    required: 'The customer field is required.',
    valueAsNumber: true,
  },
  order_type: {
    required: 'The order type field is required.',
  },
  payment_method: {
    required: 'The payment method field is required.',
  },
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
  status: 'idle',
  fieldErrors: null,
  message: null,
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
  viewMode: 'active',
};

const useOrdersStore = create(
  (set) => ({
      ...initialState,

      fetchOrders: async (params) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const response = await ordersApi.listOrders(params);
          set({
            orders: response.data,
            status: 'idle',
            currentPage: params?.page ?? 1,
            perPage: params?.size ?? 10,
            totalItems: response.total_items,
            totalPages: response.total_pages,
          });
          return { success: true, orders: response.data };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to load orders.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      createOrder: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const order = await ordersApi.createOrder(values);
          set((state) => ({ orders: [order, ...state.orders], status: 'success' }));
          toastSuccess('Order created.');
          return { success: true, order };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to create the order.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      updateOrder: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await ordersApi.updateOrder(id, values);
          set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? updated : o)),
            status: 'success',
          }));
          toastSuccess('Order updated.');
          return { success: true, order: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to update the order.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      deleteOrder: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await ordersApi.deleteOrder(id);
          set((state) => ({ orders: state.orders.filter((o) => o.id !== id), status: 'success' }));
          toastSuccess('Order deleted.');
          return { success: true };
        } catch (err) {
          const payload = {
            status: 'error',
            fieldErrors: null,
            message: err?.message ?? 'Unable to delete the order.',
          };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      fetchDeletedOrders: async (params) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const response = await ordersApi.listDeletedOrders(params);
          set({
            orders: response.data,
            status: 'idle',
            currentPage: params?.page ?? 1,
            perPage: params?.size ?? 10,
            totalItems: response.total_items,
            totalPages: response.total_pages,
          });
          return { success: true, orders: response.data };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to load archived orders.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      restoreOrder: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await ordersApi.restoreOrder(id);
          set((state) => ({ orders: state.orders.filter((o) => o.id !== id), status: 'success' }));
          toastSuccess('Order restored.');
          return { success: true };
        } catch (err) {
          const payload = {
            status: 'error',
            fieldErrors: null,
            message: err?.message ?? 'Unable to restore the order.',
          };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      permanentDeleteOrder: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await ordersApi.permanentDeleteOrder(id);
          set((state) => ({ orders: state.orders.filter((o) => o.id !== id), status: 'success' }));
          toastSuccess('Order permanently deleted.');
          return { success: true };
        } catch (err) {
          const payload = {
            status: 'error',
            fieldErrors: null,
            message: err?.message ?? 'Unable to permanently delete the order.',
          };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      setViewMode: (mode) =>
        set({
          viewMode: mode,
          orders: [],
          status: 'idle',
          fieldErrors: null,
          message: null,
          currentPage: 1,
          totalItems: 0,
          totalPages: 0,
        }),

      resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
    })
);

export default useOrdersStore;
