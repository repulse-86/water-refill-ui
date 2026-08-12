import {
  listOrders as mockListOrders,
  createOrder as mockCreateOrder,
  updateOrder as mockUpdateOrder,
  deleteOrder as mockDeleteOrder,
  advanceStatus as mockAdvanceStatus,
} from '../mock/ordersMock';

export async function listOrders() {
  return mockListOrders();
}

export async function createOrder(payload) {
  return mockCreateOrder(payload);
}

export async function updateOrder(id, payload) {
  return mockUpdateOrder(id, payload);
}

export async function deleteOrder(id) {
  return mockDeleteOrder(id);
}

export async function advanceStatus(id) {
  return mockAdvanceStatus(id);
}
