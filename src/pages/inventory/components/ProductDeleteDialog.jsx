import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function ProductDeleteDialog({ product, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(product)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Archive Product"
      message={product ? `Archive "${product.name}"? It will move to Archived and can be restored later.` : ''}
      confirmLabel="Archive"
      isLoading={isLoading}
    />
  );
}
