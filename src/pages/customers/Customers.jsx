import { useEffect, useState, useCallback, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import useCustomersStore from '../../store/customersStore';
import CustomersHeader from './components/CustomersHeader';
import CustomersTable from './components/CustomersTable';
import CustomerFormModal from './components/CustomerFormModal';
import CustomerSettleModal from './components/CustomerSettleModal';
import CustomerDeleteDialog from './components/CustomerDeleteDialog';

export default function Customers() {
  const { customers, status, fetchCustomers, deleteCustomer, currentPage, perPage, totalItems, totalPages } =
    useCustomersStore(
      useShallow((state) => ({
        customers: state.customers,
        status: state.status,
        fetchCustomers: state.fetchCustomers,
        deleteCustomer: state.deleteCustomer,
        currentPage: state.currentPage,
        perPage: state.perPage,
        totalItems: state.totalItems,
        totalPages: state.totalPages,
      }))
    );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [settling, setSettling] = useState(null);
  const [search, setSearch] = useState('');
  const searchTimer = useRef(null);

  useEffect(() => {
    if (customers.length === 0 && status === 'idle') {
      fetchCustomers({ page: 1, size: perPage });
    }
  }, [customers.length, status, fetchCustomers, perPage]);

  const handlePageChange = useCallback((page) => {
    fetchCustomers({ page, size: perPage, search });
  }, [fetchCustomers, perPage, search]);

  const handlePageSizeChange = useCallback((size) => {
    fetchCustomers({ page: 1, size, search });
  }, [fetchCustomers, search]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchCustomers({ page: 1, size: perPage, search: value });
    }, 300);
  }, [fetchCustomers, perPage]);

  const openAdd = () => {
    setEditingId(null);
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setEditingCustomer(row);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openSettle = (row) => {
    setSettling(row);
  };

  const closeSettle = () => {
    setSettling(null);
  };

  const handleSettle = () => {
    setSettling(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const result = await deleteCustomer(deleting.id);
    if (result.success) {
      setDeleting(null);
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CustomersHeader onAdd={openAdd} />

      <CustomersTable
        customers={customers}
        isLoading={isLoading}
        onEdit={openEdit}
        onSettle={openSettle}
        onDelete={setDeleting}
        currentPage={currentPage}
        perPage={perPage}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        editingId={editingId}
        initialData={editingCustomer}
      />

      <CustomerSettleModal
        customer={settling}
        isOpen={Boolean(settling)}
        onClose={closeSettle}
        onSettle={handleSettle}
      />

      <CustomerDeleteDialog
        customer={deleting}
        isLoading={isLoading}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
