import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useOrdersStore from '../../store/ordersStore';
import useSettingsStore from '../../store/settingsStore';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import OrdersHeader from './components/OrdersHeader';
import OrdersTable from './components/OrdersTable';
import OrderFormModal from './components/OrderFormModal';
import OrderDetailModal from './components/OrderDetailModal';
import OrderDeleteDialog from './components/OrderDeleteDialog';

export default function Orders() {
  const {
    orders,
    archivedOrders,
    status,
    viewMode,
    fetchOrders,
    fetchDeletedOrders,
    deleteOrder,
    restoreOrder,
    permanentDeleteOrder,
    setViewMode,
  } = useOrdersStore(
    useShallow((state) => ({
      orders: state.orders,
      archivedOrders: state.archivedOrders,
      status: state.status,
      viewMode: state.viewMode,
      fetchOrders: state.fetchOrders,
      fetchDeletedOrders: state.fetchDeletedOrders,
      deleteOrder: state.deleteOrder,
      restoreOrder: state.restoreOrder,
      permanentDeleteOrder: state.permanentDeleteOrder,
      setViewMode: state.setViewMode,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);

  useEffect(() => {
    if (status !== 'idle') return;
    if (viewMode === 'archived' && archivedOrders.length === 0) fetchDeletedOrders();
    if (viewMode === 'active' && orders.length === 0) fetchOrders();
  }, [orders.length, archivedOrders.length, status, viewMode, fetchOrders, fetchDeletedOrders]);

  const openAdd = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const openEdit = (row) => {
    setEditingOrder(row);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);
  const openView = (row) => setViewingOrder(row);
  const closeView = () => setViewingOrder(null);
  const handleAdvance = () => setViewingOrder(null);

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteOrder(deleting.id);
    if (result.success) setDeleting(null);
  };

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreOrder(restoring.id);
    if (result.success) setRestoring(null);
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteOrder(permanentlyDeleting.id);
    if (result.success) setPermanentlyDeleting(null);
  };

  const isLoading = status === 'loading';
  const visibleOrders = viewMode === 'active' ? orders : archivedOrders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <OrdersHeader viewMode={viewMode} onViewModeChange={setViewMode} onAdd={openAdd} />

      <OrdersTable
        orders={visibleOrders}
        currency={currency}
        isLoading={isLoading}
        viewMode={viewMode}
        onView={openView}
        onEdit={openEdit}
        onDelete={setDeleting}
        onRestore={setRestoring}
        onPermanentDelete={setPermanentlyDeleting}
      />

      <OrderFormModal isOpen={isFormOpen} onClose={closeForm} editingId={editingOrder?.id} initialData={editingOrder} />

      <OrderDetailModal order={viewingOrder} isOpen={Boolean(viewingOrder)} onClose={closeView} onAdvance={handleAdvance} />

      {viewMode === 'active' && (
        <OrderDeleteDialog order={deleting} isLoading={isLoading} onClose={() => setDeleting(null)} onConfirm={handleDelete} />
      )}

      <ConfirmDialog
        isOpen={Boolean(restoring)}
        onClose={() => setRestoring(null)}
        onConfirm={handleRestore}
        title="Restore Order"
        message={restoring ? `Are you sure you want to restore order #${restoring.id}?` : ''}
        confirmLabel="Restore"
        cancelLabel="Cancel"
        confirmVariant="primary"
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(permanentlyDeleting)}
        onClose={() => setPermanentlyDeleting(null)}
        onConfirm={handlePermanentDelete}
        title="Permanently Delete Order"
        message={permanentlyDeleting ? `Are you sure you want to permanently delete order #${permanentlyDeleting.id}? This action cannot be undone.` : ''}
        confirmLabel="Permanently Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
