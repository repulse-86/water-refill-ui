export const mockCustomers = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    phone: '09171234567',
    email: 'juan@example.com',
    subscriber_status: 'active',
    bottle_debt: 2,
    outstanding_balance: 150,
  },
  {
    id: 2,
    name: 'Maria Santos',
    phone: '09281234567',
    email: 'maria@example.com',
    subscriber_status: 'active',
    bottle_debt: 0,
    outstanding_balance: 0,
  },
  {
    id: 3,
    name: 'Pedro Reyes',
    phone: '09391234567',
    email: 'pedro@example.com',
    subscriber_status: 'inactive',
    bottle_debt: 5,
    outstanding_balance: 400,
  },
  {
    id: 4,
    name: 'Ana Garcia',
    phone: '09451234567',
    email: 'ana@example.com',
    subscriber_status: 'active',
    bottle_debt: 1,
    outstanding_balance: 50,
  },
  {
    id: 5,
    name: 'Luis Mendoza',
    phone: '09561234567',
    email: 'luis@example.com',
    subscriber_status: 'inactive',
    bottle_debt: 0,
    outstanding_balance: 0,
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const archivedCustomers = [];
let nextId = 6;

const clone = (customer) => ({ ...customer });

export async function listCustomers() {
  await delay(300);
  return mockCustomers.map(clone);
}

export async function listDeletedCustomers() {
  await delay(300);
  return archivedCustomers.map(clone);
}

export async function createCustomer(payload) {
  await delay(400);
  const customer = { ...payload, id: nextId++ };
  mockCustomers.push(customer);
  return clone(customer);
}

export async function updateCustomer(id, payload) {
  await delay(400);
  const index = mockCustomers.findIndex((customer) => customer.id === id);
  if (index === -1) {
    throw { message: 'Customer not found.', errors: {} };
  }
  mockCustomers[index] = { ...mockCustomers[index], ...payload };
  return clone(mockCustomers[index]);
}

export async function deleteCustomer(id) {
  await delay(300);
  const index = mockCustomers.findIndex((customer) => customer.id === id);
  if (index === -1) {
    throw { message: 'Customer not found.', errors: {} };
  }
  const [customer] = mockCustomers.splice(index, 1);
  archivedCustomers.unshift({ ...customer, deleted_at: new Date().toISOString() });
  return { success: true };
}

export async function restoreCustomer(id) {
  await delay(300);
  const index = archivedCustomers.findIndex((customer) => customer.id === id);
  if (index === -1) {
    throw { message: 'Customer not found.', errors: {} };
  }
  const [customer] = archivedCustomers.splice(index, 1);
  const { deleted_at: _removed, ...restored } = customer;
  mockCustomers.push(restored);
  return clone(restored);
}

export async function permanentDeleteCustomer(id) {
  await delay(300);
  const index = archivedCustomers.findIndex((customer) => customer.id === id);
  if (index === -1) {
    throw { message: 'Customer not found.', errors: {} };
  }
  archivedCustomers.splice(index, 1);
  return { success: true };
}

export async function settleCustomer(id, settlement) {
  await delay(400);
  const index = mockCustomers.findIndex((customer) => customer.id === id);
  if (index === -1) {
    throw { message: 'Customer not found.', errors: {} };
  }
  const { bottleReturn = 0, cashPayment = 0 } = settlement;
  const customer = mockCustomers[index];
  const newBottleDebt = Math.max(0, customer.bottle_debt - Number(bottleReturn));
  const newOutstandingBalance = Math.max(0, customer.outstanding_balance - Number(cashPayment));
  mockCustomers[index] = {
    ...customer,
    bottle_debt: newBottleDebt,
    outstanding_balance: newOutstandingBalance,
  };
  return clone(mockCustomers[index]);
}
