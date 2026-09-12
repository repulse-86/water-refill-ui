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

export async function listDeletedMeterReadings({ page = 1, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search) params.search = search;
  return client.get('/v1/meter-readings/deleted', { params });
}

export async function restoreMeterReading(id) {
  return client.post(`/v1/meter-readings/${id}/restore`);
}

export async function permanentDeleteMeterReading(id) {
  return client.delete(`/v1/meter-readings/${id}/permanent`);
}
