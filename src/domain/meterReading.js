export const VARIANCE_TOLERANCE = 0.10;

export function toDateKey(date) {
  if (typeof date === 'string') return date.slice(0, 10);
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function computeExpectedVolume(orders, products, date) {
  const key = toDateKey(date);
  const refillById = new Map(
    (products || [])
      .filter((p) => p.type === 'water_refill')
      .map((p) => [Number(p.id), p])
  );

  return (orders || [])
    .filter((o) => o.status === 'completed' && toDateKey(o.created_at) === key)
    .reduce((total, order) => {
      (order.items || []).forEach((item) => {
        const product = refillById.get(Number(item.product_id));
        if (product) {
          total += Number(product.volume_gallons ?? 0) * Number(item.quantity ?? 0);
        }
      });
      return total;
    }, 0);
}

export function getPreviousReading(readings, date) {
  const key = toDateKey(date);
  return (readings || [])
    .filter((r) => toDateKey(r.reading_date) < key)
    .sort((a, b) => (toDateKey(a.reading_date) < toDateKey(b.reading_date) ? 1 : -1))[0] ?? null;
}

export function isFlagged({ expectedVolume, actualThroughput, variance }) {
  if (actualThroughput == null) return false;
  if (Number(expectedVolume) <= 0) return Number(actualThroughput) > 0;
  return Math.abs(Number(variance)) / Number(expectedVolume) > VARIANCE_TOLERANCE;
}

export function enrichReading(reading, readings, orders, products) {
  const previous = getPreviousReading(readings, reading.reading_date);
  const expectedVolume = Number(computeExpectedVolume(orders, products, reading.reading_date));
  const actualThroughput =
    previous == null ? null : Number(reading.meter_value) - Number(previous.meter_value);
  const variance = actualThroughput == null ? null : Number((actualThroughput - expectedVolume).toFixed(2));
  const variancePct =
    actualThroughput != null && expectedVolume > 0
      ? Number(((variance / expectedVolume) * 100).toFixed(1))
      : null;

  return {
    ...reading,
    previous_reading_value: previous?.meter_value ?? null,
    expected_volume: expectedVolume,
    actual_throughput: actualThroughput,
    variance,
    variance_pct: variancePct,
    flagged: isFlagged({ expectedVolume, actualThroughput, variance }),
  };
}
