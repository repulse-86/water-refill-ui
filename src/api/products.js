import client from './client';

export async function listProducts() {
  return client.get('/products');
}

export async function createProduct(payload) {
  return client.post('/products', payload);
}

export async function updateProduct(id, payload) {
  return client.put(`/products/${id}`, payload);
}

export async function deleteProduct(id) {
  return client.delete(`/products/${id}`);
}

export async function listDeletedProducts() {
  return client.get('/products/deleted');
}

export async function restoreProduct(id) {
  return client.post(`/products/${id}/restore`);
}

export async function permanentDeleteProduct(id) {
  return client.delete(`/products/${id}/permanent`);
}
