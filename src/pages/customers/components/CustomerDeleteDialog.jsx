import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function CustomerDeleteDialog({ customer, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(customer)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Customer"
      message={customer ? `Are you sure you want to delete "${customer.name}"? This action cannot be undone.` : ''}
      isLoading={isLoading}
    />
  );
}
