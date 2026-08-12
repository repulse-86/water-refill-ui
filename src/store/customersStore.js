import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as customersApi from '../api/customers';
import { toFieldErrors } from '../utils/formErrors';

export const customerRules = {
  name: {
    required: 'The name field is required.',
  },
  phone: {
    required: 'The phone field is required.',
  },
  email: {
    required: 'The email field is required.',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'The email must be a valid email address.' },
  },
  subscriber_status: {
    required: 'The subscriber status field is required.',
  },
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
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useCustomersStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      fetchCustomers: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const customers = await customersApi.listCustomers();
          set({ customers, status: 'idle' });
          return { success: true, customers };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to load customers.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      createCustomer: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const customer = await customersApi.createCustomer(values);
          set((state) => ({ customers: [...state.customers, customer], status: 'success' }));
          return { success: true, customer };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to create the customer.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      updateCustomer: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await customersApi.updateCustomer(id, values);
          set((state) => ({
            customers: state.customers.map((c) => (c.id === id ? updated : c)),
            status: 'success',
          }));
          return { success: true, customer: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to update the customer.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      deleteCustomer: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await customersApi.deleteCustomer(id);
          set((state) => ({ customers: state.customers.filter((c) => c.id !== id), status: 'success' }));
          return { success: true };
        } catch (err) {
          const payload = {
            status: 'error',
            fieldErrors: null,
            message: err?.message ?? 'Unable to delete the customer.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      settleCustomer: async (id, settlement) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const customer = await customersApi.settleCustomer(id, settlement);
          set((state) => ({
            customers: state.customers.map((c) => (c.id === id ? customer : c)),
            status: 'success',
          }));
          return { success: true, customer };
        } catch (err) {
          const payload = {
            status: 'error',
            fieldErrors: null,
            message: err?.message ?? 'Unable to settle the customer ledger.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

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
