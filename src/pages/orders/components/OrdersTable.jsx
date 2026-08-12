import { Eye, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import IconButton from '../../../components/ui/IconButton';
import Badge from '../../../components/ui/Badge';

const statusBadgeVariants = {
  queued: 'slate',
  processing: 'amber',
  transit: 'blue',
  completed: 'green',
};

const typeBadgeVariants = {
  walk_in: 'slate',
  delivery: 'violet',
};

export default function OrdersTable({ orders, currency, onView, onEdit, onDelete }) {
  const columns = [
    { accessorKey: 'id', header: 'Order #', render: (value) => `#${value}` },
    { accessorKey: 'customer_name', header: 'Customer' },
    {
      accessorKey: 'order_type',
      header: 'Type',
      render: (value) => <Badge variant={typeBadgeVariants[value]}>{value === 'walk_in' ? 'Walk-In' : 'Delivery'}</Badge>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      render: (value) => <Badge variant={statusBadgeVariants[value]}>{value.charAt(0).toUpperCase() + value.slice(1)}</Badge>,
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
      accessorKey: 'id',
      header: 'Actions',
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <IconButton icon={Eye} onClick={() => onView(row)} title="View" variant="primary" />
          <IconButton icon={Pencil} onClick={() => onEdit(row)} title="Edit" variant="edit" />
          <IconButton icon={Trash2} onClick={() => onDelete(row)} title="Delete" variant="danger" />
        </div>
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
