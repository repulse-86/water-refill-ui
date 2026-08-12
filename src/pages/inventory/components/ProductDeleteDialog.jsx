import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function ProductDeleteDialog({ product, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(product)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Product"
      message={product ? `Are you sure you want to delete "${product.name}"? This action cannot be undone.` : ''}
      isLoading={isLoading}
    />
  );
}