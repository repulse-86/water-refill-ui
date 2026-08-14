import { Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import RowActions from '../../../components/ui/RowActions';
import Badge from '../../../components/ui/Badge';
import { typeLabels } from '../../../store/productsStore';

const typeBadgeVariants = {
  water_refill: 'blue',
  accessory: 'slate',
  equipment: 'violet',
};

export default function ProductsTable({ products, currency, onEdit, onDelete }) {
  const columns = [
    { accessorKey: 'name', header: 'Product' },
    {
      accessorKey: 'type',
      header: 'Type',
      render: (value) => <Badge variant={typeBadgeVariants[value]}>{typeLabels[value]}</Badge>,
    },
    {
      accessorKey: 'volume_gallons',
      header: 'Volume',
      render: (value, row) => (row.type === 'water_refill' ? `${value} gal` : '—'),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      render: (value) => (
        <span className="font-medium">
          {currency} {Number(value).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'stock_quantity',
      header: 'Stock',
      render: (value, row) => {
        const isLow = Number(value) <= Number(row.reorder_point);
        return isLow ? <span className="font-medium text-red-600">{value} (low)</span> : value;
      },
    },
    { accessorKey: 'reorder_point', header: 'Reorder At' },
    {
      accessorKey: 'id',
      header: 'Actions',
      render: (_value, row) => (
        <RowActions
          actions={[
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
      data={products}
      searchKeys={['name', 'type']}
      searchPlaceholder="Search products…"
      emptyMessage="No products found."
    />
  );
}