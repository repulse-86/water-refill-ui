import client from './client';

export async function getDashboard() {
  return client.get('/dashboard');
}