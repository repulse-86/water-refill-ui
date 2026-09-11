import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useFulfillmentStore from '../../store/fulfillmentStore';
import useSettingsStore from '../../store/settingsStore';
import { getNextStatus } from '../../domain/orderStatus';
import DeliveryHeader from './components/DeliveryHeader';
import KanbanBoard from './components/KanbanBoard';
import DeliveryTable from './components/DeliveryTable';
import DeliveryRecordModal from './components/DeliveryRecordModal';

export default function Delivery() {
  const { board, status, fetchBoard, transitionOrderStatus, archiveOrder } = useFulfillmentStore(
    useShallow((state) => ({
      board: state.board,
      status: state.status,
      fetchBoard: state.fetchBoard,
      transitionOrderStatus: state.transitionOrderStatus,
      archiveOrder: state.archiveOrder,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  useEffect(() => {
    if (!board && status === 'idle') {
      fetchBoard();
    }
  }, [board, status, fetchBoard]);

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
    await archiveOrder(order.id);
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
  const deliveryOrders = board
    ? Object.values(board).flat().filter((order) => order.order_type === 'delivery')
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DeliveryHeader view={view} onViewChange={setView} />

      {isLoading && !board && (
        <div className="space-y-2">
          <Skeleton height={64} className="!rounded" />
          <Skeleton height={64} className="!rounded" />
          <Skeleton height={64} className="!rounded" />
        </div>
      )}

      {view === 'kanban' && board && (
        <KanbanBoard
          groupedOrders={board}
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
          isLoading={isLoading}
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
