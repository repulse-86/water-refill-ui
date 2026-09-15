import { Pencil, Trash2, Wallet, RotateCcw } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import RowActions from '../../../components/ui/RowActions';
import Badge from '../../../components/ui/Badge';
import { formatDateTime } from '../../../utils/date';

const statusBadgeVariants = {
  active: 'green',
  inactive: 'slate',
};

export default function CustomersTable({ customers, isLoading, viewMode = 'active', onEdit, onSettle, onDelete, onRestore, onPermanentDelete }) {
  const baseColumns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'subscriber_status', header: 'Status', render: (value) => <Badge variant={statusBadgeVariants[value]}>{value}</Badge> },
    { accessorKey: 'bottle_debt', header: 'Bottle Debt', render: (value) => <span className={Number(value) > 0 ? 'font-medium text-red-600' : ''}>{value}</span> },
    { accessorKey: 'outstanding_balance', header: 'Outstanding Balance', render: (value) => <span className={Number(value) > 0 ? 'font-medium text-red-600' : ''}>PHP {Number(value).toFixed(2)}</span> },
  ];

  const columns = [
    ...baseColumns,
    ...(viewMode === 'archived' ? [{ accessorKey: 'deleted_at', header: 'Archived', render: (value) => formatDateTime(value) }] : []),
    {
      accessorKey: '__actions',
      header: 'Actions',
      render: (_value, row) =>
        viewMode === 'archived' ? (
          <RowActions
            actions={[
              { icon: RotateCcw, label: 'Restore', variant: 'primary', onClick: () => onRestore(row) },
              { icon: Trash2, label: 'Permanent Delete', variant: 'danger', onClick: () => onPermanentDelete(row) },
            ]}
          />
        ) : (
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
