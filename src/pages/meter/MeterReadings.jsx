import { useEffect, useState, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useMeterReadingsStore from '../../store/meterReadingsStore';
import MeterHeader from './components/MeterHeader';
import MeterSummary from './components/MeterSummary';
import MeterTable from './components/MeterTable';
import MeterReadingModal from './components/MeterReadingModal';
import MeterDeleteDialog from './components/MeterDeleteDialog';
import MeterNotesModal from './components/MeterNotesModal';

export default function MeterReadings() {
  const { readings, status, fetchReadings, deleteReading, currentPage, perPage, totalItems, totalPages } =
    useMeterReadingsStore(
      useShallow((state) => ({
        readings: state.readings,
        status: state.status,
        fetchReadings: state.fetchReadings,
        deleteReading: state.deleteReading,
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
  const [viewingNotes, setViewingNotes] = useState(null);
  const [search, setSearch] = useState('');
  const searchTimer = useRef(null);

  useEffect(() => {
    if (readings.length === 0 && status === 'idle') {
      fetchReadings({ page: 1, size: perPage });
    }
  }, [readings.length, status, fetchReadings, perPage]);

  const handlePageChange = useCallback((page) => {
    fetchReadings({ page, size: perPage, search });
  }, [fetchReadings, perPage, search]);

  const handlePageSizeChange = useCallback((size) => {
    fetchReadings({ page: 1, size, search });
  }, [fetchReadings, search]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchReadings({ page: 1, size: perPage, search: value });
    }, 300);
  }, [fetchReadings, perPage]);

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
  const latest = [...readings].sort((a, b) => b.reading_date.localeCompare(a.reading_date))[0] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <MeterHeader onAdd={openAdd} />

      {isLoading && readings.length === 0 && (
        <Skeleton height={80} className="!rounded mb-4" />
      )}

      <MeterSummary reading={latest} />

      <MeterTable
        readings={readings}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={setDeleting}
        onViewNotes={setViewingNotes}
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

      <MeterDeleteDialog
        reading={deleting}
        isLoading={isLoading}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />

      <MeterNotesModal
        isOpen={viewingNotes !== null}
        onClose={() => setViewingNotes(null)}
        reading={viewingNotes}
      />
    </div>
  );
}
