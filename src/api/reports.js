import {
  getDailySales as mockGetDailySales,
  getProductPerformance as mockGetProductPerformance,
  getDebtAging as mockGetDebtAging,
  getReconciliation as mockGetReconciliation,
} from '../mock/reportsMock';

export async function getDailySales() {
  return mockGetDailySales();
}

export async function getProductPerformance() {
  return mockGetProductPerformance();
}

export async function getDebtAging() {
  return mockGetDebtAging();
}

export async function getReconciliation() {
  return mockGetReconciliation();
}
