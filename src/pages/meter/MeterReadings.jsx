import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useMeterReadingsStore from '../../store/meterReadingsStore';
import MeterHeader from './components/MeterHeader';
import MeterSummary from './components/MeterSummary';
import MeterTable from './components/MeterTable';
import MeterReadingModal from './components/MeterReadingModal';
import MeterDeleteDialog from './components/MeterDeleteDialog';

export default function MeterReadings() {
  const { readings, status, message, fieldErrors, fetchReadings, deleteReading } =
    useMeterReadingsStore(
      useShallow((state) => ({
        readings: state.readings,
        status: state.status,
        message: state.message,
        fieldErrors: state.fieldErrors,
        fetchReadings: state.fetchReadings,
        deleteReading: state.deleteReading,
      }))
    );

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingReading, setEditingReading] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (readings.length === 0 && status === 'idle') {
      fetchReadings();
    }
  }, [readings.length, status, fetchReadings]);

  const openAdd = () => {
    setEditingId(null);
    setEditingReading(null);
    setIsOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setEditingReading(row);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteReading(deleting.id);
    if (result.success) {
      setDeleting(null);
    }
  };

  const isLoading = status === 'loading';
  const hasError = status === 'error' && message;
  const latest = [...readings].sort((a, b) => b.reading_date.localeCompare(a.reading_date))[0] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <MeterHeader onAdd={openAdd} />

      {hasError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {message}
          {fieldErrors && <pre className="mt-2 text-[10px]">{JSON.stringify(fieldErrors, null, 2)}</pre>}
        </div>
      )}

      {isLoading && readings.length === 0 && (
        <p className="text-sm text-slate-400">Loading meter readings…</p>
      )}

      <MeterSummary reading={latest} />

      <MeterTable readings={readings} onEdit={openEdit} onDelete={setDeleting} />

      <MeterReadingModal
        isOpen={isOpen}
        onClose={closeModal}
        editingId={editingId}
        initialData={editingReading}
      />

      <MeterDeleteDialog
        reading={deleting}
        isLoading={isLoading}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
