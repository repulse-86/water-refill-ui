import client from './client';

export async function updateProfile(data) {
  return client.put('/v1/user/profile-information', data);
}

export async function updatePassword(data) {
  return client.put('/v1/user/password', data);
}
