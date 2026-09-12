import client from './client';

export async function listProducts({ page = 1, size = 10, search = '', type = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  if (type) params.type = type;
  return client.get('/v1/products', { params });
}

export async function createProduct(payload) {
  const isFormData = payload instanceof FormData;
  return client.post('/v1/products', payload, isFormData ? { headers: { 'Content-Type': null } } : undefined);
}

export async function updateProduct(id, payload) {
  const isFormData = payload instanceof FormData;
  return client.put(`/v1/products/${id}`, payload, isFormData ? { headers: { 'Content-Type': null } } : undefined);
}

export async function deleteProduct(id) {
  return client.delete(`/v1/products/${id}`);
}

export async function listDeletedProducts({ page = 1, size = 10, search = '', type } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  if (type) params.type = type;
  return client.get('/v1/products/deleted', { params });
}

export async function restoreProduct(id) {
  return client.post(`/v1/products/${id}/restore`);
}

export async function permanentDeleteProduct(id) {
  return client.delete(`/v1/products/${id}/permanent`);
}