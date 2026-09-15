import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as customersApi from '../api/customers';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';

export const customerRules = {
  name: { required: 'The name field is required.' },
  phone: { required: 'The phone field is required.' },
  email: {
    required: 'The email field is required.',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'The email must be a valid email address.' },
  },
  subscriber_status: { required: 'The subscriber status field is required.' },
  bottle_debt: {
    required: 'The bottle debt field is required.',
    min: { value: 0, message: 'The bottle debt must be a positive number.' },
  },
  outstanding_balance: {
    required: 'The outstanding balance field is required.',
    min: { value: 0, message: 'The outstanding balance must be a positive number.' },
  },
};

const initialState = {
  customers: [],
  archivedCustomers: [],
  status: 'idle',
  fieldErrors: null,
  message: null,
  viewMode: 'active',
};

const useCustomersStore = create(
  persist(
    (set) => ({
      ...initialState,

      fetchCustomers: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const customers = await customersApi.listCustomers();
          set({ customers, status: 'idle', viewMode: 'active' });
          return { success: true, customers };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to load customers.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      fetchDeletedCustomers: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const archivedCustomers = await customersApi.listDeletedCustomers();
          set({ archivedCustomers, status: 'idle', viewMode: 'archived' });
          return { success: true, archivedCustomers };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to load archived customers.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      createCustomer: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const customer = await customersApi.createCustomer(values);
          set((state) => ({ customers: [...state.customers, customer], status: 'success', viewMode: 'active' }));
          toastSuccess('Customer created.');
          return { success: true, customer };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to create the customer.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      updateCustomer: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await customersApi.updateCustomer(id, values);
          set((state) => ({ customers: state.customers.map((customer) => (customer.id === id ? updated : customer)), status: 'success' }));
          toastSuccess('Customer updated.');
          return { success: true, customer: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to update the customer.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      deleteCustomer: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await customersApi.deleteCustomer(id);
          set((state) => {
            const customer = state.customers.find((item) => item.id === id);
            return {
              customers: state.customers.filter((item) => item.id !== id),
              archivedCustomers: customer ? [{ ...customer, deleted_at: new Date().toISOString() }, ...state.archivedCustomers] : state.archivedCustomers,
              status: 'success',
            };
          });
          toastSuccess('Customer archived.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to archive the customer.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      restoreCustomer: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const restored = await customersApi.restoreCustomer(id);
          set((state) => ({
            archivedCustomers: state.archivedCustomers.filter((item) => item.id !== id),
            customers: [restored, ...state.customers],
            status: 'success',
          }));
          toastSuccess('Customer restored.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to restore the customer.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      permanentDeleteCustomer: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await customersApi.permanentDeleteCustomer(id);
          set((state) => ({ archivedCustomers: state.archivedCustomers.filter((item) => item.id !== id), status: 'success' }));
          toastSuccess('Customer permanently deleted.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to permanently delete the customer.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      settleCustomer: async (id, settlement) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const customer = await customersApi.settleCustomer(id, settlement);
          set((state) => ({ customers: state.customers.map((item) => (item.id === id ? customer : item)), status: 'success' }));
          toastSuccess('Customer ledger settled.');
          return { success: true, customer };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to settle the customer ledger.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      setViewMode: (mode) => set({ viewMode: mode, status: 'idle', fieldErrors: null, message: null }),
      resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
    }),
    {
      name: 'water-refill-customers',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customers: state.customers }),
    }
  )
);

export default useCustomersStore;
