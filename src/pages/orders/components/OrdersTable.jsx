import { Eye, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import RowActions from '../../../components/ui/RowActions';
import Badge from '../../../components/ui/Badge';
import { STATUS_BADGE_VARIANTS, TYPE_BADGE_VARIANTS, TYPE_LABELS, STATUS_LABELS } from '../../../domain/orderStatus';

export default function OrdersTable({ orders, currency, onView, onEdit, onDelete }) {
  const columns = [
    { accessorKey: 'id', header: 'Order #', render: (value) => `#${value}` },
    { accessorKey: 'customer_name', header: 'Customer' },
    {
      accessorKey: 'order_type',
      header: 'Type',
      render: (value) => <Badge variant={TYPE_BADGE_VARIANTS[value]}>{TYPE_LABELS[value]}</Badge>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      render: (value) => <Badge variant={STATUS_BADGE_VARIANTS[value]}>{STATUS_LABELS[value]}</Badge>,
    },
    {
      accessorKey: 'payment_method',
      header: 'Payment',
      render: (value) => (
        <span className="capitalize">{value.replace('_', ' ')}</span>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: 'Total',
      render: (value) => (
        <span className="font-medium">
          {currency} {Number(value).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessorKey: '__actions',
      header: 'Actions',
      render: (_value, row) => (
        <RowActions
          actions={[
            { icon: Eye, label: 'View', variant: 'primary', onClick: () => onView(row) },
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
      data={orders}
      searchKeys={['customer_name', 'order_type', 'status']}
      searchPlaceholder="Search orders…"
      emptyMessage="No orders found."
    />
  );
}
