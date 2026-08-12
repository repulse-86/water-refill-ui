import {
  listProducts as mockListProducts,
  createProduct as mockCreateProduct,
  updateProduct as mockUpdateProduct,
  deleteProduct as mockDeleteProduct,
} from '../mock/productsMock';

export async function listProducts() {
  return mockListProducts();
}

export async function createProduct(payload) {
  return mockCreateProduct(payload);
}

export async function updateProduct(id, payload) {
  return mockUpdateProduct(id, payload);
}

export async function deleteProduct(id) {
  return mockDeleteProduct(id);
}