import client from './client';

export async function listProductComponents(productId, { page = 1, size = 100, search = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  return client.get(`/v1/products/${productId}/components`, { params });
}

export async function addProductComponent(productId, payload) {
  return client.post(`/v1/products/${productId}/components`, payload);
}

export async function updateProductComponent(productId, componentId, payload) {
  return client.put(`/v1/products/${productId}/components/${componentId}`, payload);
}

export async function deleteProductComponent(productId, componentId) {
  return client.delete(`/v1/products/${productId}/components/${componentId}`);
}
