import { useEffect, useState, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import useOrdersStore from '../../store/ordersStore';
import useSettingsStore from '../../store/settingsStore';
import OrdersHeader from './components/OrdersHeader';
import OrdersTable from './components/OrdersTable';
import OrderFormModal from './components/OrderFormModal';
import OrderDetailModal from './components/OrderDetailModal';
import OrderDeleteDialog from './components/OrderDeleteDialog';

export default function Orders() {
  const { orders, status, fetchOrders, deleteOrder, currentPage, perPage, totalItems, totalPages } =
    useOrdersStore(
      useShallow((state) => ({
        orders: state.orders,
        status: state.status,
        fetchOrders: state.fetchOrders,
        deleteOrder: state.deleteOrder,
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
  const [search, setSearch] = useState('');
  const searchTimer = useRef(null);

  useEffect(() => {
    if (orders.length === 0 && status === 'idle') {
      fetchOrders({ page: 1, size: perPage });
    }
  }, [orders.length, status, fetchOrders, perPage]);

  const handlePageChange = useCallback((page) => {
    fetchOrders({ page, size: perPage, search });
  }, [fetchOrders, perPage, search]);

  const handlePageSizeChange = useCallback((size) => {
    fetchOrders({ page: 1, size, search });
  }, [fetchOrders, search]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchOrders({ page: 1, size: perPage, search: value });
    }, 300);
  }, [fetchOrders, perPage]);

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

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <OrdersHeader onAdd={openAdd} />

      <OrdersTable
        orders={orders}
        currency={currency}
        isLoading={isLoading}
        onView={openView}
        onEdit={openEdit}
        onDelete={setDeleting}
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

      <OrderDeleteDialog
        order={deleting}
        isLoading={isLoading}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
