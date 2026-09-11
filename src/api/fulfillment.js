import client from './client';

export async function fetchBoard() {
  return client.get('/v1/fulfillment/orders');
}

export async function transitionOrderStatus(id, status) {
  return client.post(`/v1/orders/${id}/status`, { status });
}

export async function recordDelivery(id, deliveryData) {
  return client.post(`/v1/orders/${id}/delivery`, deliveryData);
}
