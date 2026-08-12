import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useCustomersStore from '../../store/customersStore';
import CustomersHeader from './components/CustomersHeader';
import CustomersTable from './components/CustomersTable';
import CustomerFormModal from './components/CustomerFormModal';
import CustomerSettleModal from './components/CustomerSettleModal';
import CustomerDeleteDialog from './components/CustomerDeleteDialog';

export default function Customers() {
  const { customers, status, fetchCustomers, createCustomer, updateCustomer, deleteCustomer, settleCustomer } =
    useCustomersStore(
      useShallow((state) => ({
        customers: state.customers,
        status: state.status,
        fetchCustomers: state.fetchCustomers,
        createCustomer: state.createCustomer,
        updateCustomer: state.updateCustomer,
        deleteCustomer: state.deleteCustomer,
        settleCustomer: state.settleCustomer,
      }))
    );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [settling, setSettling] = useState(null);

  useEffect(() => {
    if (customers.length === 0 && status === 'idle') {
      fetchCustomers();
    }
  }, [customers.length, status, fetchCustomers]);

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

  const handleSettle = (updatedCustomer) => {
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
        onEdit={openEdit}
        onSettle={openSettle}
        onDelete={setDeleting}
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
