import { useEffect, useState, useCallback, useRef } from 'react';
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
    status,
    viewMode,
    fetchProducts,
    fetchDeletedProducts,
    deleteProduct,
    restoreProduct,
    permanentDeleteProduct,
    setViewMode,
    currentPage,
    perPage,
    totalItems,
    totalPages,
  } = useProductsStore(
    useShallow((state) => ({
      products: state.products,
      status: state.status,
      viewMode: state.viewMode,
      fetchProducts: state.fetchProducts,
      fetchDeletedProducts: state.fetchDeletedProducts,
      deleteProduct: state.deleteProduct,
      restoreProduct: state.restoreProduct,
      permanentDeleteProduct: state.permanentDeleteProduct,
      setViewMode: state.setViewMode,
      currentPage: state.currentPage,
      perPage: state.perPage,
      totalItems: state.totalItems,
      totalPages: state.totalPages,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const searchTimer = useRef(null);

  useEffect(() => {
    if (products.length === 0 && status === 'idle') {
      if (viewMode === 'archived') {
        fetchDeletedProducts({ page: 1, size: perPage, search });
      } else {
        fetchProducts({ page: 1, size: perPage, search });
      }
    }
  }, [products.length, status, fetchProducts, fetchDeletedProducts, perPage, viewMode, search]);

  const handlePageChange = useCallback((page) => {
    if (viewMode === 'archived') {
      fetchDeletedProducts({ page, size: perPage, search });
    } else {
      fetchProducts({ page, size: perPage, search });
    }
  }, [fetchProducts, fetchDeletedProducts, perPage, search, viewMode]);

  const handlePageSizeChange = useCallback((size) => {
    if (viewMode === 'archived') {
      fetchDeletedProducts({ page: 1, size, search });
    } else {
      fetchProducts({ page: 1, size, search });
    }
  }, [fetchProducts, fetchDeletedProducts, search, viewMode]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (viewMode === 'archived') {
        fetchDeletedProducts({ page: 1, size: perPage, search: value });
      } else {
        fetchProducts({ page: 1, size: perPage, search: value });
      }
    }, 300);
  }, [fetchProducts, fetchDeletedProducts, perPage, viewMode]);

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

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteProduct(deleting.id);
    if (result.success) {
      setDeleting(null);
    }
  };

  const handleRestore = async () => {
    if (!restoring) return;
    const result = await restoreProduct(restoring.id);
    if (result.success) {
      setRestoring(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentlyDeleting) return;
    const result = await permanentDeleteProduct(permanentlyDeleting.id);
    if (result.success) {
      setPermanentlyDeleting(null);
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductsHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={openAdd}
      />

      <ProductsTable
        products={products}
        currency={currency}
        isLoading={isLoading}
        viewMode={viewMode}
        onEdit={openEdit}
        onDelete={setDeleting}
        onRestore={setRestoring}
        onPermanentDelete={setPermanentlyDeleting}
        currentPage={currentPage}
        perPage={perPage}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        searchValue={search}
        onSearchChange={handleSearchChange}
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
