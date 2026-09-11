import client from './client';

export async function listMeterReadings(params) {
  return client.get('/v1/meter-readings', { params });
}

export async function createMeterReading(payload) {
  return client.post('/v1/meter-readings', payload);
}

export async function updateMeterReading(id, payload) {
  return client.put(`/v1/meter-readings/${id}`, payload);
}

export async function deleteMeterReading(id) {
  return client.delete(`/v1/meter-readings/${id}`);
}
