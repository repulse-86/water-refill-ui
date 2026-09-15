import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function CustomerDeleteDialog({ customer, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(customer)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Archive Customer"
      message={customer ? `Archive "${customer.name}"? It will move to Archived and can be restored later.` : ''}
      confirmLabel="Archive"
      isLoading={isLoading}
    />
  );
}
