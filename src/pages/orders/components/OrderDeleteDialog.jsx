import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function OrderDeleteDialog({ order, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(order)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Order"
      message={order ? `Are you sure you want to delete order #${order.id}? This action cannot be undone.` : ''}
      isLoading={isLoading}
    />
  );
}
