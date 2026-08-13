import {
  listMeterReadings as mockListMeterReadings,
  createMeterReading as mockCreateMeterReading,
  updateMeterReading as mockUpdateMeterReading,
  deleteMeterReading as mockDeleteMeterReading,
} from '../mock/meterReadingsMock';

export async function listMeterReadings() {
  return mockListMeterReadings();
}

export async function createMeterReading(payload) {
  return mockCreateMeterReading(payload);
}

export async function updateMeterReading(id, payload) {
  return mockUpdateMeterReading(id, payload);
}

export async function deleteMeterReading(id) {
  return mockDeleteMeterReading(id);
}
