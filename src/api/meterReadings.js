import client from './client';

export async function listMeterReadings() {
  return client.get('/meter-readings');
}

export async function createMeterReading(payload) {
  return client.post('/meter-readings', payload);
}

export async function updateMeterReading(id, payload) {
  return client.put(`/meter-readings/${id}`, payload);
}

export async function deleteMeterReading(id) {
  return client.delete(`/meter-readings/${id}`);
}

export async function listDeletedMeterReadings() {
  return client.get('/meter-readings/deleted');
}

export async function restoreMeterReading(id) {
  return client.post(`/meter-readings/${id}/restore`);
}

export async function permanentDeleteMeterReading(id) {
  return client.delete(`/meter-readings/${id}/permanent`);
}
