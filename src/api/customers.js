import client from './client';

export async function listCustomers() {
  return client.get('/customers');
}

export async function createCustomer(payload) {
  return client.post('/customers', payload);
}

export async function updateCustomer(id, payload) {
  return client.put(`/customers/${id}`, payload);
}

export async function deleteCustomer(id) {
  return client.delete(`/customers/${id}`);
}

export async function settleCustomer(id, settlement) {
  return client.post(`/customers/${id}/settle`, settlement);
}

export async function listDeletedCustomers() {
  return client.get('/customers/deleted');
}

export async function restoreCustomer(id) {
  return client.post(`/customers/${id}/restore`);
}

export async function permanentDeleteCustomer(id) {
  return client.delete(`/customers/${id}/permanent`);
}
