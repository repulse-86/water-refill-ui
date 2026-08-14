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