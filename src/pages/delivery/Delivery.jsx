import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useOrdersStore from '../../store/ordersStore';
import useFulfillmentStore from '../../store/fulfillmentStore';
import useSettingsStore from '../../store/settingsStore';
import { getNextStatus } from '../../domain/orderStatus';
import DeliveryHeader from './components/DeliveryHeader';
import KanbanBoard from './components/KanbanBoard';
import DeliveryTable from './components/DeliveryTable';
import DeliveryRecordModal from './components/DeliveryRecordModal';

export default function Delivery() {
  const { orders, status, fetchOrders } = useOrdersStore(
    useShallow((state) => ({
      orders: state.orders,
      status: state.status,
      fetchOrders: state.fetchOrders,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');
  const transitionOrderStatus = useFulfillmentStore((state) => state.transitionOrderStatus);
  const deleteOrder = useOrdersStore((state) => state.deleteOrder);

  useEffect(() => {
    if (orders.length === 0 && status === 'idle') {
      fetchOrders();
    }
  }, [orders.length, status, fetchOrders]);

  const [view, setView] = useState('kanban');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [recordingOrder, setRecordingOrder] = useState(null);

  const handleAdvance = async (order) => {
    const next = getNextStatus(order);
    if (next) await transitionOrderStatus(order.id, next);
  };

  const handleSkipDelivery = async (order) => {
    if (order.status === 'processing') {
      await handleAdvance(order);
    }
  };

  const handleArchive = async (order) => {
    await deleteOrder(order.id);
  };

  const openRecord = (order) => {
    setRecordingOrder(order);
    setIsRecordOpen(true);
  };

  const closeRecord = () => {
    setIsRecordOpen(false);
    setRecordingOrder(null);
  };

  const isLoading = status === 'loading';
  const deliveryOrders = orders.filter((order) => order.order_type === 'delivery');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DeliveryHeader view={view} onViewChange={setView} />

      {isLoading && orders.length === 0 && (
        <p className="text-sm text-slate-400">Loading orders…</p>
      )}

      {view === 'kanban' && (
        <KanbanBoard
          orders={orders}
          currency={currency}
          onAdvance={handleAdvance}
          onRecord={openRecord}
          onSkipDelivery={handleSkipDelivery}
          onArchive={handleArchive}
        />
      )}

      {view === 'list' && (
        <DeliveryTable
          deliveryOrders={deliveryOrders}
          currency={currency}
          onRecord={openRecord}
        />
      )}

      <DeliveryRecordModal
        isOpen={isRecordOpen}
        onClose={closeRecord}
        order={recordingOrder}
      />
    </div>
  );
}