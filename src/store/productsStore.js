import { create } from 'zustand';
import * as productsApi from '../api/products';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';

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
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
};

const useProductsStore = create(
  (set) => ({
    ...initialState,

    fetchProducts: async (params) => {
      set({ status: 'loading', fieldErrors: null, message: null });
      try {
        const response = await productsApi.listProducts(params);
        set({
          products: response.data,
          status: 'idle',
          currentPage: params?.page ?? 1,
          perPage: params?.size ?? 10,
          totalItems: response.total_items,
          totalPages: response.total_pages,
        });
        return { success: true, products: response.data };
      } catch (err) {
        const fieldErrors = toFieldErrors(err?.errors);
        const payload = {
          status: 'error',
          fieldErrors,
          message: err?.message ?? 'Unable to load products.',
        };
        set(payload);
        toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
        return { success: false, ...payload };
      }
    },

    createProduct: async (values) => {
      set({ status: 'loading', fieldErrors: null, message: null });
      try {
        const product = await productsApi.createProduct(values);
        set((state) => ({ products: [...state.products, product], status: 'success' }));
        toastSuccess('Product created.');
        return { success: true, product };
      } catch (err) {
        const fieldErrors = toFieldErrors(err?.errors);
        const payload = {
          status: 'error',
          fieldErrors,
          message: err?.message ?? 'Unable to create the product.',
        };
        set(payload);
        toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
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
        toastSuccess('Product updated.');
        return { success: true, product: updated };
      } catch (err) {
        const fieldErrors = toFieldErrors(err?.errors);
        const payload = {
          status: 'error',
          fieldErrors,
          message: err?.message ?? 'Unable to update the product.',
        };
        set(payload);
        toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
        return { success: false, ...payload };
      }
    },

    deleteProduct: async (id) => {
      set({ status: 'loading', fieldErrors: null, message: null });
      try {
        await productsApi.deleteProduct(id);
        set((state) => ({ products: state.products.filter((p) => p.id !== id), status: 'success' }));
        toastSuccess('Product deleted.');
        return { success: true };
      } catch (err) {
        const payload = {
          status: 'error',
          fieldErrors: null,
          message: err?.message ?? 'Unable to delete the product.',
        };
        set(payload);
        toastError(payload.message, false);
        return { success: false, ...payload };
      }
    },

    resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
  })
);

export default useProductsStore;
