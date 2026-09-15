import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as meterReadingsApi from '../api/meterReadings';
import { toFieldErrors } from '../utils/formErrors';
import { toastError, toastSuccess } from '../utils/toast';

export const meterReadingRules = {
  reading_date: { required: 'The reading date field is required.' },
  meter_value: {
    required: 'The meter value field is required.',
    min: { value: 0, message: 'The meter value must be a positive number.' },
    valueAsNumber: true,
  },
};

const initialState = {
  readings: [],
  archivedReadings: [],
  status: 'idle',
  fieldErrors: null,
  message: null,
  viewMode: 'active',
};

const useMeterReadingsStore = create(
  persist(
    (set) => ({
      ...initialState,

      fetchReadings: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const readings = await meterReadingsApi.listMeterReadings();
          set({ readings, status: 'idle', viewMode: 'active' });
          return { success: true, readings };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to load meter readings.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      fetchDeletedReadings: async () => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const archivedReadings = await meterReadingsApi.listDeletedMeterReadings();
          set({ archivedReadings, status: 'idle', viewMode: 'archived' });
          return { success: true, archivedReadings };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to load archived meter readings.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      createReading: async (values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const reading = await meterReadingsApi.createMeterReading(values);
          set((state) => ({ readings: [reading, ...state.readings], status: 'success', viewMode: 'active' }));
          toastSuccess('Meter reading recorded.');
          return { success: true, reading };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to create the meter reading.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      updateReading: async (id, values) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const updated = await meterReadingsApi.updateMeterReading(id, values);
          set((state) => ({ readings: state.readings.map((reading) => (reading.id === id ? updated : reading)), status: 'success' }));
          toastSuccess('Meter reading updated.');
          return { success: true, reading: updated };
        } catch (err) {
          const fieldErrors = toFieldErrors(err?.errors);
          const payload = { status: 'error', fieldErrors, message: err?.message ?? 'Unable to update the meter reading.' };
          set(payload);
          toastError(payload.message, Object.keys(fieldErrors ?? {}).length > 0);
          return { success: false, ...payload };
        }
      },

      deleteReading: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await meterReadingsApi.deleteMeterReading(id);
          set((state) => {
            const reading = state.readings.find((item) => item.id === id);
            return {
              readings: state.readings.filter((item) => item.id !== id),
              archivedReadings: reading ? [{ ...reading, deleted_at: new Date().toISOString() }, ...state.archivedReadings] : state.archivedReadings,
              status: 'success',
            };
          });
          toastSuccess('Meter reading archived.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to archive the meter reading.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      restoreMeterReading: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          const restored = await meterReadingsApi.restoreMeterReading(id);
          set((state) => ({
            archivedReadings: state.archivedReadings.filter((item) => item.id !== id),
            readings: [restored, ...state.readings],
            status: 'success',
          }));
          toastSuccess('Meter reading restored.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to restore the meter reading.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      permanentDeleteMeterReading: async (id) => {
        set({ status: 'loading', fieldErrors: null, message: null });
        try {
          await meterReadingsApi.permanentDeleteMeterReading(id);
          set((state) => ({ archivedReadings: state.archivedReadings.filter((item) => item.id !== id), status: 'success' }));
          toastSuccess('Meter reading permanently deleted.');
          return { success: true };
        } catch (err) {
          const payload = { status: 'error', fieldErrors: null, message: err?.message ?? 'Unable to permanently delete the meter reading.' };
          set(payload);
          toastError(payload.message, false);
          return { success: false, ...payload };
        }
      },

      setViewMode: (mode) => set({ viewMode: mode, status: 'idle', fieldErrors: null, message: null }),
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
