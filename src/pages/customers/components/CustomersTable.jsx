import { Pencil, Trash2, Wallet } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import RowActions from '../../../components/ui/RowActions';
import Badge from '../../../components/ui/Badge';

const statusBadgeVariants = {
  active: 'green',
  inactive: 'slate',
};

export default function CustomersTable({ customers, isLoading, onEdit, onSettle, onDelete }) {
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'subscriber_status',
      header: 'Status',
      render: (value) => <Badge variant={statusBadgeVariants[value]}>{value}</Badge>,
    },
    {
      accessorKey: 'bottle_debt',
      header: 'Bottle Debt',
      render: (value) => (
        <span className={Number(value) > 0 ? 'font-medium text-red-600' : ''}>{value}</span>
      ),
    },
    {
      accessorKey: 'outstanding_balance',
      header: 'Outstanding Balance',
      render: (value, row) => (
        <span className={Number(value) > 0 ? 'font-medium text-red-600' : ''}>
          PHP {Number(value).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      render: (_value, row) => (
        <RowActions
          actions={[
            { icon: Wallet, label: 'Settle Ledger', variant: 'primary', onClick: () => onSettle(row) },
            { icon: Pencil, label: 'Edit', variant: 'edit', onClick: () => onEdit(row) },
            { icon: Trash2, label: 'Delete', variant: 'danger', onClick: () => onDelete(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={customers}
      isLoading={isLoading}
      searchKeys={['name', 'phone', 'email']}
      searchPlaceholder="Search customers…"
      emptyMessage="No customers found."
    />
  );
}
