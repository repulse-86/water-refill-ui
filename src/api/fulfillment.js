import {
  transitionOrderStatus as mockTransitionOrderStatus,
  recordDelivery as mockRecordDelivery,
} from '../mock/ordersMock';

export async function transitionOrderStatus(id, status) {
  return mockTransitionOrderStatus(id, status);
}

export async function recordDelivery(id, deliveryData) {
  return mockRecordDelivery(id, deliveryData);
}
