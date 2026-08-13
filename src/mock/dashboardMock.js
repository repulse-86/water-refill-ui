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

  return { today, quickStats, pendingOrders, lowStock };
}
