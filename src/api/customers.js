import client from './client';

export async function listCustomers({ page = 1, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  return client.get('/v1/customers', { params });
}

export async function createCustomer(payload) {
  return client.post('/v1/customers', payload);
}

export async function updateCustomer(id, payload) {
  return client.put(`/v1/customers/${id}`, payload);
}

export async function deleteCustomer(id) {
  return client.delete(`/v1/customers/${id}`);
}

export async function settleCustomer(id, settlement) {
  return client.post(`/v1/customers/${id}/settle`, settlement);
}
