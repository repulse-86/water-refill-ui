import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as settingsApi from '../api/settings';
import { toFieldErrors } from '../utils/formErrors';

const initialState = {
  settings: null,
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useSettingsStore = create(
  persist(
    (set) => ({
      ...initialState,

      fetchSettings: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const settings = await settingsApi.getSettings();
          set({ settings, status: 'idle' });
          return { success: true, settings };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to load store settings.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      updateSettings: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const settings = await settingsApi.updateSettings(values);
          set({ settings, status: 'success' });
          return { success: true, settings };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to save store settings.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
    }),
    {
      name: 'water-refill-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useSettingsStore;