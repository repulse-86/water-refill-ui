import client from './client';

export async function login(credentials) {
  return client.post('/v1/login', credentials);
}

export async function me() {
  return client.get('/v1/me');
}

export async function logout() {
  return client.post('/v1/logout');
}
