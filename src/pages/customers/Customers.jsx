import { useEffect, useState } from 'react';
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
    archivedCustomers,
    status,
    viewMode,
    fetchCustomers,
    fetchDeletedCustomers,
    deleteCustomer,
    restoreCustomer,
    permanentDeleteCustomer,
    setViewMode,
  } = useCustomersStore(
    useShallow((state) => ({
      customers: state.customers,
      archivedCustomers: state.archivedCustomers,
      status: state.status,
      viewMode: state.viewMode,
      fetchCustomers: state.fetchCustomers,
      fetchDeletedCustomers: state.fetchDeletedCustomers,
      deleteCustomer: state.deleteCustomer,
      restoreCustomer: state.restoreCustomer,
      permanentDeleteCustomer: state.permanentDeleteCustomer,
      setViewMode: state.setViewMode,
    }))
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);
  const [settling, setSettling] = useState(null);

  useEffect(() => {
    if (status !== 'idle') return;
    if (viewMode === 'archived' && archivedCustomers.length === 0) fetchDeletedCustomers();
    if (viewMode === 'active' && customers.length === 0) fetchCustomers();
  }, [customers.length, archivedCustomers.length, status, viewMode, fetchCustomers, fetchDeletedCustomers]);

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

  const closeForm = () => setIsFormOpen(false);
  const openSettle = (row) => setSettling(row);
  const closeSettle = () => setSettling(null);
  const handleSettle = () => setSettling(null);

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteCustomer(deleting.id);
    if (result.success) setDeleting(null);
  };

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreCustomer(restoring.id);
    if (result.success) setRestoring(null);
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteCustomer(permanentlyDeleting.id);
    if (result.success) setPermanentlyDeleting(null);
  };

  const isLoading = status === 'loading';
  const visibleCustomers = viewMode === 'active' ? customers : archivedCustomers;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CustomersHeader viewMode={viewMode} onViewModeChange={setViewMode} onAdd={openAdd} />

      <CustomersTable
        customers={visibleCustomers}
        isLoading={isLoading}
        viewMode={viewMode}
        onEdit={openEdit}
        onSettle={openSettle}
        onDelete={setDeleting}
        onRestore={setRestoring}
        onPermanentDelete={setPermanentlyDeleting}
      />

      <CustomerFormModal isOpen={isFormOpen} onClose={closeForm} editingId={editingId} initialData={editingCustomer} />

      {viewMode === 'active' && (
        <CustomerSettleModal customer={settling} isOpen={Boolean(settling)} onClose={closeSettle} onSettle={handleSettle} />
      )}

      {viewMode === 'active' && (
        <CustomerDeleteDialog customer={deleting} isLoading={isLoading} onClose={() => setDeleting(null)} onConfirm={handleDelete} />
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
