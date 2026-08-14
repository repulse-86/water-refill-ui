import client from './client';

export async function login(credentials) {
  return client.post('/auth/login', credentials);
}

export async function logout() {
  return client.post('/auth/logout');
}