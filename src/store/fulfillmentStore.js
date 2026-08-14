import { create } from 'zustand';
import * as fulfillmentApi from '../api/fulfillment';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';
import useOrdersStore from './ordersStore';

const initialState = {
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const syncOrder = (id, order) =>
  useOrdersStore.setState((state) => ({
    orders: state.orders.map((o) => (o.id === id ? order : o)),
  }));

const useFulfillmentStore = create((set) => ({
  ...initialState,

  transitionOrderStatus: async (id, status) => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const updated = await fulfillmentApi.transitionOrderStatus(id, status);
      syncOrder(id, updated);
      toastSuccess('Order status updated.');
      return { success: true, order: updated };
    } catch (err) {
      const fieldErrors = toFieldErrors(err?.errors);
      const payload = {
        status: 'error',
        fieldErrors,
        message: err?.message ?? 'Unable to update order status.',
      };
      set(payload);
      toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
      return { success: false, ...payload };
    }
  },

  recordDelivery: async (id, deliveryData) => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const updated = await fulfillmentApi.recordDelivery(id, deliveryData);
      syncOrder(id, updated);
      toastSuccess('Delivery recorded.');
      return { success: true, order: updated };
    } catch (err) {
      const fieldErrors = toFieldErrors(err?.errors);
      const payload = {
        status: 'error',
        fieldErrors,
        message: err?.message ?? 'Unable to record delivery.',
      };
      set(payload);
      toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
      return { success: false, ...payload };
    }
  },

  resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
}));

export default useFulfillmentStore;