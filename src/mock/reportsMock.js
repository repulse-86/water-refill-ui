import { mockOrders } from './ordersMock';
import { getProducts } from './productsMock';
import { mockCustomers } from './customersMock';
import { getMeterReadings } from './meterReadingsMock';
import {
  computeDailySales,
  computeProductPerformance,
  computeDebtAging,
  computeReconciliation,
} from '../domain/reports';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDailySales() {
  await delay(300);
  return computeDailySales(mockOrders, getProducts());
}

export async function getProductPerformance() {
  await delay(300);
  return computeProductPerformance(mockOrders, getProducts());
}

export async function getDebtAging() {
  await delay(300);
  return computeDebtAging(mockCustomers);
}

export async function getReconciliation() {
  await delay(300);
  return computeReconciliation(mockOrders, getProducts(), getMeterReadings());
}
