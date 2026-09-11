import { create } from 'zustand';
import * as fulfillmentApi from '../api/fulfillment';
import * as ordersApi from '../api/orders';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';
import { ORDER_STATUSES } from '../domain/orderStatus';

const initialState = {
  board: null,
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const BOARD_STATUSES = [ORDER_STATUSES.queued, ORDER_STATUSES.processing, ORDER_STATUSES.transit, ORDER_STATUSES.completed];

const ensureBucket = (board) => {
  const result = {};
  BOARD_STATUSES.forEach((s) => {
    result[s] = board?.[s] ? [...board[s]] : [];
  });
  return result;
};

const syncOrderInBoard = (id, updatedOrder) => {
  useFulfillmentStore.setState((state) => {
    if (!state.board) return {};
    const board = {};
    BOARD_STATUSES.forEach((s) => {
      board[s] = state.board[s].filter((o) => o.id !== id);
    });
    const newKey = updatedOrder.status;
    board[newKey] = [...(board[newKey] || []), updatedOrder];
    return { board };
  });
};

const removeFromBoard = (id) => {
  useFulfillmentStore.setState((state) => {
    if (!state.board) return {};
    const board = {};
    BOARD_STATUSES.forEach((s) => {
      board[s] = state.board[s].filter((o) => o.id !== id);
    });
    return { board };
  });
};

const useFulfillmentStore = create((set) => ({
  ...initialState,

  fetchBoard: async () => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const response = await fulfillmentApi.fetchBoard();
      const board = ensureBucket(response.columns);
      set({ board, status: 'idle' });
      return { success: true, board };
    } catch (err) {
      const payload = {
        status: 'error',
        fieldErrors: null,
        message: err?.message ?? 'Unable to load fulfillment board.',
      };
      set(payload);
      toastError(payload.message);
      return { success: false, ...payload };
    }
  },

  transitionOrderStatus: async (id, status) => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const updated = await fulfillmentApi.transitionOrderStatus(id, status);
      syncOrderInBoard(id, updated);
      toastSuccess('Order status updated.');
      set({ status: 'idle' });
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
      syncOrderInBoard(id, updated);
      toastSuccess('Delivery recorded.');
      set({ status: 'idle' });
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

  archiveOrder: async (id) => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      await ordersApi.deleteOrder(id);
      removeFromBoard(id);
      toastSuccess('Order archived.');
      set({ status: 'idle' });
      return { success: true };
    } catch (err) {
      const payload = {
        status: 'error',
        fieldErrors: null,
        message: err?.message ?? 'Unable to archive order.',
      };
      set(payload);
      toastError(payload.message, false);
      return { success: false, ...payload };
    }
  },

  resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
}));

export default useFulfillmentStore;
