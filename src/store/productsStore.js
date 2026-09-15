import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as productsApi from '../api/products';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';

export const productRules = {
  name: { required: 'The name field is required.' },
  type: { required: 'The type field is required.' },
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
  archivedProducts: [],
  status: 'idle',
  fieldErrors: null,
  message: null,
  viewMode: 'active',
};

const useProductsStore = create(
  persist(
    (set) => ({
      ...initialState,

      fetchProducts: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const products = await productsApi.listProducts();
          set({ products, status: 'idle', viewMode: 'active' });
          return { success: true, products };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to load products.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      fetchDeletedProducts: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const archivedProducts = await productsApi.listDeletedProducts();
          set({ archivedProducts, status: 'idle', viewMode: 'archived' });
          return { success: true, archivedProducts };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to load archived products.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      createProduct: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const product = await productsApi.createProduct(values);
          set((state) => ({ products: [...state.products, product], status: 'success', viewMode: 'active' }));
          toastSuccess('Product created.');
          return { success: true, product };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to create the product.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      updateProduct: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await productsApi.updateProduct(id, values);
          set((state) => ({ products: state.products.map((product) => (product.id === id ? updated : product)), status: 'success' }));
          toastSuccess('Product updated.');
          return { success: true, product: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to update the product.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      deleteProduct: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await productsApi.deleteProduct(id);
          set((state) => {
            const product = state.products.find((item) => item.id === id);
            return {
              products: state.products.filter((item) => item.id !== id),
              archivedProducts: product ? [{ ...product, deleted_at: new Date().toISOString() }, ...state.archivedProducts] : state.archivedProducts,
              status: 'success',
            };
          });
          toastSuccess('Product archived.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to archive the product.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      restoreProduct: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const restored = await productsApi.restoreProduct(id);
          set((state) => ({
            archivedProducts: state.archivedProducts.filter((item) => item.id !== id),
            products: [restored, ...state.products],
            status: 'success',
            viewMode: 'active',
          }));
          toastSuccess('Product restored.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to restore the product.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      permanentDeleteProduct: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await productsApi.permanentDeleteProduct(id);
          set((state) => ({ archivedProducts: state.archivedProducts.filter((item) => item.id !== id), status: 'success' }));
          toastSuccess('Product permanently deleted.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to permanently delete the product.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      setViewMode: (mode) => set({ viewMode: mode, status: 'idle', fieldErrors: null, message: null }),
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
