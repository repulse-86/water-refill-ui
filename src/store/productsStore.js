import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as productsApi from '../api/products';
import { toFieldErrors } from '../utils/formErrors';

export const productRules = {
  name: {
    required: 'The name field is required.',
  },
  type: {
    required: 'The type field is required.',
  },
  volume_gallons: {
    required: 'The volume field is required.',
    min: { value: 0.01, message: 'The volume must be a positive number.' },
  },
  price: {
    required: 'The price field is required.',
    min: { value: 0, message: 'The price must be a positive number.' },
  },
  stock_quantity: {
    required: 'The stock quantity field is required.',
    min: { value: 0, message: 'The stock quantity must be a positive number.' },
  },
  reorder_point: {
    required: 'The reorder point field is required.',
    min: { value: 0, message: 'The reorder point must be a positive number.' },
  },
};

export const typeLabels = {
  water_refill: 'Water Refill',
  accessory: 'Accessory',
  equipment: 'Equipment',
};

const initialState = {
  products: [],
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useProductsStore = create(
  persist(
    (set) => ({
      ...initialState,

      fetchProducts: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const products = await productsApi.listProducts();
          set({ products, status: 'idle' });
          return { success: true, products };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to load products.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      createProduct: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const product = await productsApi.createProduct(values);
          set((state) => ({ products: [...state.products, product], status: 'success' }));
          return { success: true, product };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to create the product.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      updateProduct: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await productsApi.updateProduct(id, values);
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updated : p)),
            status: 'success',
          }));
          return { success: true, product: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to update the product.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      deleteProduct: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await productsApi.deleteProduct(id);
          set((state) => ({ products: state.products.filter((p) => p.id !== id), status: 'success' }));
          return { success: true };
        } catch (err) {
          const payload = {
            status: 'error',
            fieldErrors: null,
            message: err?.message ?? 'Unable to delete the product.',
          };
          set(payload);
          return { success: false, ...payload };
        }
      },

      resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
    }),
    {
      name: 'water-refill-products',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
    }
  )
);

export default useProductsStore;