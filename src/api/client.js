import axios from 'axios';

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

export default client;
