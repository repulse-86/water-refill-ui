import { useEffect, useState, useCallback, useRef } from 'react';
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
import MeterNotesModal from './components/MeterNotesModal';

export default function MeterReadings() {
  const {
    readings,
    status,
    viewMode,
    fetchReadings,
    fetchDeletedReadings,
    deleteReading,
    restoreMeterReading,
    permanentDeleteMeterReading,
    setViewMode,
    currentPage,
    perPage,
    totalItems,
    totalPages,
  } = useMeterReadingsStore(
    useShallow((state) => ({
      readings: state.readings,
      status: state.status,
      viewMode: state.viewMode,
      fetchReadings: state.fetchReadings,
      fetchDeletedReadings: state.fetchDeletedReadings,
      deleteReading: state.deleteReading,
      restoreMeterReading: state.restoreMeterReading,
      permanentDeleteMeterReading: state.permanentDeleteMeterReading,
      setViewMode: state.setViewMode,
      currentPage: state.currentPage,
      perPage: state.perPage,
      totalItems: state.totalItems,
      totalPages: state.totalPages,
    }))
  );

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingReading, setEditingReading] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);
  const [viewingNotes, setViewingNotes] = useState(null);
  const [search, setSearch] = useState('');
  const searchTimer = useRef(null);

  useEffect(() => {
    if (readings.length === 0 && status === 'idle') {
      if (viewMode === 'archived') {
        fetchDeletedReadings({ page: 1, size: perPage, search });
      } else {
        fetchReadings({ page: 1, size: perPage, search });
      }
    }
  }, [readings.length, status, fetchReadings, fetchDeletedReadings, perPage, viewMode, search]);

  const handlePageChange = useCallback((page) => {
    if (viewMode === 'archived') {
      fetchDeletedReadings({ page, size: perPage, search });
    } else {
      fetchReadings({ page, size: perPage, search });
    }
  }, [fetchReadings, fetchDeletedReadings, perPage, search, viewMode]);

  const handlePageSizeChange = useCallback((size) => {
    if (viewMode === 'archived') {
      fetchDeletedReadings({ page: 1, size, search });
    } else {
      fetchReadings({ page: 1, size, search });
    }
  }, [fetchReadings, fetchDeletedReadings, search, viewMode]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (viewMode === 'archived') {
        fetchDeletedReadings({ page: 1, size: perPage, search: value });
      } else {
        fetchReadings({ page: 1, size: perPage, search: value });
      }
    }, 300);
  }, [fetchReadings, fetchDeletedReadings, perPage, viewMode]);

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

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreMeterReading(restoring.id);
    if (result.success) {
      setRestoring(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteMeterReading(permanentlyDeleting.id);
    if (result.success) {
      setPermanentlyDeleting(null);
    }
  };

  const isLoading = status === 'loading';
  const latest = viewMode === 'active'
    ? [...readings].sort((a, b) => b.reading_date.localeCompare(a.reading_date))[0] ?? null
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <MeterHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={openAdd}
      />

      {viewMode === 'active' && isLoading && readings.length === 0 && (
        <Skeleton height={80} className="!rounded mb-4" />
      )}

      {viewMode === 'active' && <MeterSummary reading={latest} />}

      <MeterTable
        readings={readings}
        isLoading={isLoading}
        viewMode={viewMode}
        onEdit={openEdit}
        onDelete={setDeleting}
        onViewNotes={setViewingNotes}
        onRestore={setRestoring}
        onPermanentDelete={setPermanentlyDeleting}
        currentPage={currentPage}
        perPage={perPage}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      <MeterReadingModal
        isOpen={isOpen}
        onClose={closeModal}
        editingId={editingId}
        initialData={editingReading}
      />

      {viewMode === 'active' && (
        <MeterDeleteDialog
          reading={deleting}
          isLoading={isLoading}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}

      <MeterNotesModal
        isOpen={viewingNotes !== null}
        onClose={() => setViewingNotes(null)}
        reading={viewingNotes}
      />

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
