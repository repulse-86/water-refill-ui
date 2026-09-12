import { Package, Pencil, Trash2, RotateCcw } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import RowActions from '../../../components/ui/RowActions';
import Badge from '../../../components/ui/Badge';
import { formatDateTime } from '../../../utils/date';
import { typeLabels } from '../../../store/productsStore';

const typeBadgeVariants = {
  water_refill: 'blue',
  accessory: 'slate',
  equipment: 'violet',
};

export default function ProductsTable({
  products,
  currency,
  isLoading,
  viewMode = 'active',
  onEdit,
  onDelete,
  onRestore,
  onPermanentDelete,
  currentPage,
  perPage,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
}) {
  const baseColumns = [
    {
      accessorKey: 'name',
      header: 'Product',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.image ? (
            <img src={row.image} alt={value} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Package className="w-4 h-4" />
            </div>
          )}
          <span className="font-medium text-slate-900">{value}</span>
        </div>
      ),
    },
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
  ];

  const columns = [
    ...baseColumns,
    ...(viewMode === 'archived'
      ? [{ accessorKey: 'deleted_at', header: 'Archived', render: (value) => formatDateTime(value) }]
      : []),
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
      isLoading={isLoading}
      searchKeys={['name', 'type']}
      searchPlaceholder="Search products…"
      emptyMessage="No products found."
      manualPagination
      currentPage={currentPage}
      pageSize={perPage}
      pageCount={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    />
  );
}
