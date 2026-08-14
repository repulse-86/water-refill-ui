import { create } from 'zustand';
import * as reportsApi from '../api/reports';
import { toFieldErrors } from '../utils/formErrors';
import { toastError } from '../utils/toast';

const initialState = {
  dailySales: [],
  productPerformance: [],
  debtAging: [],
  reconciliation: [],
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useReportsStore = create((set) => ({
  ...initialState,

  fetchReports: async () => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const [dailySales, productPerformance, debtAging, reconciliation] = await Promise.all([
        reportsApi.getDailySales(),
        reportsApi.getProductPerformance(),
        reportsApi.getDebtAging(),
        reportsApi.getReconciliation(),
      ]);
      set({ dailySales, productPerformance, debtAging, reconciliation, status: 'idle' });
      return { success: true };
} catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to load reports.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
  },

  resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
}));

export default useReportsStore;
