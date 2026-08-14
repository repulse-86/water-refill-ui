import { MapPin } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import RowActions from '../../../components/ui/RowActions';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/date';
import { DELIVERY_STATUS_BADGE_VARIANTS, DELIVERY_STATUSES } from '../../../domain/orderStatus';

export default function DeliveryTable({ deliveryOrders, currency, onRecord }) {
  const columns = [
    { accessorKey: 'id', header: 'Order #', render: (value) => `#${value}` },
    { accessorKey: 'customer_name', header: 'Customer' },
    { accessorKey: 'delivery_address', header: 'Address', render: (value) => value || '—' },
    {
      accessorKey: 'delivery_status',
      header: 'Delivery Status',
      render: (value) => (
        <Badge variant={DELIVERY_STATUS_BADGE_VARIANTS[value] || 'slate'}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
        </Badge>
      ),
    },
    {
      accessorKey: 'delivery_fee',
      header: 'Delivery Fee',
      render: (value) => (
        <span className="font-medium">{currency} {Number(value).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: 'Total',
      render: (value) => (
        <span className="font-medium">{currency} {Number(value).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'bottles_returned_at_delivery',
      header: 'Bottles Returned',
      render: (value) => value || 0,
    },
    {
      accessorKey: 'cash_collected_at_delivery',
      header: 'Cash Collected',
      render: (value) => `${currency} ${Number(value).toFixed(2)}`,
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      render: (value) => formatDate(value),
    },
    {
      accessorKey: '__actions',
      header: 'Actions',
      render: (_value, row) => (
        <RowActions
          actions={[
            {
              icon: MapPin,
              label: 'Record Delivery',
              variant: 'primary',
              disabled:
                row.delivery_status === DELIVERY_STATUSES.delivered ||
                row.delivery_status === DELIVERY_STATUSES.failed,
              onClick: () => onRecord(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={deliveryOrders}
      searchKeys={['customer_name', 'delivery_address', 'delivery_status']}
      searchPlaceholder="Search deliveries…"
      emptyMessage="No delivery orders found."
    />
  );
}
