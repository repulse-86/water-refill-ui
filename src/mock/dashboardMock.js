import { mockOrders } from './ordersMock';
import { getProducts } from './productsMock';
import { mockCustomers } from './customersMock';
import { getMeterReadings } from './meterReadingsMock';
import {
  computeTodaySales,
  computeGallonsPumped,
  computeBottlesReturned,
  computeActiveCustomers,
  computePendingOrders,
  computeLowStock,
} from '../domain/dashboard';
import { computeDailySales, computeProductPerformance } from '../domain/reports';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboard() {
  await delay(300);
  const orders = mockOrders;
  const products = getProducts();
  const customers = mockCustomers;
  const readings = getMeterReadings();
  const todayKey = new Date().toISOString().slice(0, 10);

  const today = computeTodaySales(orders, todayKey);
  const pendingOrders = computePendingOrders(orders);
  const lowStock = computeLowStock(products);

  const quickStats = {
    gallonsPumped: computeGallonsPumped(readings, orders, products, todayKey),
    bottlesReturned: computeBottlesReturned(orders),
    activeCustomers: computeActiveCustomers(customers),
    pendingOrders: pendingOrders.length,
  };

  const salesTrend = computeDailySales(orders, products)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const topProducts = computeProductPerformance(orders, products)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      revenue: p.revenue,
      units: p.units,
      share_pct: p.share_pct,
    }));

  const trend = computeDailySales(orders, products);
  const paymentMix = ['cash', 'e_wallet', 'credit'].map((key) => ({
    key,
    name: key === 'cash' ? 'Cash' : key === 'e_wallet' ? 'E-Wallet' : 'Credit',
    value: Number(
      trend.reduce((sum, row) => sum + Number(row[key] ?? 0), 0).toFixed(2)
    ),
  }));

  return { today, quickStats, pendingOrders, lowStock, salesTrend, topProducts, paymentMix };
}
