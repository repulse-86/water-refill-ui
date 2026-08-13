import { mockCustomers } from './customersMock';
import { canTransition, DELIVERY_STATUSES, ORDER_STATUSES } from '../domain/orderStatus';

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
    delivery_address: null,
    delivery_status: null,
    delivered_at: null,
    bottles_returned_at_delivery: 0,
    cash_collected_at_delivery: 0,
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
    delivery_address: '123 Main St',
    delivery_status: 'pending',
    delivered_at: null,
    bottles_returned_at_delivery: 0,
    cash_collected_at_delivery: 0,
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
    delivery_address: null,
    delivery_status: null,
    delivered_at: null,
    bottles_returned_at_delivery: 0,
    cash_collected_at_delivery: 0,
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
    delivery_address: '456 Oak Ave',
    delivery_status: 'pending',
    delivered_at: null,
    bottles_returned_at_delivery: 0,
    cash_collected_at_delivery: 0,
  },
];

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
    items: (payload.items || []).map((item) => ({ ...item, id: nextItemId++ })),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    delivery_address: payload.delivery_address ?? null,
    delivery_status: payload.order_type === 'delivery' ? 'pending' : null,
    delivered_at: null,
    bottles_returned_at_delivery: 0,
    cash_collected_at_delivery: 0,
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
  const editable = { ...payload };
  delete editable.status;
  mockOrders[index] = {
    ...mockOrders[index],
    ...editable,
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

export async function transitionOrderStatus(id, status) {
  await delay(300);
  const index = mockOrders.findIndex((o) => o.id === id);
  if (index === -1) {
    throw { message: 'Order not found.', errors: {} };
  }
  const order = mockOrders[index];
  if (!canTransition(order, status)) {
    throw { message: `Cannot move from ${order.status} to ${status}.`, errors: {} };
  }
  mockOrders[index].status = status;
  mockOrders[index].updated_at = new Date().toISOString();
  return { ...mockOrders[index], items: [...mockOrders[index].items] };
}

export async function recordDelivery(id, deliveryData) {
  await delay(400);
  const index = mockOrders.findIndex((o) => o.id === id);
  if (index === -1) {
    throw { message: 'Order not found.', errors: {} };
  }
  const order = mockOrders[index];
  if (order.order_type !== 'delivery') {
    throw { message: 'This order is not a delivery.', errors: {} };
  }
  if (order.delivery_status === DELIVERY_STATUSES.delivered || order.delivery_status === DELIVERY_STATUSES.failed) {
    throw { message: 'Delivery has already been recorded.', errors: {} };
  }

  const bottlesReturned = Number(deliveryData.bottles_returned ?? 0);
  const cashCollected = Number(deliveryData.cash_collected ?? 0);

  if (order.customer_id) {
    const customerIndex = mockCustomers.findIndex((c) => c.id === order.customer_id);
    if (customerIndex !== -1) {
      const customer = mockCustomers[customerIndex];
      const newBottleDebt = Math.max(0, customer.bottle_debt - bottlesReturned);
      const newOutstandingBalance = Math.max(0, customer.outstanding_balance - cashCollected);
      mockCustomers[customerIndex] = {
        ...customer,
        bottle_debt: newBottleDebt,
        outstanding_balance: newOutstandingBalance,
      };
    }
  }

  const newDeliveryStatus = deliveryData.delivery_status;
  const now = new Date().toISOString();

  mockOrders[index] = {
    ...order,
    delivery_status: newDeliveryStatus,
    delivered_at: newDeliveryStatus === DELIVERY_STATUSES.delivered ? now : order.delivered_at,
    bottles_returned_at_delivery: bottlesReturned,
    cash_collected_at_delivery: cashCollected,
    delivery_address: deliveryData.delivery_address ?? order.delivery_address,
    status: canTransition(order, ORDER_STATUSES.completed)
      ? ORDER_STATUSES.completed
      : order.status,
    updated_at: now,
  };

  return { ...mockOrders[index], items: [...mockOrders[index].items] };
}
