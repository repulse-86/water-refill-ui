import {
  listCustomers as mockListCustomers,
  createCustomer as mockCreateCustomer,
  updateCustomer as mockUpdateCustomer,
  deleteCustomer as mockDeleteCustomer,
  settleCustomer as mockSettleCustomer,
} from '../mock/customersMock';

export async function listCustomers() {
  return mockListCustomers();
}

export async function createCustomer(payload) {
  return mockCreateCustomer(payload);
}

export async function updateCustomer(id, payload) {
  return mockUpdateCustomer(id, payload);
}

export async function deleteCustomer(id) {
  return mockDeleteCustomer(id);
}

export async function settleCustomer(id, settlement) {
  return mockSettleCustomer(id, settlement);
}
