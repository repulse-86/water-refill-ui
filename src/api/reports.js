import client from './client';

export async function getDailySales({ page = 1, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  return client.get('/v1/reports/daily-sales', { params });
}

export async function getProductPerformance({ page = 1, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  return client.get('/v1/reports/product-performance', { params });
}

export async function getDebtAging({ page = 1, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  return client.get('/v1/reports/debt-aging', { params });
}

export async function getReconciliation({ page = 1, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  return client.get('/v1/reports/reconciliation', { params });
}
