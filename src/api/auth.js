import { login as mockLogin, logout as mockLogout } from '../mock/authMock';

export async function login(credentials) {
  return mockLogin(credentials);
}

export async function logout() {
  return mockLogout();
}