import { mockOrders } from './ordersMock';
import { mockProducts } from './productsMock';
import { enrichReading } from '../domain/meterReading';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function dateKey(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export const mockMeterReadings = [
  {
    id: 1,
    reading_date: dateKey(-1),
    meter_value: 100,
    notes: 'End of previous day',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    reading_date: dateKey(0),
    meter_value: 108.5,
    notes: 'End of shift',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let readings = [...mockMeterReadings];

let nextId = 3;

const validate = (payload = {}, excludeId = null) => {
  const errors = {};

  const readingDate = payload.reading_date?.trim();
  if (!readingDate) {
    errors.reading_date = ['The reading date field is required.'];
  } else if (readings.some((r) => r.reading_date === readingDate && r.id !== excludeId)) {
    errors.reading_date = ['A reading for this date has already been recorded.'];
  } else {
    const date = new Date(`${readingDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(date.getTime())) {
      errors.reading_date = ['The reading date must be a valid date.'];
    } else if (date > today) {
      errors.reading_date = ['The reading date cannot be in the future.'];
    }
  }

  const meterValue = Number(payload.meter_value);
  if (payload.meter_value === '' || payload.meter_value == null || Number.isNaN(meterValue) || meterValue < 0) {
    errors.meter_value = ['The meter value must be a positive number.'];
  }

  return errors;
};

export async function listMeterReadings() {
  await delay(300);
  return [...readings]
    .sort((a, b) => b.reading_date.localeCompare(a.reading_date))
    .map((r) => enrichReading(r, readings, mockOrders, mockProducts));
}

export async function createMeterReading(payload) {
  await delay(400);

  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    throw { message: 'The given data was invalid.', errors };
  }

  const reading = {
    id: nextId++,
    reading_date: payload.reading_date.trim(),
    meter_value: Number(payload.meter_value),
    notes: payload.notes?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  readings.push(reading);
  return enrichReading(reading, readings, mockOrders, mockProducts);
}

export async function updateMeterReading(id, payload) {
  await delay(400);

  const index = readings.findIndex((r) => r.id === id);
  if (index === -1) {
    throw { message: 'Reading not found.', errors: {} };
  }

  const errors = validate(payload, id);
  if (Object.keys(errors).length > 0) {
    throw { message: 'The given data was invalid.', errors };
  }

  readings[index] = {
    ...readings[index],
    reading_date: payload.reading_date.trim(),
    meter_value: Number(payload.meter_value),
    notes: payload.notes?.trim() || null,
    updated_at: new Date().toISOString(),
  };
  return enrichReading(readings[index], readings, mockOrders, mockProducts);
}

export async function deleteMeterReading(id) {
  await delay(300);

  const index = readings.findIndex((r) => r.id === id);
  if (index === -1) {
    throw { message: 'Reading not found.', errors: {} };
  }
  readings.splice(index, 1);
  return { success: true };
}
