import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as ordersMock from '../mock/ordersMock';
import * as customersMock from '../mock/customersMock';
import * as productsMock from '../mock/productsMock';
import * as meterReadingsMock from '../mock/meterReadingsMock';
import * as settingsMock from '../mock/settingsMock';
import * as reportsMock from '../mock/reportsMock';
import * as dashboardMock from '../mock/dashboardMock';
import * as authMock from '../mock/authMock';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

const client = axios.create({
  baseURL: env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error?.response?.data;
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

  const getId = (config) => Number(config.url.match(/\/(\d+)(?:\/|$)/)?.[1]);
  const readBody = (config) => (config.data ? JSON.parse(config.data) : {});

  mock.onGet('/orders').reply(reply(() => ordersMock.listOrders()));
  mock.onPost('/orders').reply(reply((config) => ordersMock.createOrder(readBody(config))));
  mock.onPut(/\/orders\/\d+$/).reply(reply((config) => ordersMock.updateOrder(getId(config), readBody(config))));
  mock.onDelete(/\/orders\/\d+$/).reply(reply((config) => ordersMock.deleteOrder(getId(config))));
  mock.onPost(/\/orders\/\d+\/status$/).reply(reply((config) => ordersMock.transitionOrderStatus(getId(config), readBody(config).status)));
  mock.onPost(/\/orders\/\d+\/delivery$/).reply(reply((config) => ordersMock.recordDelivery(getId(config), readBody(config))));

  mock.onGet('/customers').reply(reply(() => customersMock.listCustomers()));
  mock.onPost('/customers').reply(reply((config) => customersMock.createCustomer(readBody(config))));
  mock.onPut(/\/customers\/\d+$/).reply(reply((config) => customersMock.updateCustomer(getId(config), readBody(config))));
  mock.onDelete(/\/customers\/\d+$/).reply(reply((config) => customersMock.deleteCustomer(getId(config))));
  mock.onPost(/\/customers\/\d+\/settle$/).reply(reply((config) => customersMock.settleCustomer(getId(config), readBody(config))));

  mock.onGet('/products').reply(reply(() => productsMock.listProducts()));
  mock.onPost('/products').reply(reply((config) => productsMock.createProduct(readBody(config))));
  mock.onPut(/\/products\/\d+$/).reply(reply((config) => productsMock.updateProduct(getId(config), readBody(config))));
  mock.onDelete(/\/products\/\d+$/).reply(reply((config) => productsMock.deleteProduct(getId(config))));

  mock.onGet('/meter-readings').reply(reply(() => meterReadingsMock.listMeterReadings()));
  mock.onPost('/meter-readings').reply(reply((config) => meterReadingsMock.createMeterReading(readBody(config))));
  mock.onPut(/\/meter-readings\/\d+$/).reply(reply((config) => meterReadingsMock.updateMeterReading(getId(config), readBody(config))));
  mock.onDelete(/\/meter-readings\/\d+$/).reply(reply((config) => meterReadingsMock.deleteMeterReading(getId(config))));

  mock.onGet('/settings').reply(reply(() => settingsMock.getSettings()));
  mock.onPut('/settings').reply(reply((config) => settingsMock.updateSettings(readBody(config))));

  mock.onGet('/reports/daily-sales').reply(reply(() => reportsMock.getDailySales()));
  mock.onGet('/reports/product-performance').reply(reply(() => reportsMock.getProductPerformance()));
  mock.onGet('/reports/debt-aging').reply(reply(() => reportsMock.getDebtAging()));
  mock.onGet('/reports/reconciliation').reply(reply(() => reportsMock.getReconciliation()));

  mock.onGet('/dashboard').reply(reply(() => dashboardMock.getDashboard()));

  mock.onPost('/auth/login').reply(reply((config) => authMock.login(readBody(config))));
  mock.onPost('/auth/logout').reply(reply(() => authMock.logout()));
}

export default client;