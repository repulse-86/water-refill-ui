import client from './client';

export async function listOrders({ page = 1, size = 10, search = '', orderType, status } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  if (orderType) params.orderType = orderType;
  if (status) params.status = status;
  return client.get('/v1/orders', { params });
}

export async function createOrder(payload) {
  return client.post('/v1/orders', payload);
}

export async function updateOrder(id, payload) {
  return client.put(`/v1/orders/${id}`, payload);
}

export async function deleteOrder(id) {
  return client.delete(`/v1/orders/${id}`);
}

export async function listDeletedOrders({ page = 1, size = 10, search = '', orderType, status } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  if (orderType) params.orderType = orderType;
  if (status) params.status = status;
  return client.get('/v1/orders/deleted', { params });
}

export async function restoreOrder(id) {
  return client.post(`/v1/orders/${id}/restore`);
}

export async function permanentDeleteOrder(id) {
  return client.delete(`/v1/orders/${id}/permanent`);
}
