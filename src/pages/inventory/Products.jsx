import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useProductsStore from '../../store/productsStore';
import useSettingsStore from '../../store/settingsStore';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProductsHeader from './components/ProductsHeader';
import ProductsTable from './components/ProductsTable';
import ProductFormModal from './components/ProductFormModal';
import ProductDeleteDialog from './components/ProductDeleteDialog';

export default function Products() {
  const {
    products,
    archivedProducts,
    status,
    viewMode,
    fetchProducts,
    fetchDeletedProducts,
    deleteProduct,
    restoreProduct,
    permanentDeleteProduct,
    setViewMode,
  } = useProductsStore(
    useShallow((state) => ({
      products: state.products,
      archivedProducts: state.archivedProducts,
      status: state.status,
      viewMode: state.viewMode,
      fetchProducts: state.fetchProducts,
      fetchDeletedProducts: state.fetchDeletedProducts,
      deleteProduct: state.deleteProduct,
      restoreProduct: state.restoreProduct,
      permanentDeleteProduct: state.permanentDeleteProduct,
      setViewMode: state.setViewMode,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);

  useEffect(() => {
    if (status !== 'idle') return;
    if (viewMode === 'archived' && archivedProducts.length === 0) {
      fetchDeletedProducts();
    }
    if (viewMode === 'active' && products.length === 0) {
      fetchProducts();
    }
  }, [products.length, archivedProducts.length, status, viewMode, fetchProducts, fetchDeletedProducts]);

  const openAdd = () => {
    setEditingId(null);
    setEditingProduct(null);
    setIsOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setEditingProduct(row);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteProduct(deleting.id);
    if (result.success) setDeleting(null);
  };

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreProduct(restoring.id);
    if (result.success) setRestoring(null);
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteProduct(permanentlyDeleting.id);
    if (result.success) setPermanentlyDeleting(null);
  };

  const isLoading = status === 'loading';
  const visibleProducts = viewMode === 'active' ? products : archivedProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductsHeader viewMode={viewMode} onViewModeChange={setViewMode} onAdd={openAdd} />

      <ProductsTable
        products={visibleProducts}
        currency={currency}
        isLoading={isLoading}
        viewMode={viewMode}
        onEdit={openEdit}
        onDelete={setDeleting}
        onRestore={setRestoring}
        onPermanentDelete={setPermanentlyDeleting}
      />

      <ProductFormModal
        isOpen={isOpen}
        onClose={closeModal}
        editingId={editingId}
        initialData={editingProduct}
        products={products}
      />

      {viewMode === 'active' && (
        <ProductDeleteDialog
          product={deleting}
          isLoading={isLoading}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(restoring)}
        onClose={() => setRestoring(null)}
        onConfirm={handleRestore}
        title="Restore Product"
        message={restoring ? `Are you sure you want to restore "${restoring.name}"?` : ''}
        confirmLabel="Restore"
        cancelLabel="Cancel"
        confirmVariant="primary"
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(permanentlyDeleting)}
        onClose={() => setPermanentlyDeleting(null)}
        onConfirm={handlePermanentDelete}
        title="Permanently Delete Product"
        message={permanentlyDeleting ? `Are you sure you want to permanently delete "${permanentlyDeleting.name}"? This action cannot be undone.` : ''}
        confirmLabel="Permanently Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
