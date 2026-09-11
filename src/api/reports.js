import client from './client';

export async function getDailySales() {
  return client.get('/v1/reports/daily-sales');
}

export async function getProductPerformance() {
  return client.get('/v1/reports/product-performance');
}

export async function getDebtAging() {
  return client.get('/v1/reports/debt-aging');
}

export async function getReconciliation() {
  return client.get('/v1/reports/reconciliation');
}
