import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useMeterReadingsStore from '../../store/meterReadingsStore';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import MeterHeader from './components/MeterHeader';
import MeterSummary from './components/MeterSummary';
import MeterTable from './components/MeterTable';
import MeterReadingModal from './components/MeterReadingModal';
import MeterDeleteDialog from './components/MeterDeleteDialog';

export default function MeterReadings() {
  const {
    readings,
    archivedReadings,
    status,
    viewMode,
    fetchReadings,
    fetchDeletedReadings,
    deleteReading,
    restoreMeterReading,
    permanentDeleteMeterReading,
    setViewMode,
  } = useMeterReadingsStore(
    useShallow((state) => ({
      readings: state.readings,
      archivedReadings: state.archivedReadings,
      status: state.status,
      viewMode: state.viewMode,
      fetchReadings: state.fetchReadings,
      fetchDeletedReadings: state.fetchDeletedReadings,
      deleteReading: state.deleteReading,
      restoreMeterReading: state.restoreMeterReading,
      permanentDeleteMeterReading: state.permanentDeleteMeterReading,
      setViewMode: state.setViewMode,
    }))
  );

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingReading, setEditingReading] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);

  useEffect(() => {
    if (status !== 'idle') return;
    if (viewMode === 'archived' && archivedReadings.length === 0) fetchDeletedReadings();
    if (viewMode === 'active' && readings.length === 0) fetchReadings();
  }, [readings.length, archivedReadings.length, status, viewMode, fetchReadings, fetchDeletedReadings]);

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

  const closeModal = () => setIsOpen(false);

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteReading(deleting.id);
    if (result.success) setDeleting(null);
  };

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreMeterReading(restoring.id);
    if (result.success) setRestoring(null);
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteMeterReading(permanentlyDeleting.id);
    if (result.success) setPermanentlyDeleting(null);
  };

  const isLoading = status === 'loading';
  const latest = viewMode === 'active' ? [...readings].sort((a, b) => b.reading_date.localeCompare(a.reading_date))[0] ?? null : null;
  const visibleReadings = viewMode === 'active' ? readings : archivedReadings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <MeterHeader viewMode={viewMode} onViewModeChange={setViewMode} onAdd={openAdd} />

      {viewMode === 'active' && isLoading && readings.length === 0 && <Skeleton height={80} className="!rounded mb-4" />}
      {viewMode === 'active' && <MeterSummary reading={latest} />}

      <MeterTable
        readings={visibleReadings}
        isLoading={isLoading}
        viewMode={viewMode}
        onEdit={openEdit}
        onDelete={setDeleting}
        onRestore={setRestoring}
        onPermanentDelete={setPermanentlyDeleting}
      />

      <MeterReadingModal isOpen={isOpen} onClose={closeModal} editingId={editingId} initialData={editingReading} />

      {viewMode === 'active' && (
        <MeterDeleteDialog reading={deleting} isLoading={isLoading} onClose={() => setDeleting(null)} onConfirm={handleDelete} />
      )}

      <ConfirmDialog
        isOpen={Boolean(restoring)}
        onClose={() => setRestoring(null)}
        onConfirm={handleRestore}
        title="Restore Meter Reading"
        message={restoring ? `Are you sure you want to restore the reading for ${restoring.reading_date}?` : ''}
        confirmLabel="Restore"
        cancelLabel="Cancel"
        confirmVariant="primary"
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(permanentlyDeleting)}
        onClose={() => setPermanentlyDeleting(null)}
        onConfirm={handlePermanentDelete}
        title="Permanently Delete Meter Reading"
        message={permanentlyDeleting ? `Are you sure you want to permanently delete the reading for ${permanentlyDeleting.reading_date}? This action cannot be undone.` : ''}
        confirmLabel="Permanently Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
