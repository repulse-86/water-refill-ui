import client from './client';

export async function listOrders() {
  return client.get('/orders');
}

export async function createOrder(payload) {
  return client.post('/orders', payload);
}

export async function updateOrder(id, payload) {
  return client.put(`/orders/${id}`, payload);
}

export async function deleteOrder(id) {
  return client.delete(`/orders/${id}`);
}

export async function listDeletedOrders() {
  return client.get('/orders/deleted');
}

export async function restoreOrder(id) {
  return client.post(`/orders/${id}/restore`);
}

export async function permanentDeleteOrder(id) {
  return client.delete(`/orders/${id}/permanent`);
}
