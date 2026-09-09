import client from './client';

export async function getSettings() {
  return client.get('/v1/settings');
}

export async function updateSettings(payload) {
  return client.put('/v1/settings', payload);
}