import { toDateKey, computeExpectedVolume, isFlagged } from './meterReading';

const round2 = (n) => Number(Number(n).toFixed(2));
const round1 = (n) => Number(Number(n).toFixed(1));

export function computeDailySales(orders, products) {
  const refillById = new Map(
    (products || [])
      .filter((p) => p.type === 'water_refill')
      .map((p) => [Number(p.id), p])
  );

  const byDay = new Map();
  (orders || [])
    .filter((o) => o.status === 'completed')
    .forEach((order) => {
      const date = toDateKey(order.created_at);
      const row = byDay.get(date) ?? {
        id: date,
        date,
        order_count: 0,
        revenue: 0,
        cash: 0,
        e_wallet: 0,
        credit: 0,
        gallons: 0,
      };
      row.order_count += 1;
      const total = Number(order.total_amount ?? 0);
      row.revenue += total;
      if (order.payment_method === 'cash') row.cash += total;
      else if (order.payment_method === 'e_wallet') row.e_wallet += total;
      else if (order.payment_method === 'credit') row.credit += total;
      (order.items || []).forEach((item) => {
        const product = refillById.get(Number(item.product_id));
        if (product) {
          row.gallons += Number(product.volume_gallons ?? 0) * Number(item.quantity ?? 0);
        }
      });
      byDay.set(date, row);
    });

  return [...byDay.values()]
    .map((row) => ({
      ...row,
      revenue: round2(row.revenue),
      cash: round2(row.cash),
      e_wallet: round2(row.e_wallet),
      credit: round2(row.credit),
      gallons: round2(row.gallons),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function computeProductPerformance(orders, products) {
  const byId = new Map();
  (orders || [])
    .filter((o) => o.status === 'completed')
    .forEach((order) => {
      (order.items || []).forEach((item) => {
        const productId = Number(item.product_id);
        const row = byId.get(productId) ?? {
          id: productId,
          product_id: productId,
          name: item.product_name,
          type: 'water_refill',
          units: 0,
          revenue: 0,
        };
        row.units += Number(item.quantity ?? 0);
        row.revenue += Number(item.subtotal ?? 0);
        byId.set(productId, row);
      });
    });

  (products || []).forEach((p) => {
    const row = byId.get(Number(p.id));
    if (row) row.type = p.type;
  });

  const list = [...byId.values()].map((row) => ({
    ...row,
    units: Number(row.units),
    revenue: round2(row.revenue),
  }));
  const totalRevenue = list.reduce((sum, row) => sum + row.revenue, 0);

  return list
    .sort((a, b) => b.revenue - a.revenue)
    .map((row) => ({
      ...row,
      share_pct: totalRevenue > 0 ? round1((row.revenue / totalRevenue) * 100) : 0,
    }));
}

export function computeDebtAging(customers) {
  return (customers || [])
    .filter((c) => Number(c.outstanding_balance) > 0 || Number(c.bottle_debt) > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      subscriber_status: c.subscriber_status,
      bottle_debt: Number(c.bottle_debt ?? 0),
      outstanding_balance: Number(c.outstanding_balance ?? 0),
      total: round2(Number(c.outstanding_balance ?? 0)),
    }))
    .sort((a, b) => b.outstanding_balance - a.outstanding_balance);
}

export function computeReconciliation(orders, products, readings) {
  const dates = new Set();
  (orders || [])
    .filter((o) => o.status === 'completed')
    .forEach((o) => dates.add(toDateKey(o.created_at)));
  (readings || []).forEach((r) => dates.add(toDateKey(r.reading_date)));

  const sortedReadings = [...(readings || [])].sort((a, b) =>
    toDateKey(a.reading_date).localeCompare(toDateKey(b.reading_date))
  );

  const rows = [...dates].map((date) => {
    const index = sortedReadings.findIndex((r) => toDateKey(r.reading_date) === date);
    const reading = index !== -1 ? sortedReadings[index] : null;
    const previous = index > 0 ? sortedReadings[index - 1] : null;

    const expectedVolume = Number(computeExpectedVolume(orders, products, date));
    const actualThroughput =
      reading && previous
        ? Number((Number(reading.meter_value) - Number(previous.meter_value)).toFixed(2))
        : null;
    const variance =
      actualThroughput == null ? null : round2(actualThroughput - expectedVolume);
    const variancePct =
      actualThroughput != null && expectedVolume > 0
        ? round1((variance / expectedVolume) * 100)
        : null;
    const flagged = isFlagged({ expectedVolume, actualThroughput, variance });

    return {
      id: date,
      date,
      expected_volume: round2(expectedVolume),
      actual_throughput: actualThroughput,
      variance,
      variance_pct: variancePct,
      flagged,
      status: actualThroughput == null ? 'No Data' : flagged ? 'Flagged' : 'OK',
    };
  });

  return rows.sort((a, b) => b.date.localeCompare(a.date));
}
