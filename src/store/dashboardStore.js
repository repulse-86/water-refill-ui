import { create } from 'zustand';
import * as dashboardApi from '../api/dashboard';
import { toFieldErrors } from '../utils/formErrors';

const initialState = {
  dashboard: null,
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useDashboardStore = create((set) => ({
  ...initialState,

  fetchDashboard: async () => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const dashboard = await dashboardApi.getDashboard();
      set({ dashboard, status: 'idle' });
      return { success: true, dashboard };
    } catch (err) {
      const fieldErrors = toFieldErrors(err?.errors);
      const payload = {
        status: 'error',
        fieldErrors,
        message: err?.message ?? 'Unable to load the dashboard.',
      };
      set(payload);
      return { success: false, ...payload };
    }
  },

  resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
}));

export default useDashboardStore;
