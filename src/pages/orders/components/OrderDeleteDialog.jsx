import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function OrderDeleteDialog({ order, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(order)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Archive Order"
      message={order ? `Archive order #${order.id}? It will move to Archived and can be restored later.` : ''}
      confirmLabel="Archive"
      isLoading={isLoading}
    />
  );
}
