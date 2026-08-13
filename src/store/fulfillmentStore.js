import { create } from 'zustand';
import * as fulfillmentApi from '../api/fulfillment';
import { toFieldErrors } from '../utils/formErrors';
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
      return { success: true, order: updated };
    } catch (err) {
      const fieldErrors = toFieldErrors(err?.errors);
      const payload = {
        status: 'error',
        fieldErrors,
        message: err?.message ?? 'Unable to update order status.',
      };
      set(payload);
      return { success: false, ...payload };
    }
  },

  recordDelivery: async (id, deliveryData) => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const updated = await fulfillmentApi.recordDelivery(id, deliveryData);
      syncOrder(id, updated);
      return { success: true, order: updated };
    } catch (err) {
      const fieldErrors = toFieldErrors(err?.errors);
      const payload = {
        status: 'error',
        fieldErrors,
        message: err?.message ?? 'Unable to record delivery.',
      };
      set(payload);
      return { success: false, ...payload };
    }
  },

  resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
}));

export default useFulfillmentStore;