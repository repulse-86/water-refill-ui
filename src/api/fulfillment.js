import client from './client';

export async function transitionOrderStatus(id, status) {
  return client.post(`/orders/${id}/status`, { status });
}

export async function recordDelivery(id, deliveryData) {
  return client.post(`/orders/${id}/delivery`, deliveryData);
}