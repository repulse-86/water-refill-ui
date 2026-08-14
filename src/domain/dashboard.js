import { toDateKey, computeExpectedVolume } from './meterReading';
import dayjs from '../utils/date';

const round2 = (n) => Number(Number(n).toFixed(2));

export function computeTodaySales(orders, todayKey) {
  const key = todayKey ?? toDateKey(new Date());
  const row = {
    date: key,
    revenue: 0,
    order_count: 0,
    cash: 0,
    e_wallet: 0,
    credit: 0,
    gallons: 0,
  };

  (orders || [])
    .filter((o) => o.status === 'completed' && toDateKey(o.created_at) === key)
    .forEach((order) => {
      row.order_count += 1;
      const total = Number(order.total_amount ?? 0);
      row.revenue += total;
      if (order.payment_method === 'cash') row.cash += total;
      else if (order.payment_method === 'e_wallet') row.e_wallet += total;
      else if (order.payment_method === 'credit') row.credit += total;
    });

  return {
    ...row,
    revenue: round2(row.revenue),
    cash: round2(row.cash),
    e_wallet: round2(row.e_wallet),
    credit: round2(row.credit),
  };
}

export function computeGallonsPumped(readings, orders, products, todayKey) {
  const sorted = [...(readings || [])].sort((a, b) =>
    toDateKey(a.reading_date).localeCompare(toDateKey(b.reading_date))
  );
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  if (latest && previous) {
    return round2(Number(latest.meter_value) - Number(previous.meter_value));
  }
  return round2(computeExpectedVolume(orders, products, todayKey ?? new Date()));
}

export function computeBottlesReturned(orders) {
  return (orders || []).reduce(
    (sum, o) => sum + Number(o.bottles_returned_at_delivery ?? 0),
    0
  );
}

export function computeActiveCustomers(customers) {
  return (customers || []).filter((c) => c.subscriber_status === 'active').length;
}

export function computePendingOrders(orders) {
  return (orders || [])
    .filter((o) => o.status !== 'completed')
    .map((o) => ({
      id: o.id,
      customer_name: o.customer_name,
      order_type: o.order_type,
      status: o.status,
      total_amount: round2(Number(o.total_amount ?? 0)),
      created_at: o.created_at,
    }))
    .sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());
}

export function computeLowStock(products) {
  return (products || [])
    .filter((p) => Number(p.stock_quantity) <= Number(p.reorder_point))
    .map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      stock_quantity: Number(p.stock_quantity),
      reorder_point: Number(p.reorder_point),
    }))
    .sort((a, b) => a.stock_quantity - b.stock_quantity);
}
