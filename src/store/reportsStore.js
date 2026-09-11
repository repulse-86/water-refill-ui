import { create } from 'zustand';
import * as reportsApi from '../api/reports';
import { toFieldErrors } from '../utils/formErrors';
import { toastError } from '../utils/toast';

const initialState = {
  dailySales: [],
  productPerformance: [],
  debtAging: [],
  reconciliation: [],
  currentPage: 1,
  perPage: 10,
  search: '',
  dailySalesMeta: { totalItems: 0, totalPages: 0 },
  productPerformanceMeta: { totalItems: 0, totalPages: 0 },
  debtAgingMeta: { totalItems: 0, totalPages: 0 },
  reconciliationMeta: { totalItems: 0, totalPages: 0 },
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useReportsStore = create((set) => ({
  ...initialState,

  fetchReports: async ({ page = 1, size = 10, search = '' } = {}) => {
    set({ status: 'loading', fieldErrors: null, message: null });
    try {
      const [dailySales, productPerformance, debtAging, reconciliation] = await Promise.all([
        reportsApi.getDailySales({ page, size, search }),
        reportsApi.getProductPerformance({ page, size, search }),
        reportsApi.getDebtAging({ page, size, search }),
        reportsApi.getReconciliation({ page, size, search }),
      ]);
      set({
        dailySales: dailySales.data,
        productPerformance: productPerformance.data,
        debtAging: debtAging.data,
        reconciliation: reconciliation.data,
        currentPage: page,
        perPage: size,
        search,
        dailySalesMeta: { totalItems: dailySales.total_items, totalPages: dailySales.total_pages },
        productPerformanceMeta: { totalItems: productPerformance.total_items, totalPages: productPerformance.total_pages },
        debtAgingMeta: { totalItems: debtAging.total_items, totalPages: debtAging.total_pages },
        reconciliationMeta: { totalItems: reconciliation.total_items, totalPages: reconciliation.total_pages },
        status: 'idle',
      });
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
