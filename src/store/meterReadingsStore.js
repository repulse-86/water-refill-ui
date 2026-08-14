import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as meterReadingsApi from '../api/meterReadings';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';

export const meterReadingRules = {
  reading_date: {
    required: 'The reading date field is required.',
  },
  meter_value: {
    required: 'The meter value field is required.',
    min: { value: 0, message: 'The meter value must be a positive number.' },
    valueAsNumber: true,
  },
};

const initialState = {
  readings: [],
  status: 'idle',
  fieldErrors: null,
  message: null,
};

const useMeterReadingsStore = create(
  persist(
    (set) => ({
      ...initialState,

      fetchReadings: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const readings = await meterReadingsApi.listMeterReadings();
          set({ readings, status: 'idle' });
          return { success: true, readings };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to load meter readings.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      createReading: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const reading = await meterReadingsApi.createMeterReading(values);
          set((state) => ({ readings: [reading, ...state.readings], status: 'success' }));
          toastSuccess('Meter reading recorded.');
          return { success: true, reading };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to create the meter reading.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      updateReading: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await meterReadingsApi.updateMeterReading(id, values);
          set((state) => ({
            readings: state.readings.map((r) => (r.id === id ? updated : r)),
            status: 'success',
          }));
          toastSuccess('Meter reading updated.');
          return { success: true, reading: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = {
            status: 'error',
            fieldErrors,
            message: err?.message ?? 'Unable to update the meter reading.',
          };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      deleteReading: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await meterReadingsApi.deleteMeterReading(id);
          set((state) => ({ readings: state.readings.filter((r) => r.id !== id), status: 'success' }));
          toastSuccess('Meter reading deleted.');
          return { success: true };
        } catch (err) {
          const payload = {
            status: 'error',
            fieldErrors: null,
            message: err?.message ?? 'Unable to delete the meter reading.',
          };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      resetErrors: () => set({ status: 'idle', fieldErrors: null, message: null }),
    }),
    {
      name: 'water-refill-meter-readings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ readings: state.readings }),
    }
  )
);

export default useMeterReadingsStore;
