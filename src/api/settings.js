import client from './client';

export async function getSettings() {
  return client.get('/settings');
}

export async function updateSettings(payload) {
  return client.put('/settings', payload);
}