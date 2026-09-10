import client from './client';

export async function listProducts({ page = 1, size = 10, search = '', type = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  if (type) params.type = type;
  return client.get('/v1/products', { params });
}

export async function createProduct(payload) {
  return client.post('/v1/products', payload);
}

export async function updateProduct(id, payload) {
  return client.put(`/v1/products/${id}`, payload);
}

export async function deleteProduct(id) {
  return client.delete(`/v1/products/${id}`);
}