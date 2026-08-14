import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useOrdersStore from '../../store/ordersStore';
import useSettingsStore from '../../store/settingsStore';
import OrdersHeader from './components/OrdersHeader';
import OrdersTable from './components/OrdersTable';
import OrderFormModal from './components/OrderFormModal';
import OrderDetailModal from './components/OrderDetailModal';
import OrderDeleteDialog from './components/OrderDeleteDialog';

export default function Orders() {
  const { orders, status, fetchOrders, deleteOrder } =
    useOrdersStore(
      useShallow((state) => ({
        orders: state.orders,
        status: state.status,
        fetchOrders: state.fetchOrders,
        deleteOrder: state.deleteOrder,
      }))
    );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (orders.length === 0 && status === 'idle') {
      fetchOrders();
    }
  }, [orders.length, status, fetchOrders]);

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
