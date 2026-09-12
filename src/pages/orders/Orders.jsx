import { useEffect, useState, useCallback, useRef } from 'react';
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
    status,
    viewMode,
    fetchOrders,
    fetchDeletedOrders,
    deleteOrder,
    restoreOrder,
    permanentDeleteOrder,
    setViewMode,
    currentPage,
    perPage,
    totalItems,
    totalPages,
  } = useOrdersStore(
    useShallow((state) => ({
      orders: state.orders,
      status: state.status,
      viewMode: state.viewMode,
      fetchOrders: state.fetchOrders,
      fetchDeletedOrders: state.fetchDeletedOrders,
      deleteOrder: state.deleteOrder,
      restoreOrder: state.restoreOrder,
      permanentDeleteOrder: state.permanentDeleteOrder,
      setViewMode: state.setViewMode,
      currentPage: state.currentPage,
      perPage: state.perPage,
      totalItems: state.totalItems,
      totalPages: state.totalPages,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const searchTimer = useRef(null);

  useEffect(() => {
    if (orders.length === 0 && status === 'idle') {
      if (viewMode === 'archived') {
        fetchDeletedOrders({ page: 1, size: perPage, search });
      } else {
        fetchOrders({ page: 1, size: perPage, search });
      }
    }
  }, [orders.length, status, fetchOrders, fetchDeletedOrders, perPage, viewMode, search]);

  const handlePageChange = useCallback((page) => {
    if (viewMode === 'archived') {
      fetchDeletedOrders({ page, size: perPage, search });
    } else {
      fetchOrders({ page, size: perPage, search });
    }
  }, [fetchOrders, fetchDeletedOrders, perPage, search, viewMode]);

  const handlePageSizeChange = useCallback((size) => {
    if (viewMode === 'archived') {
      fetchDeletedOrders({ page: 1, size, search });
    } else {
      fetchOrders({ page: 1, size, search });
    }
  }, [fetchOrders, fetchDeletedOrders, search, viewMode]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (viewMode === 'archived') {
        fetchDeletedOrders({ page: 1, size: perPage, search: value });
      } else {
        fetchOrders({ page: 1, size: perPage, search: value });
      }
    }, 300);
  }, [fetchOrders, fetchDeletedOrders, perPage, viewMode]);

  const openAdd = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const openEdit = (row) => {
    setEditingOrder(row);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openView = (row) => {
    setViewingOrder(row);
  };

  const closeView = () => {
    setViewingOrder(null);
  };

  const handleAdvance = () => {
    setViewingOrder(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteOrder(deleting.id);
    if (result.success) {
      setDeleting(null);
    }
  };

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreOrder(restoring.id);
    if (result.success) {
      setRestoring(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteOrder(permanentlyDeleting.id);
    if (result.success) {
      setPermanentlyDeleting(null);
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <OrdersHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={openAdd}
      />

      <OrdersTable
        orders={orders}
        currency={currency}
        isLoading={isLoading}
        viewMode={viewMode}
        onView={openView}
        onEdit={openEdit}
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

      <OrderFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        editingId={editingOrder?.id}
        initialData={editingOrder}
      />

      <OrderDetailModal
        order={viewingOrder}
        isOpen={Boolean(viewingOrder)}
        onClose={closeView}
        onAdvance={handleAdvance}
      />

      {viewMode === 'active' && (
        <OrderDeleteDialog
          order={deleting}
          isLoading={isLoading}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
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
