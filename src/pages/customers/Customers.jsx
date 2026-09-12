import { useEffect, useState, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import useCustomersStore from '../../store/customersStore';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CustomersHeader from './components/CustomersHeader';
import CustomersTable from './components/CustomersTable';
import CustomerFormModal from './components/CustomerFormModal';
import CustomerSettleModal from './components/CustomerSettleModal';
import CustomerDeleteDialog from './components/CustomerDeleteDialog';

export default function Customers() {
  const {
    customers,
    status,
    viewMode,
    fetchCustomers,
    fetchDeletedCustomers,
    deleteCustomer,
    restoreCustomer,
    permanentDeleteCustomer,
    setViewMode,
    currentPage,
    perPage,
    totalItems,
    totalPages,
  } = useCustomersStore(
    useShallow((state) => ({
      customers: state.customers,
      status: state.status,
      viewMode: state.viewMode,
      fetchCustomers: state.fetchCustomers,
      fetchDeletedCustomers: state.fetchDeletedCustomers,
      deleteCustomer: state.deleteCustomer,
      restoreCustomer: state.restoreCustomer,
      permanentDeleteCustomer: state.permanentDeleteCustomer,
      setViewMode: state.setViewMode,
      currentPage: state.currentPage,
      perPage: state.perPage,
      totalItems: state.totalItems,
      totalPages: state.totalPages,
    }))
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);
  const [settling, setSettling] = useState(null);
  const [search, setSearch] = useState('');
  const searchTimer = useRef(null);

  useEffect(() => {
    if (customers.length === 0 && status === 'idle') {
      if (viewMode === 'archived') {
        fetchDeletedCustomers({ page: 1, size: perPage, search });
      } else {
        fetchCustomers({ page: 1, size: perPage, search });
      }
    }
  }, [customers.length, status, fetchCustomers, fetchDeletedCustomers, perPage, viewMode, search]);

  const handlePageChange = useCallback((page) => {
    if (viewMode === 'archived') {
      fetchDeletedCustomers({ page, size: perPage, search });
    } else {
      fetchCustomers({ page, size: perPage, search });
    }
  }, [fetchCustomers, fetchDeletedCustomers, perPage, search, viewMode]);

  const handlePageSizeChange = useCallback((size) => {
    if (viewMode === 'archived') {
      fetchDeletedCustomers({ page: 1, size, search });
    } else {
      fetchCustomers({ page: 1, size, search });
    }
  }, [fetchCustomers, fetchDeletedCustomers, search, viewMode]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (viewMode === 'archived') {
        fetchDeletedCustomers({ page: 1, size: perPage, search: value });
      } else {
        fetchCustomers({ page: 1, size: perPage, search: value });
      }
    }, 300);
  }, [fetchCustomers, fetchDeletedCustomers, perPage, viewMode]);

  const openAdd = () => {
    setEditingId(null);
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setEditingCustomer(row);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openSettle = (row) => {
    setSettling(row);
  };

  const closeSettle = () => {
    setSettling(null);
  };

  const handleSettle = () => {
    setSettling(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteCustomer(deleting.id);
    if (result.success) {
      setDeleting(null);
    }
  };

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreCustomer(restoring.id);
    if (result.success) {
      setRestoring(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteCustomer(permanentlyDeleting.id);
    if (result.success) {
      setPermanentlyDeleting(null);
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CustomersHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={openAdd}
      />

      <CustomersTable
        customers={customers}
        isLoading={isLoading}
        viewMode={viewMode}
        onEdit={openEdit}
        onSettle={openSettle}
        onDelete={setDeleting}
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

      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        editingId={editingId}
        initialData={editingCustomer}
      />

      {viewMode === 'active' && (
        <CustomerSettleModal
          customer={settling}
          isOpen={Boolean(settling)}
          onClose={closeSettle}
          onSettle={handleSettle}
        />
      )}

      {viewMode === 'active' && (
        <CustomerDeleteDialog
          customer={deleting}
          isLoading={isLoading}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(restoring)}
        onClose={() => setRestoring(null)}
        onConfirm={handleRestore}
        title="Restore Customer"
        message={restoring ? `Are you sure you want to restore "${restoring.name}"?` : ''}
        confirmLabel="Restore"
        cancelLabel="Cancel"
        confirmVariant="primary"
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(permanentlyDeleting)}
        onClose={() => setPermanentlyDeleting(null)}
        onConfirm={handlePermanentDelete}
        title="Permanently Delete Customer"
        message={permanentlyDeleting ? `Are you sure you want to permanently delete "${permanentlyDeleting.name}"? This action cannot be undone.` : ''}
        confirmLabel="Permanently Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
