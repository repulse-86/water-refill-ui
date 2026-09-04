import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useProductsStore from '../../store/productsStore';
import useSettingsStore from '../../store/settingsStore';
import ProductsHeader from './components/ProductsHeader';
import ProductsTable from './components/ProductsTable';
import ProductFormModal from './components/ProductFormModal';
import ProductDeleteDialog from './components/ProductDeleteDialog';

export default function Products() {
  const { products, status, fetchProducts, deleteProduct } =
    useProductsStore(
      useShallow((state) => ({
        products: state.products,
        status: state.status,
        fetchProducts: state.fetchProducts,
        deleteProduct: state.deleteProduct,
      }))
    );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (products.length === 0 && status === 'idle') {
      fetchProducts();
    }
  }, [products.length, status, fetchProducts]);

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

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductsHeader onAdd={openAdd} />

      <ProductsTable products={products} currency={currency} isLoading={isLoading} onEdit={openEdit} onDelete={setDeleting} />

      <ProductFormModal
        isOpen={isOpen}
        onClose={closeModal}
        editingId={editingId}
        initialData={editingProduct}
      />

      <ProductDeleteDialog
        product={deleting}
        isLoading={isLoading}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}