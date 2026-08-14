import client from './client';

export async function getDailySales() {
  return client.get('/reports/daily-sales');
}

export async function getProductPerformance() {
  return client.get('/reports/product-performance');
}

export async function getDebtAging() {
  return client.get('/reports/debt-aging');
}

export async function getReconciliation() {
  return client.get('/reports/reconciliation');
}