import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as authApi from '../api/auth';
import { toFieldErrors } from '../utils/formErrors';

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
  token: null,
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      get isAuthenticated() {
        return Boolean(get().token);
      },

      login: async (credentials) => {
        set({ status: 'loading', fieldErrors: null, message: null });

        try {
          const { token, user } = await authApi.login(credentials);
          set({ user, token, status: 'success' });
          return { success: true };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to sign in. Please try again.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // No-op: session is cleared locally regardless of the server response.
        }
        set({ ...initialState });
      },

      resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
    }),
    {
      name: 'water-refill-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;