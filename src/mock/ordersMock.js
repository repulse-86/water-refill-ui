import { mockCustomers } from './accounts';
import { mockProducts } from './productsMock';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let nextOrderId = 1;
let nextItemId = 1;

export const mockOrders = [
  {
    id: nextOrderId++,
    customer_id: 1,
    customer_name: 'Juan Dela Cruz',
    order_type: 'walk_in',
    status: 'queued',
    payment_method: 'cash',
    total_amount: 50,
    amount_paid: 50,
    change_returned: 0,
    delivery_fee: 0,
    notes: null,
    items: [
      { id: nextItemId++, product_id: 1, product_name: 'Purified Water', quantity: 2, unit_price: 25, subtotal: 50 },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: nextOrderId++,
    customer_id: 2,
    customer_name: 'Maria Santos',
    order_type: 'delivery',
    status: 'processing',
    payment_method: 'e_wallet',
    total_amount: 120,
    amount_paid: 120,
    change_returned: 0,
    delivery_fee: 20,
    notes: 'Leave at gate',
    items: [
      { id: nextItemId++, product_id: 1, product_name: 'Purified Water', quantity: 4, unit_price: 25, subtotal: 100 },
      { id: nextItemId++, product_id: 4, product_name: 'Water Jug 5 Gal', quantity: 1, unit_price: 20, subtotal: 20 },
    ],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: nextOrderId++,
    customer_id: null,
    customer_name: 'Walk-in',
    order_type: 'walk_in',
    status: 'completed',
    payment_method: 'cash',
    total_amount: 35,
    amount_paid: 35,
    change_returned: 0,
    delivery_fee: 0,
    notes: null,
    items: [
      { id: nextItemId++, product_id: 2, product_name: 'Alkaline Water', quantity: 1, unit_price: 35, subtotal: 35 },
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: nextOrderId++,
    customer_id: 3,
    customer_name: 'Pedro Reyes',
    order_type: 'delivery',
    status: 'transit',
    payment_method: 'credit',
    total_amount: 75,
    amount_paid: 0,
    change_returned: 0,
    delivery_fee: 15,
    notes: 'Call before delivery',
    items: [
      { id: nextItemId++, product_id: 1, product_name: 'Purified Water', quantity: 3, unit_price: 25, subtotal: 75 },
    ],
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

const statusTransitions = {
  queued: 'processing',
  processing: 'transit',
  transit: 'completed',
};

export async function listOrders() {
  await delay(300);
  return mockOrders.map((o) => ({ ...o, items: [...o.items] }));
}

export async function createOrder(payload) {
  await delay(400);
  const customer = mockCustomers.find((c) => c.id === Number(payload.customer_id));
  const order = {
    ...payload,
    id: nextOrderId++,
    customer_name: customer?.name ?? 'Walk-in',
    change_returned: Number(payload.amount_paid) - Number(payload.total_amount),
    items: payload.items || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockOrders.unshift(order);
  return { ...order, items: [...order.items] };
}

export async function updateOrder(id, payload) {
  await delay(400);
  const index = mockOrders.findIndex((o) => o.id === id);
  if (index === -1) {
    throw { message: 'Order not found.', errors: {} };
  }
  const customer = mockCustomers.find((c) => c.id === Number(payload.customer_id));
  mockOrders[index] = {
    ...mockOrders[index],
    ...payload,
    customer_name: customer?.name ?? 'Walk-in',
    change_returned: Number(payload.amount_paid) - Number(payload.total_amount),
    items: payload.items || mockOrders[index].items,
    updated_at: new Date().toISOString(),
  };
  return { ...mockOrders[index], items: [...mockOrders[index].items] };
}

export async function deleteOrder(id) {
  await delay(300);
  const index = mockOrders.findIndex((o) => o.id === id);
  if (index === -1) {
    throw { message: 'Order not found.', errors: {} };
  }
  mockOrders.splice(index, 1);
  return { success: true };
}

export async function advanceStatus(id) {
  await delay(300);
  const order = mockOrders.find((o) => o.id === id);
  if (!order) {
    throw { message: 'Order not found.', errors: {} };
  }
  const next = statusTransitions[order.status];
  if (!next) {
    throw { message: 'Order is already completed.', errors: {} };
  }
  order.status = next;
  order.updated_at = new Date().toISOString();
  return { ...order, items: [...order.items] };
}
