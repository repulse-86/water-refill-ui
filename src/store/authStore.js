import { create } from 'zustand';
import * as authApi from '../api/auth';
import { toFieldErrors } from '../utils/formErrors';
import { toastError } from '../utils/toast';

export const loginRules = {
  username: {
    required: 'The username field is required.',
    minLength: { value: 3, message: 'The username must be at least 3 characters.' },
  },
  password: {
    required: 'The password field is required.',
    minLength: { value: 6, message: 'The password must be at least 6 characters.' },
  },
};

const initialState = {
  user: null,
  sessionStatus: 'checking',
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useAuthStore = create((set, get) => ({
  ...initialState,

  get isAuthenticated() {
    return Boolean(get().user);
  },

  init: async () => {
    try {
      const { user } = await authApi.me();
      set({ user, sessionStatus: 'authenticated' });
    } catch {
      set({ user: null, sessionStatus: 'guest' });
    }
  },

  login: async (credentials) => {
    set({ status: 'loading', fieldErrors: null, message: null });

    try {
      const { user } = await authApi.login(credentials);
      set({ user, sessionStatus: 'authenticated', status: 'success' });
      return { success: true };
    } catch (err) {
      const fieldErrors = toFieldErrors(err?.errors);
      const payload = {
        status: 'error',
        fieldErrors,
        message: err?.message ?? 'Unable to sign in. Please try again.',
      };
      set(payload);
      toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
      return { success: false, ...payload };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // no-op: session is cleared locally regardless of the server response
    }
    set({ ...initialState, sessionStatus: 'guest' });
  },

  resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
