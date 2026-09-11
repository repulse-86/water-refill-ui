import client from './client';

export async function getDashboard() {
  return client.get('/v1/dashboard');
}
