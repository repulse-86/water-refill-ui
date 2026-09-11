import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as reportsMock from '../mock/reportsMock';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

const client = axios.create({
  baseURL: env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let refreshing = false;
let refreshSubscribers = [];

async function refreshAccessToken() {
  if (refreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }
  refreshing = true;
  try {
    const { token } = await client.post('/v1/refresh');
    return token;
  } catch {
    try {
      const { default: useAuthStore } = await import('../store/authStore');
      await useAuthStore.getState().logout();
    } catch {
      // no-op
    }
    return null;
  } finally {
    if (!refreshSubscribers.length) refreshing = false;
  }
}

function cleanupRefreshState(token) {
  if (refreshSubscribers.length) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  }
  refreshing = false;
}

client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error || {};
    const status = response?.status;

    if (status === 401 && config && !config._retry) {
      const url = config.url || '';
      if (url.includes('/v1/login') || url.includes('/v1/refresh')) {
        const data = response?.data;
        if (data && (data.message || data.errors)) {
          return Promise.reject(data);
        }
        return Promise.reject(error);
      }

      config._retry = true;
      const originalUrl = config.url;
      const originalMethod = config.method;
      const originalData = config.data;

      try {
        const token = await refreshAccessToken();
        if (!token) {
          cleanupRefreshState(null);
          return Promise.reject(error);
        }
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        const result = await client.request({ ...config, url: originalUrl, method: originalMethod, data: originalData });
        cleanupRefreshState(token);
        return result;
    } catch {
      cleanupRefreshState(null);
        return Promise.reject(error);
      }
    }

    const data = response?.data;
    if (data && (data.message || data.errors)) {
      return Promise.reject(data);
    }
    return Promise.reject(error);
  }
);

const useMocks = env.VITE_USE_MOCKS !== 'false';

if (useMocks) {
  const mock = new MockAdapter(client);

  const reply = (handler) => async (config) => {
    try {
      const data = await handler(config);
      return [200, data];
    } catch (err) {
      const hasFieldErrors = err?.errors && Object.keys(err.errors).length > 0;
      return [hasFieldErrors ? 422 : 400, { message: err?.message, errors: err?.errors ?? {} }];
    }
  };

  mock.onGet('/v1/orders').passThrough();
  mock.onPost('/v1/orders').passThrough();
  mock.onPut(/\/v1\/orders\/\d+$/).passThrough();
  mock.onDelete(/\/v1\/orders\/\d+$/).passThrough();
  mock.onPost(/\/v1\/orders\/\d+\/status$/).passThrough();
  mock.onPost(/\/v1\/orders\/\d+\/delivery$/).passThrough();

  mock.onGet('/v1/fulfillment/orders').passThrough();

  mock.onGet('/v1/meter-readings').passThrough();
  mock.onPost('/v1/meter-readings').passThrough();
  mock.onPut(/\/v1\/meter-readings\/\d+$/).passThrough();
  mock.onDelete(/\/v1\/meter-readings\/\d+$/).passThrough();

  mock.onGet('/v1/reports/daily-sales').reply(reply(() => reportsMock.getDailySales()));
  mock.onGet('/v1/reports/product-performance').reply(reply(() => reportsMock.getProductPerformance()));
  mock.onGet('/v1/reports/debt-aging').reply(reply(() => reportsMock.getDebtAging()));
  mock.onGet('/v1/reports/reconciliation').reply(reply(() => reportsMock.getReconciliation()));

  mock.onGet('/v1/dashboard').passThrough();

  mock.onAny().passThrough();
}

export default client;
