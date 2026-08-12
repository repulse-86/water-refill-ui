import { mockAccounts } from './accounts';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function makePublicUser({ id, username, name, email }) {
  return { id, username, name, email };
}

export async function login(credentials) {
  await delay(500);

  const username = credentials?.username?.trim();
  const password = credentials?.password ?? '';

  if (!username || !password) {
    throw {
      message: 'The given data was invalid.',
      errors: {
        username: username ? [] : ['The username field is required.'],
        password: password ? [] : ['The password field is required.'],
      },
    };
  }

  const account = mockAccounts.find((a) => a.username === username);
  if (!account || account.password !== password) {
    throw {
      message: 'These credentials do not match our records.',
      errors: { username: ['We do not have a record matching those credentials.'] },
    };
  }

  return {
    token: `mock-token-${account.id}-${Date.now()}`,
    user: makePublicUser(account),
  };
}

export async function logout() {
  await delay(200);
  return { success: true };
}