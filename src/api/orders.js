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