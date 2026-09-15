import client from './client';

export async function listProductComponents(productId) {
  return client.get(`/products/${productId}/components`);
}
