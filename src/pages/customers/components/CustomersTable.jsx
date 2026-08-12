import { Pencil, Trash2, Wallet } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import IconButton from '../../../components/ui/IconButton';
import Badge from '../../../components/ui/Badge';

const statusBadgeVariants = {
  active: 'green',
  inactive: 'slate',
};

export default function CustomersTable({ customers, onEdit, onSettle, onDelete }) {
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
        <div className="flex items-center gap-2">
          <IconButton icon={Wallet} onClick={() => onSettle(row)} title="Settle Ledger" variant="primary" />
          <IconButton icon={Pencil} onClick={() => onEdit(row)} title="Edit" variant="edit" />
          <IconButton icon={Trash2} onClick={() => onDelete(row)} title="Delete" variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={customers}
      searchKeys={['name', 'phone', 'email']}
      searchPlaceholder="Search customers…"
      emptyMessage="No customers found."
    />
  );
}
